import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/shared/Navbar';
import { ArrowLeft, Save, Upload, Shield, Key, Smartphone, Eye, EyeOff, Trash2, Camera, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { setLocalStorageItem, getLocalStorageItem } from '@/lib/storage-utils';

export const CreatorSettings: React.FC = () => {
  const { toast } = useToast();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('mtn-momo');
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(
    getLocalStorageItem('profilePhotoUrl')
  );
  const [coverPhotoUrl, setCoverPhotoUrl] = useState<string | null>(
    getLocalStorageItem('coverPhotoUrl')
  );
  const [displayName, setDisplayName] = useState<string>(
    getLocalStorageItem('displayName') || ''
  );
  const [bio, setBio] = useState<string>(
    getLocalStorageItem('bio') || ''
  );

  const handleSave = () => {
    // Save display name and bio to localStorage
    if (displayName.trim()) {
      console.log('Saving display name:', displayName);
      setLocalStorageItem('displayName', displayName.trim());
    }
    
    if (bio.trim()) {
      setLocalStorageItem('bio', bio.trim());
    }
    
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account deletion requested",
      description: "Please check your email for confirmation instructions.",
      variant: "destructive",
    });
  };

  const handleProfilePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        console.log('Uploading profile photo:', file.name);
        // Create FormData to send the file
        const formData = new FormData();
        formData.append('profilePhoto', file);

        // Upload to backend
        const response = await fetch('/api/upload/profile-photo', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const result = await response.json();
        console.log('Upload result:', result);

        // Update the profile photo URL state
        setProfilePhotoUrl(result.url);
        // Save to localStorage so it persists across pages
        setLocalStorageItem('profilePhotoUrl', result.url);

        toast({
          title: "Profile photo updated",
          description: "Your profile photo has been updated successfully.",
        });
      } catch (error) {
        toast({
          title: "Upload failed",
          description: "Failed to upload profile photo. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCoverPhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        console.log('Uploading cover photo:', file.name);
        // Create FormData to send the file
        const formData = new FormData();
        formData.append('coverPhoto', file);

        // Upload to backend
        const response = await fetch('/api/upload/cover-photo', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const result = await response.json();
        console.log('Upload result:', result);
        
        // Update the cover photo URL state
        setCoverPhotoUrl(result.url);
        // Save to localStorage so it persists across pages
        setLocalStorageItem('coverPhotoUrl', result.url);

        toast({
          title: "Cover photo updated",
          description: "Your cover photo has been updated successfully.",
        });
      } catch (error) {
        toast({
          title: "Upload failed",
          description: "Failed to upload cover photo. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-4">
            <Link to="/creator/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Creator Settings</h1>
              <p className="text-muted-foreground">
                Manage your account preferences and settings
              </p>
            </div>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="payouts">Payouts</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your public profile information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Cover Photo Section */}
                  <div className="space-y-3">
                    <Label>Cover Photo</Label>
                    <div className="relative">
                      <div className="w-full h-32 rounded-lg overflow-hidden border-2 border-dashed border-border">
                        {coverPhotoUrl ? (
                          <img 
                            src={coverPhotoUrl} 
                            alt="Cover photo" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
                            <span className="text-sm text-muted-foreground">Cover Photo Preview</span>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverPhotoUpload}
                        className="hidden"
                        id="cover-upload"
                      />
                      <label htmlFor="cover-upload">
                        <Button variant="outline" size="sm" className="absolute bottom-2 right-2 cursor-pointer" asChild>
                          <span>
                            <Image className="w-4 h-4 mr-2" />
                            Change Cover
                          </span>
                        </Button>
                      </label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Recommended size: 800x300px. Max file size: 5MB
                    </p>
                  </div>

                  {/* Profile Photo Section */}
                  <div className="space-y-3">
                    <Label>Profile Photo</Label>
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-border">
                        {profilePhotoUrl ? (
                          <img 
                            src={profilePhotoUrl} 
                            alt="Profile photo" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
                            <span className="text-xl font-bold text-primary-foreground">AA</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePhotoUpload}
                          className="hidden"
                          id="profile-upload"
                        />
                        <label htmlFor="profile-upload">
                          <Button variant="outline" className="cursor-pointer" asChild>
                            <span>
                              <Camera className="w-4 h-4 mr-2" />
                              Change Photo
                            </span>
                          </Button>
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Square image recommended. Max file size: 5MB
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input 
                      id="displayName" 
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter your display name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell your audience about yourself..."
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleSave} className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      Save Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle>Content Settings</CardTitle>
                  <CardDescription>
                    Configure how your content is displayed and monetized
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoPost">Auto-post to social media</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically share new posts on your connected social accounts
                      </p>
                    </div>
                    <Switch id="autoPost" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="watermark">Add watermark to images</Label>
                      <p className="text-sm text-muted-foreground">
                        Protect your content with your username watermark
                      </p>
                    </div>
                    <Switch id="watermark" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="comments">Allow comments</Label>
                      <p className="text-sm text-muted-foreground">
                        Let subscribers comment on your posts
                      </p>
                    </div>
                    <Switch id="comments" defaultChecked />
                  </div>

                  <div>
                    <Label htmlFor="defaultTier">Default content tier</Label>
                    <Select defaultValue="free">
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="basic">Basic Support</SelectItem>
                        <SelectItem value="premium">Premium Content</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payouts" className="space-y-6">
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle>Payout Settings</CardTitle>
                  <CardDescription>
                    Configure how you receive payments from your content
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="payoutMethod">Primary Payout Method</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mtn-momo">MTN Mobile Money</SelectItem>
                        <SelectItem value="vodafone-cash">Vodafone Cash</SelectItem>
                        <SelectItem value="airteltigo-money">AirtelTigo Money</SelectItem>
                        <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                        <SelectItem value="paystack">Paystack</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {paymentMethod.includes('momo') && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="momoNumber">Mobile Money Number</Label>
                        <Input id="momoNumber" defaultValue="+233 24 123 4567" />
                      </div>
                      <div>
                        <Label htmlFor="momoName">Account Name</Label>
                        <Input id="momoName" defaultValue="Akosua Art" />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'bank-transfer' && (
                    <div className="p-4 rounded-lg bg-muted/20 space-y-3">
                      <h4 className="font-medium text-foreground">Bank Details</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="bankName">Bank Name</Label>
                          <Select defaultValue="gcb">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="gcb">GCB Bank</SelectItem>
                              <SelectItem value="ecobank">Ecobank Ghana</SelectItem>
                              <SelectItem value="absa">Absa Bank Ghana</SelectItem>
                              <SelectItem value="stanbic">Stanbic Bank</SelectItem>
                              <SelectItem value="fidelity">Fidelity Bank</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="accountNumber">Account Number</Label>
                          <Input id="accountNumber" defaultValue="1234567890" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="accountName">Account Name</Label>
                        <Input id="accountName" defaultValue="Akosua Art" />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoWithdraw">Auto-withdraw earnings</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically withdraw when balance reaches GH₵ 500
                      </p>
                    </div>
                    <Switch id="autoWithdraw" />
                  </div>

                  <div>
                    <Label htmlFor="taxId">TIN (Tax Identification Number)</Label>
                    <Input id="taxId" placeholder="Enter your TIN for tax reporting" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Required for earnings above GH₵ 10,000 annually
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>
                    Keep your account secure with these settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Email Address */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Email Address</h4>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20">
                      <span className="text-sm">creator4@example.com</span>
                      <Button variant="outline" size="sm">Change Email</Button>
                    </div>
                  </div>

                  {/* Change Password */}
                  <div className="space-y-4 pt-4 border-t border-border/50">
                    <h4 className="font-medium text-foreground flex items-center gap-2">
                      <Key className="w-4 h-4" />
                      Password
                    </h4>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20">
                      <div>
                        <span className="text-sm font-medium">••••••••••••</span>
                        <p className="text-xs text-muted-foreground">Last changed 2 months ago</p>
                      </div>
                      <Button variant="outline" size="sm">Change Password</Button>
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="space-y-4 pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-foreground flex items-center gap-2">
                          <Smartphone className="w-4 h-4" />
                          Two-Factor Authentication
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch 
                        checked={twoFactorEnabled} 
                        onCheckedChange={setTwoFactorEnabled}
                      />
                    </div>
                    {twoFactorEnabled && (
                      <div className="p-4 rounded-lg bg-muted/20">
                        <p className="text-sm text-muted-foreground mb-3">
                          Scan this QR code with your authenticator app or enter the setup key manually.
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center">
                            <span className="text-xs text-gray-500">QR Code</span>
                          </div>
                          <div className="flex-1">
                            <Label htmlFor="setupKey">Setup Key</Label>
                            <Input id="setupKey" value="ABCD-EFGH-IJKL-MNOP" readOnly />
                            <Button variant="outline" size="sm" className="mt-2">Copy Key</Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Login Activity */}
                  <div className="space-y-4 pt-4 border-t border-border/50">
                    <h4 className="font-medium text-foreground">Recent Login Activity</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/10">
                        <div>
                          <p className="text-sm font-medium text-foreground">Current Session</p>
                          <p className="text-xs text-muted-foreground">Chrome on Windows • Accra, Ghana</p>
                        </div>
                        <Badge variant="outline" className="text-xs">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/10">
                        <div>
                          <p className="text-sm font-medium text-foreground">Mobile App</p>
                          <p className="text-xs text-muted-foreground">iPhone • 2 hours ago</p>
                        </div>
                        <Button variant="outline" size="sm">Revoke</Button>
                      </div>
                    </div>
                  </div>

                  {/* Privacy Settings */}
                  <div className="space-y-4 pt-4 border-t border-border/50">
                    <h4 className="font-medium text-foreground">Privacy Settings</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="profileVisibility">Profile Discovery</Label>
                          <p className="text-sm text-muted-foreground">Allow your profile to appear in search results</p>
                        </div>
                        <Switch id="profileVisibility" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="activityStatus">Show Activity Status</Label>
                          <p className="text-sm text-muted-foreground">Let others see when you're online</p>
                        </div>
                        <Switch id="activityStatus" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="dataDownload">Data Export</Label>
                          <p className="text-sm text-muted-foreground">Download a copy of your account data</p>
                        </div>
                        <Button variant="outline" size="sm">Request Export</Button>
                      </div>
                    </div>
                  </div>

                  {/* Delete Account */}
                  <div className="pt-4 border-t border-border/50">
                    <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-destructive flex items-center gap-2">
                            <Trash2 className="w-4 h-4" />
                            Delete Account
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Permanently delete your account and all data
                          </p>
                        </div>
                        <Button variant="destructive" onClick={handleDeleteAccount}>
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};