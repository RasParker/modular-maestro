import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Navbar } from '@/components/shared/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const FanSettings: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isPreferencesLoading, setIsPreferencesLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    contentUpdates: true,
    promotionalEmails: false,
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showInSearch: true,
    allowDirectMessages: 'subscribed',
    showActivity: false,
  });

  const [subscriptionSettings, setSubscriptionSettings] = useState({
    autoRenew: true,
    monthlySpendingLimit: 500,
    renewalReminders: true,
    paymentFailureNotifications: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    loginNotifications: true,
    suspiciousActivityAlerts: true,
  });

  const [contentSettings, setContentSettings] = useState({
    adultContent: false,
    contentFiltering: 'moderate',
    autoplayVideos: true,
    showPreviews: true,
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateUser({ 
        username: formData.username,
        email: formData.email 
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    setIsPasswordLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Password changed",
        description: "Your password has been successfully updated.",
      });
      
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>

          {/* Profile Settings */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and profile details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={user?.avatar} alt={user?.username} />
                  <AvatarFallback className="text-lg">
                    {user?.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline">Change Avatar</Button>
              </div>
              
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>
                
                <Button type="submit" disabled={isProfileLoading}>
                  {isProfileLoading ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Password Settings */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    />
                  </div>
                </div>
                
                <Button type="submit" disabled={isPasswordLoading}>
                  {isPasswordLoading ? "Updating..." : "Change Password"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how you receive notifications and updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={preferences.emailNotifications}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({ ...prev, emailNotifications: checked }))
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications in your browser
                    </p>
                  </div>
                  <Switch
                    checked={preferences.pushNotifications}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({ ...prev, pushNotifications: checked }))
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Content Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when creators you follow post new content
                    </p>
                  </div>
                  <Switch
                    checked={preferences.contentUpdates}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({ ...prev, contentUpdates: checked }))
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Promotional Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive emails about new features and promotions
                    </p>
                  </div>
                  <Switch
                    checked={preferences.promotionalEmails}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({ ...prev, promotionalEmails: checked }))
                    }
                  />
                </div>
              </div>
              
              <Button 
                onClick={async () => {
                  setIsPreferencesLoading(true);
                  try {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    toast({
                      title: "Preferences saved",
                      description: "Your notification preferences have been updated.",
                    });
                  } catch (error) {
                    toast({
                      title: "Save failed",
                      description: "Failed to save preferences. Please try again.",
                      variant: "destructive",
                    });
                  } finally {
                    setIsPreferencesLoading(false);
                  }
                }}
                disabled={isPreferencesLoading}
              >
                {isPreferencesLoading ? "Saving..." : "Save Preferences"}
              </Button>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Privacy & Visibility</CardTitle>
              <CardDescription>
                Control who can see your profile and activity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Profile Visibility</Label>
                  <select 
                    className="w-full p-2 border rounded-md bg-background"
                    value={privacySettings.profileVisibility}
                    onChange={(e) => setPrivacySettings(prev => ({ ...prev, profileVisibility: e.target.value }))}
                  >
                    <option value="public">Public - Anyone can view</option>
                    <option value="subscribers">Subscribers Only</option>
                    <option value="private">Private - Hidden</option>
                  </select>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show in Search Results</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow others to find your profile in search
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.showInSearch}
                    onCheckedChange={(checked) => 
                      setPrivacySettings(prev => ({ ...prev, showInSearch: checked }))
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label>Who can message you</Label>
                  <select 
                    className="w-full p-2 border rounded-md bg-background"
                    value={privacySettings.allowDirectMessages}
                    onChange={(e) => setPrivacySettings(prev => ({ ...prev, allowDirectMessages: e.target.value }))}
                  >
                    <option value="everyone">Everyone</option>
                    <option value="subscribed">Creators I'm subscribed to</option>
                    <option value="none">No one</option>
                  </select>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Activity Status</Label>
                    <p className="text-sm text-muted-foreground">
                      Let others see when you're online
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.showActivity}
                    onCheckedChange={(checked) => 
                      setPrivacySettings(prev => ({ ...prev, showActivity: checked }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Management */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Subscription Preferences</CardTitle>
              <CardDescription>
                Manage your subscription and payment settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Renewal</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically renew subscriptions when they expire
                    </p>
                  </div>
                  <Switch
                    checked={subscriptionSettings.autoRenew}
                    onCheckedChange={(checked) => 
                      setSubscriptionSettings(prev => ({ ...prev, autoRenew: checked }))
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="spendingLimit">Monthly Spending Limit ($)</Label>
                  <Input
                    id="spendingLimit"
                    type="number"
                    value={subscriptionSettings.monthlySpendingLimit}
                    onChange={(e) => setSubscriptionSettings(prev => ({ 
                      ...prev, 
                      monthlySpendingLimit: parseInt(e.target.value) || 0 
                    }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Set to 0 for no limit
                  </p>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Renewal Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified before subscriptions renew
                    </p>
                  </div>
                  <Switch
                    checked={subscriptionSettings.renewalReminders}
                    onCheckedChange={(checked) => 
                      setSubscriptionSettings(prev => ({ ...prev, renewalReminders: checked }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Security & Login</CardTitle>
              <CardDescription>
                Secure your account with additional protection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={securitySettings.twoFactorEnabled}
                      onCheckedChange={(checked) => 
                        setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: checked }))
                      }
                    />
                    {!securitySettings.twoFactorEnabled && (
                      <Button variant="outline" size="sm">
                        Setup 2FA
                      </Button>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Login Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified of new logins to your account
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.loginNotifications}
                    onCheckedChange={(checked) => 
                      setSecuritySettings(prev => ({ ...prev, loginNotifications: checked }))
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    View Login History
                  </Button>
                  <Button variant="outline" className="w-full">
                    Revoke All Sessions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Preferences */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Content Preferences</CardTitle>
              <CardDescription>
                Customize your content viewing experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Content Filtering</Label>
                  <select 
                    className="w-full p-2 border rounded-md bg-background"
                    value={contentSettings.contentFiltering}
                    onChange={(e) => setContentSettings(prev => ({ ...prev, contentFiltering: e.target.value }))}
                  >
                    <option value="none">No filtering</option>
                    <option value="moderate">Moderate filtering</option>
                    <option value="strict">Strict filtering</option>
                  </select>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Adult Content</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow mature content in your feed
                    </p>
                  </div>
                  <Switch
                    checked={contentSettings.adultContent}
                    onCheckedChange={(checked) => 
                      setContentSettings(prev => ({ ...prev, adultContent: checked }))
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Autoplay Videos</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically play videos in your feed
                    </p>
                  </div>
                  <Switch
                    checked={contentSettings.autoplayVideos}
                    onCheckedChange={(checked) => 
                      setContentSettings(prev => ({ ...prev, autoplayVideos: checked }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data & Account */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Data & Account Management</CardTitle>
              <CardDescription>
                Manage your account data and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Download Your Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Download a copy of your account data and activity
                  </p>
                  <Button variant="outline" className="w-full">
                    Request Data Download
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="font-medium">Blocked Creators</h4>
                  <p className="text-sm text-muted-foreground">
                    Manage creators you've blocked
                  </p>
                  <Button variant="outline" className="w-full">
                    Manage Blocked List
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="font-medium text-destructive">Danger Zone</h4>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all data
                  </p>
                  <Button variant="destructive" className="w-full">
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};