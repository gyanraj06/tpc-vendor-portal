# Supabase Auth Migration Guide

## What Changed: Custom Auth → Supabase Auth

### Before (Custom Auth):
- ❌ Plain text passwords in `vendors` table
- ❌ Manual session management with localStorage
- ❌ No email verification
- ❌ No password reset functionality
- ❌ Security vulnerabilities

### After (Supabase Auth):
- ✅ Secure password hashing (bcrypt/scrypt)
- ✅ JWT-based session management
- ✅ Email verification built-in
- ✅ Password reset functionality
- ✅ OAuth integration (Google, etc.)
- ✅ Row Level Security (RLS) integration

## Required Supabase Dashboard Configuration

### Step 1: Run Database Migration

Execute this migration in your Supabase SQL Editor:

```sql
-- Run the migration file: supabase/migrations/20250105_migrate_to_supabase_auth.sql
```

This will:
- Create `vendor_profiles` table linked to `auth.users`
- Set up RLS policies
- Create triggers for automatic profile creation
- Preserve all your existing vendor data structure

### Step 2: Configure Auth Settings

Go to **Authentication > Settings** in your Supabase Dashboard:

#### General Settings:
- ✅ **Enable email confirmations**: OFF (for development) / ON (for production)
- ✅ **Enable email change confirmations**: ON
- ✅ **Enable manual linking**: OFF
- ✅ **Enable phone confirmations**: OFF

#### Email Templates:
- **Confirm signup**: Customize with your branding
- **Reset password**: Customize with your branding  
- **Magic link**: Customize with your branding

#### URL Configuration:
- **Site URL**: `http://localhost:5173` (development) / `https://yourdomain.com` (production)
- **Redirect URLs**: 
  - `http://localhost:5173/dashboard`
  - `https://yourdomain.com/dashboard`

### Step 3: Configure Email Provider (Optional)

For production, configure SMTP in **Authentication > Settings > SMTP**:
- Use services like SendGrid, Mailgun, or AWS SES
- This enables custom email templates and better deliverability

### Step 4: OAuth Providers (Optional)

To enable Google Sign-in:
1. Go to **Authentication > Providers**
2. Enable **Google**
3. Add your Google OAuth credentials:
   - Client ID
   - Client Secret
   - Redirect URL: `https://your-project.supabase.co/auth/v1/callback`

## Data Migration (If Needed)

If you have existing users in the old `vendors` table:

```sql
-- Step 1: Backup existing data
CREATE TABLE vendors_backup AS SELECT * FROM vendors;

-- Step 2: Manually migrate users (run for each existing user)
-- You'll need to ask users to reset passwords since we can't migrate plain text passwords
INSERT INTO auth.users (email, email_confirmed_at, created_at, updated_at)
VALUES ('user@example.com', NOW(), NOW(), NOW());

-- Step 3: Profile will be created automatically by trigger
```

## How the New System Works

### 1. User Registration Flow:
```
User submits form → Supabase Auth creates user → Trigger creates vendor_profile → Complete
```

### 2. Login Flow:
```
User submits credentials → Supabase Auth validates → Get vendor_profile → Return combined data
```

### 3. Session Management:
```
Supabase manages JWT tokens → Auto-refresh → RLS works automatically
```

### 4. Data Structure:
```
auth.users (managed by Supabase)
├── id (UUID)
├── email
├── encrypted_password
├── email_confirmed_at
└── user_metadata

vendor_profiles (your business data)
├── id (references auth.users.id)
├── name
├── phone  
├── address
├── vendor_type
├── avatar_url
└── is_first_login
```

## Benefits You'll Get

### Security:
- ✅ **Password Security**: Automatic bcrypt hashing
- ✅ **Session Security**: JWT tokens with automatic refresh
- ✅ **CSRF Protection**: Built-in protection
- ✅ **Rate Limiting**: Protection against brute force attacks

### Features:
- ✅ **Email Verification**: Users must verify email addresses
- ✅ **Password Reset**: Secure reset via email
- ✅ **Social Login**: Google, GitHub, etc.
- ✅ **Magic Links**: Passwordless authentication option

### Developer Experience:
- ✅ **RLS Integration**: Row-level security works seamlessly
- ✅ **Realtime**: Auth state syncs across tabs
- ✅ **Mobile Ready**: Works with React Native
- ✅ **TypeScript**: Full type safety

## Testing the Migration

### 1. Create New Account:
- Go to `/signup`
- Register with new email
- Check email for confirmation (if enabled)
- Complete profile setup

### 2. Test Login:
- Go to `/`
- Login with new credentials
- Verify dashboard loads correctly
- Check avatar upload still works

### 3. Test Google OAuth:
- Click "Continue with Google" 
- Verify profile creation
- Check all features work

## Rollback Plan (If Needed)

If issues arise, you can temporarily revert:

```sql
-- Restore old auth service (keep backup of new code)
-- Update AuthService to use old vendors table
-- This should only be temporary while fixing issues
```

## Production Deployment

Before going live:
1. ✅ Enable email confirmations
2. ✅ Configure custom SMTP provider
3. ✅ Set up proper redirect URLs
4. ✅ Test all auth flows thoroughly
5. ✅ Update any hardcoded URLs
6. ✅ Configure proper CORS settings

Your vendor portal now has enterprise-grade authentication! 🎉