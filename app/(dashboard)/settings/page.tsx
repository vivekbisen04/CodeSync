'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { toast } from 'react-hot-toast';
import { 
  User,
  Lock,
  Bell,
  Palette,
  Github,
  Twitter,
  Globe,
  Save,
  Trash2
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState(session?.user?.image || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync avatar URL with session changes
  useEffect(() => {
    setCurrentAvatarUrl(session?.user?.image || null);
  }, [session?.user?.image]);

  // Load user profile data
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          const userData = await response.json();
          setProfile({
            name: userData.name || '',
            username: userData.username || '',
            email: userData.email || '',
            bio: userData.bio || '',
            location: userData.location || '',
            website: userData.website || '',
            githubUrl: userData.githubUrl || '',
            twitterUrl: userData.twitterUrl || '',
          });
          
          // Load preferences
          const userTheme = userData.theme || 'system';
          setPreferences({
            theme: userTheme,
            language: userData.language || 'en',
            defaultSnippetVisibility: userData.defaultSnippetVisibility || 'public',
            showEmail: userData.showEmail || false,
            showLocation: userData.showLocation !== undefined ? userData.showLocation : true,
          });
          
          // Set theme in next-themes
          if (userTheme !== theme) {
            setTheme(userTheme);
          }
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    };

    if ((session?.user as any)?.id) {
      loadUserProfile();
    }
  }, [(session?.user as any)?.id]);
  
  const [profile, setProfile] = useState({
    name: session?.user?.name || '',
    username: (session?.user as any)?.username || '',
    email: session?.user?.email || '',
    bio: '',
    location: '',
    website: '',
    githubUrl: '',
    twitterUrl: '',
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    commentsOnSnippets: true,
    likesOnSnippets: true,
    newFollowers: true,
    weeklyDigest: false,
  });

  const [preferences, setPreferences] = useState({
    theme: 'system',
    language: 'en',
    defaultSnippetVisibility: 'public',
    showEmail: false,
    showLocation: true,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Update session with new profile data
      await update();

      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationUpdate = (key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePreferenceUpdate = async (key: string, value: string | boolean) => {
    // Update local state immediately for responsiveness
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));

    // Handle theme changes in next-themes
    if (key === 'theme' && typeof value === 'string') {
      setTheme(value);
    }

    // Save to database
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          [key]: value,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update preference');
      }

      toast.success('Preference updated successfully!');
    } catch (error) {
      console.error('Preference update error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update preference');
      
      // Revert local state on error
      const previousValue = preferences[key as keyof typeof preferences];
      setPreferences(prev => ({
        ...prev,
        [key]: previousValue,
      }));
      
      // Revert theme if it was a theme change
      if (key === 'theme' && typeof previousValue === 'string') {
        setTheme(previousValue);
      }
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB');
      return;
    }

    setIsUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload avatar');
      }

      // Update local state to immediately show new avatar
      setCurrentAvatarUrl(data.imageUrl);
      
      // Update session with new avatar URL
      console.log('Updating session with new image URL:', data.imageUrl);
      
      // Force session refresh with explicit data
      await update({
        image: data.imageUrl
      });
      
      // Force a page refresh to ensure session is updated everywhere
      setTimeout(() => {
        window.location.reload();
      }, 500);

      toast.success('Avatar updated successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload avatar');
    } finally {
      setIsUploadingAvatar(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveAvatar = async () => {
    setIsUploadingAvatar(true);

    try {
      const response = await fetch('/api/profile/avatar', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to remove avatar');
      }

      // Update local state to immediately hide avatar
      setCurrentAvatarUrl(null);
      
      // Update session to remove avatar
      await update({
        image: null
      });
      
      // Force a page refresh to ensure session is updated everywhere
      setTimeout(() => {
        window.location.reload();
      }, 500);

      toast.success('Avatar removed successfully!');
    } catch (error) {
      console.error('Remove avatar error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to remove avatar');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    setIsChangingPassword(true);

    try {
      const response = await fetch('/api/profile/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }

      // Reset password form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      toast.success('Password changed successfully!');
    } catch (error) {
      console.error('Password change error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Please sign in to access settings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={currentAvatarUrl || undefined} />
                  <AvatarFallback className="text-lg">
                    {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={handleAvatarClick}
                      disabled={isUploadingAvatar}
                    >
                      {isUploadingAvatar ? 'Uploading...' : 'Change Avatar'}
                    </Button>
                    {currentAvatarUrl && (
                      <Button 
                        variant="outline" 
                        onClick={handleRemoveAvatar}
                        disabled={isUploadingAvatar}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Username</label>
                  <Input
                    value={profile.username}
                    onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="@username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Bio</label>
                <Textarea
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
                <p className="text-sm text-muted-foreground">
                  Brief description for your profile. Maximum 160 characters.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    value={profile.location}
                    onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="San Francisco, CA"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Website</label>
                  <Input
                    value={profile.website}
                    onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">GitHub URL</label>
                  <Input
                    value={profile.githubUrl}
                    onChange={(e) => setProfile(prev => ({ ...prev, githubUrl: e.target.value }))}
                    placeholder="https://github.com/username"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Twitter URL</label>
                  <Input
                    value={profile.twitterUrl}
                    onChange={(e) => setProfile(prev => ({ ...prev, twitterUrl: e.target.value }))}
                    placeholder="https://twitter.com/username"
                  />
                </div>
              </div>

              <Button onClick={handleProfileUpdate} disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries({
                emailNotifications: 'Email notifications',
                commentsOnSnippets: 'Comments on your snippets',
                likesOnSnippets: 'Likes on your snippets',
                newFollowers: 'New followers',
                weeklyDigest: 'Weekly digest',
              }).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">{label}</label>
                  </div>
                  <Switch
                    checked={notifications[key as keyof typeof notifications]}
                    onCheckedChange={(checked) => handleNotificationUpdate(key, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Push Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Browser notifications</label>
                  <p className="text-sm text-muted-foreground">
                    Get notified in your browser when someone interacts with your content
                  </p>
                </div>
                <Switch
                  checked={notifications.pushNotifications}
                  onCheckedChange={(checked) => handleNotificationUpdate('pushNotifications', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Theme</label>
                <Select
                  value={preferences.theme}
                  onValueChange={(value) => handlePreferenceUpdate('theme', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Default Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Default snippet visibility</label>
                <Select
                  value={preferences.defaultSnippetVisibility}
                  onValueChange={(value) => handlePreferenceUpdate('defaultSnippetVisibility', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Show email in profile</label>
                  <p className="text-sm text-muted-foreground">
                    Make your email visible to other users
                  </p>
                </div>
                <Switch
                  checked={preferences.showEmail}
                  onCheckedChange={(checked) => handlePreferenceUpdate('showEmail', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Show location in profile</label>
                  <p className="text-sm text-muted-foreground">
                    Make your location visible to other users
                  </p>
                </div>
                <Switch
                  checked={preferences.showLocation}
                  onCheckedChange={(checked) => handlePreferenceUpdate('showLocation', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Password</label>
                <Input 
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Enter your current password"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">New Password</label>
                <Input 
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter new password (min. 6 characters)"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm New Password</label>
                <Input 
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm your new password"
                />
              </div>
              <Button onClick={handlePasswordChange} disabled={isChangingPassword}>
                <Lock className="mr-2 h-4 w-4" />
                {isChangingPassword ? 'Updating...' : 'Update Password'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border border-red-200 rounded-lg p-4 space-y-4">
                <div>
                  <h3 className="font-medium text-red-600">Delete Account</h3>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                </div>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}