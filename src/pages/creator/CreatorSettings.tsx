import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Navbar } from '@/components/shared/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Info, CreditCard, Smartphone } from 'lucide-react';

const GHANAIAN_BANKS = [
  'Access Bank Ghana',
  'Agricultural Development Bank',
  'Absa Bank Ghana',
  'Cal Bank',
  'Consolidated Bank Ghana',
  'Ecobank Ghana',
  'First Atlantic Bank',
  'First National Bank Ghana',
  'GCB Bank',
  'Ghana Commercial Bank',
  'Guaranty Trust Bank Ghana',
  'National Investment Bank',
  'Republic Bank Ghana',
  'Societe Generale Ghana',
  'Standard Chartered Bank Ghana',
  'Stanbic Bank Ghana',
  'UMB Bank',
  'Universal Merchant Bank',
  'Zenith Bank Ghana'
];

const MOBILE_MONEY_PROVIDERS = [
  'MTN Mobile Money',
  'Vodafone Cash',
  'AirtelTigo Money'
];

export const CreatorSettings: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  
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
    preferredMethod: 'bank', // 'bank' or 'mobile'
    bankName: '',
    accountNumber: '',
    accountHolderName: '',
    mobileProvider: '',
    mobileNumber: '',
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

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast({
        title: "Avatar uploaded",
        description: "Your avatar has been successfully updated.",
      });
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast({
        title: "Cover image uploaded",
        description: "Your cover image has been successfully updated.",
      });
    }
  };

  const handlePayoutUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Payout settings updated",
        description: "Your payout preferences have been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update payout settings. Please try again.",
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
                  <input
                    type="file"
                    ref={avatarInputRef}
                    onChange={handleAvatarUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <input
                    type="file"
                    ref={coverInputRef}
                    onChange={handleCoverUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button variant="outline" onClick={() => avatarInputRef.current?.click()}>
                    Change Avatar
                  </Button>
                  <Button variant="outline" onClick={() => coverInputRef.current?.click()}>
                    Upload Cover Image
                  </Button>
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

          {/* Enhanced Payout Settings */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Payout Settings</CardTitle>
              <CardDescription>
                Configure how you receive payments from your subscribers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Info Banner */}
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Payouts are processed on the 1st of every month for the previous month's earnings.
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      Minimum payout amount is GHS 50.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handlePayoutUpdate} className="space-y-6">
                {/* Preferred Payout Method */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Preferred Payout Method</Label>
                  <RadioGroup
                    value={payoutSettings.preferredMethod}
                    onValueChange={(value) => 
                      setPayoutSettings(prev => ({ ...prev, preferredMethod: value }))
                    }
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-2 border border-border rounded-lg p-4">
                      <RadioGroupItem value="bank" id="bank" />
                      <div className="flex items-center gap-2 flex-1">
                        <CreditCard className="w-5 h-5 text-primary" />
                        <Label htmlFor="bank" className="flex-1 cursor-pointer">
                          Bank Account
                        </Label>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 border border-border rounded-lg p-4">
                      <RadioGroupItem value="mobile" id="mobile" />
                      <div className="flex items-center gap-2 flex-1">
                        <Smartphone className="w-5 h-5 text-primary" />
                        <Label htmlFor="mobile" className="flex-1 cursor-pointer">
                          Mobile Money
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* Bank Account Information */}
                {payoutSettings.preferredMethod === 'bank' && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Bank Account Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input
                          id="accountNumber"
                          placeholder="Enter account number"
                          value={payoutSettings.accountNumber}
                          onChange={(e) => setPayoutSettings(prev => ({ ...prev, accountNumber: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Select
                          value={payoutSettings.bankName}
                          onValueChange={(value) => setPayoutSettings(prev => ({ ...prev, bankName: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Bank" />
                          </SelectTrigger>
                          <SelectContent>
                            {GHANAIAN_BANKS.map((bank) => (
                              <SelectItem key={bank} value={bank}>
                                {bank}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountHolderName">Account Holder Name</Label>
                      <Input
                        id="accountHolderName"
                        placeholder="Full name as appears on account"
                        value={payoutSettings.accountHolderName}
                        onChange={(e) => setPayoutSettings(prev => ({ ...prev, accountHolderName: e.target.value }))}
                      />
                    </div>
                  </div>
                )}

                {/* Mobile Money Information */}
                {payoutSettings.preferredMethod === 'mobile' && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Mobile Money Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="mobileProvider">Mobile Money Provider</Label>
                        <Select
                          value={payoutSettings.mobileProvider}
                          onValueChange={(value) => setPayoutSettings(prev => ({ ...prev, mobileProvider: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Provider" />
                          </SelectTrigger>
                          <SelectContent>
                            {MOBILE_MONEY_PROVIDERS.map((provider) => (
                              <SelectItem key={provider} value={provider}>
                                {provider}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mobileNumber">Mobile Number</Label>
                        <Input
                          id="mobileNumber"
                          placeholder="0XX XXX XXXX"
                          value={payoutSettings.mobileNumber}
                          onChange={(e) => setPayoutSettings(prev => ({ ...prev, mobileNumber: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Minimum Payout */}
                <div className="space-y-2">
                  <Label htmlFor="minimumPayout">Minimum Payout (GHS)</Label>
                  <Input
                    id="minimumPayout"
                    type="number"
                    min="50"
                    value={payoutSettings.minimumPayout}
                    onChange={(e) => setPayoutSettings(prev => ({ ...prev, minimumPayout: parseInt(e.target.value) }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum amount is GHS 50. Lower amounts will be held until threshold is reached.
                  </p>
                </div>
                
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Save Payout Settings"}
                </Button>
              </form>

              {/* Current Month Earnings */}
              <div className="pt-6 border-t border-border">
                <h4 className="font-medium mb-4">Current Month Earnings</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-success">GHS 0.00</p>
                    <p className="text-xs text-muted-foreground">Pending Earnings</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">GHS 0.00</p>
                    <p className="text-xs text-muted-foreground">Total Paid Out</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">GHS 0.00</p>
                    <p className="text-xs text-muted-foreground">Next Payout</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
