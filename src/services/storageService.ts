import { supabase } from '../lib/supabase';

export class StorageService {
  private static readonly AVATAR_BUCKET = 'avatars';


  /**
   * Upload avatar image to Supabase Storage
   */
  static async uploadAvatar(vendorId: string, file: File): Promise<string | null> {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${vendorId}-${Date.now()}.${fileExt}`;
      const filePath = `vendors/${fileName}`;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(this.AVATAR_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Error uploading avatar:', error);
        return null;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(this.AVATAR_BUCKET)
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error in uploadAvatar:', error);
      return null;
    }
  }

  /**
   * Delete avatar from Supabase Storage
   */
  static async deleteAvatar(avatarUrl: string): Promise<boolean> {
    try {
      // Extract file path from URL
      const url = new URL(avatarUrl);
      const pathParts = url.pathname.split('/');
      const bucketIndex = pathParts.findIndex(part => part === this.AVATAR_BUCKET);
      
      if (bucketIndex === -1) {
        console.error('Invalid avatar URL format');
        return false;
      }

      const filePath = pathParts.slice(bucketIndex + 1).join('/');

      const { error } = await supabase.storage
        .from(this.AVATAR_BUCKET)
        .remove([filePath]);

      if (error) {
        console.error('Error deleting avatar:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteAvatar:', error);
      return false;
    }
  }

  /**
   * Update vendor avatar URL in database
   */
  static async updateVendorAvatar(vendorId: string, avatarUrl: string | null): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('vendor_profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', vendorId);

      if (error) {
        console.error('Error updating vendor avatar:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateVendorAvatar:', error);
      return false;
    }
  }

  /**
   * Complete avatar upload process (upload file + update database)
   */
  static async uploadAndUpdateAvatar(
    vendorId: string, 
    file: File, 
    currentAvatarUrl?: string | null
  ): Promise<string | null> {
    try {
      // Delete old avatar if exists
      if (currentAvatarUrl) {
        await this.deleteAvatar(currentAvatarUrl);
      }

      // Upload new avatar
      const newAvatarUrl = await this.uploadAvatar(vendorId, file);
      
      if (!newAvatarUrl) {
        return null;
      }

      // Update database
      const success = await this.updateVendorAvatar(vendorId, newAvatarUrl);
      
      if (!success) {
        // If database update fails, clean up uploaded file
        await this.deleteAvatar(newAvatarUrl);
        return null;
      }

      return newAvatarUrl;
    } catch (error) {
      console.error('Error in uploadAndUpdateAvatar:', error);
      return null;
    }
  }

  /**
   * Remove avatar completely (delete file + update database)
   */
  static async removeAvatar(vendorId: string, currentAvatarUrl: string): Promise<boolean> {
    try {
      // Delete file from storage
      const fileDeleted = await this.deleteAvatar(currentAvatarUrl);
      
      // Update database (remove avatar_url)
      const dbUpdated = await this.updateVendorAvatar(vendorId, null);

      return fileDeleted && dbUpdated;
    } catch (error) {
      console.error('Error in removeAvatar:', error);
      return false;
    }
  }

}