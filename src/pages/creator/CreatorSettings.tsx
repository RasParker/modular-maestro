import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Navbar } from '@/components/shared/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const CreatorSettings: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    displayName: 'Amazing Creator',
    bio: 'Digital artist creating stunning fantasy worlds and characters.',
    website: 'https://myportfolio.com',
    twitter: '@amazingcreator',
    instagram: '@amazing.creator',
  });

  const [contentSettings, setContentSettings] = useState({
    autoApproveComments: true,
    allowDirectMessages: true,
    nsfwContent: false,
    minimumAge: 18,
  });

  const [payoutSettings, setPayoutSettings] = useState({
    paypalEmail: 'creator@example.com',
    bankAccount: '****1234',
    minimumPayout: 50,
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateUser({ 
        username: profileData.username,
        email: profileData.email 
      });
      
      toast({
        title: "Profile updated",
        description: "Your creator profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Creator Settings</h1>
            <p className="text-muted-foreground">Manage your creator profile and preferences</p>
          </div>

          {/* Profile Settings */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your public creator profile information
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
                <div className="space-y-2">
                  <Button variant="outline">Change Avatar</Button>
                  <Button variant="outline">Upload Cover Image</Button>
                </div>
              </div>
              
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={profileData.username}
                      onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={profileData.displayName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell your fans about yourself..."
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={profileData.website}
                      onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Contact Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter Handle</Label>
                    <Input
                      id="twitter"
                      placeholder="@username"
                      value={profileData.twitter}
                      onChange={(e) => setProfileData(prev => ({ ...prev, twitter: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram Handle</Label>
                    <Input
                      id="instagram"
                      placeholder="@username"
                      value={profileData.instagram}
                      onChange={(e) => setProfileData(prev => ({ ...prev, instagram: e.target.value }))}
                    />
                  </div>
                </div>
                
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Content Settings */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Content Settings</CardTitle>
              <CardDescription>
                Manage how your content is displayed and moderated
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-approve Comments</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically approve comments from subscribers
                    </p>
                  </div>
                  <Switch
                    checked={contentSettings.autoApproveComments}
                    onCheckedChange={(checked) => 
                      setContentSettings(prev => ({ ...prev, autoApproveComments: checked }))
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Direct Messages</Label>
                    <p className="text-sm text-muted-foreground">
                      Let subscribers send you direct messages
                    </p>
                  </div>
                  <Switch
                    checked={contentSettings.allowDirectMessages}
                    onCheckedChange={(checked) => 
                      setContentSettings(prev => ({ ...prev, allowDirectMessages: checked }))
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>NSFW Content</Label>
                    <p className="text-sm text-muted-foreground">
                      Mark your content as not safe for work
                    </p>
                  </div>
                  <Switch
                    checked={contentSettings.nsfwContent}
                    onCheckedChange={(checked) => 
                      setContentSettings(prev => ({ ...prev, nsfwContent: checked }))
                    }
                  />
                </div>
              </div>
              
              <Button>Save Content Settings</Button>
            </CardContent>
          </Card>

          {/* Payout Settings */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Payout Settings</CardTitle>
              <CardDescription>
                Manage your payment information and payout preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paypalEmail">PayPal Email</Label>
                  <Input
                    id="paypalEmail"
                    type="email"
                    value={payoutSettings.paypalEmail}
                    onChange={(e) => setPayoutSettings(prev => ({ ...prev, paypalEmail: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minimumPayout">Minimum Payout ($)</Label>
                  <Input
                    id="minimumPayout"
                    type="number"
                    min="10"
                    value={payoutSettings.minimumPayout}
                    onChange={(e) => setPayoutSettings(prev => ({ ...prev, minimumPayout: parseInt(e.target.value) }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Bank Account</Label>
                <div className="flex gap-2">
                  <Input value={payoutSettings.bankAccount} disabled />
                  <Button variant="outline">Update</Button>
                </div>
              </div>
              
              <Button>Save Payout Settings</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};