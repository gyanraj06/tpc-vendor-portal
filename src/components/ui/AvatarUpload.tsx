import React, { useState, useRef } from 'react';
import { Camera, X, User } from 'lucide-react';

interface AvatarUploadProps {
  currentAvatar?: string | null;
  onAvatarChange: (file: File | null) => void;
  isUploading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  onAvatarChange,
  isUploading = false,
  size = 'lg'
}) => {
  const [preview, setPreview] = useState<string | null>(currentAvatar || null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24', 
    lg: 'w-32 h-32'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      onAvatarChange(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeAvatar = () => {
    setPreview(null);
    onAvatarChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div
          className={`${sizeClasses[size]} relative rounded-full border-2 border-dashed border-gray-300 hover:border-brand-blue-400 transition-colors cursor-pointer overflow-hidden ${
            dragOver ? 'border-brand-blue-500 bg-brand-blue-50' : ''
          } ${isUploading ? 'opacity-50' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
        >
          {preview ? (
            <img
              src={preview}
              alt="Avatar preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center flex-col bg-gray-50">
              <User size={iconSizes[size]} className="text-gray-400 mb-1" />
              <span className="text-xs text-gray-500 text-center px-1">
                Click or drag
              </span>
            </div>
          )}

          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            </div>
          )}
        </div>

        {preview && !isUploading && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeAvatar();
            }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <X size={12} />
          </button>
        )}

        <button
          onClick={openFileDialog}
          className="absolute bottom-0 right-0 w-8 h-8 bg-brand-blue-600 hover:bg-brand-blue-700 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
          disabled={isUploading}
        >
          <Camera size={16} />
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />

      <p className="text-xs text-gray-500 mt-2 text-center max-w-32">
        Upload JPG, PNG or GIF (max 5MB)
      </p>
    </div>
  );
};