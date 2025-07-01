import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navbar } from '@/components/shared/Navbar';
import { useToast } from '@/hooks/use-toast';

export const AdminSettings: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [platformSettings, setPlatformSettings] = useState({
    siteName: 'Xclusive',
    siteDescription: 'Premium content monetization platform',
    commissionRate: 10,
    minimumAge: 18,
    maintenanceMode: false,
    newUserRegistration: true,
  });

  const [moderationSettings, setModerationSettings] = useState({
    autoModeration: true,
    requireApproval: false,
    bannedWords: 'spam, scam, fake',
    maxFileSize: 100,
    allowedFileTypes: 'jpg, png, gif, mp4, pdf',
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpServer: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUsername: 'noreply@xclusive.com',
    fromEmail: 'Xclusive <noreply@xclusive.com>',
  });

  const handlePlatformUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings updated",
        description: "Platform settings have been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update settings. Please try again.",
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
            <h1 className="text-3xl font-bold text-foreground">Admin Settings</h1>
            <p className="text-muted-foreground">Manage platform-wide settings and configurations</p>
          </div>

          {/* Platform Settings */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>
                Configure basic platform information and policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handlePlatformUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={platformSettings.siteName}
                      onChange={(e) => setPlatformSettings(prev => ({ ...prev, siteName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                    <Input
                      id="commissionRate"
                      type="number"
                      min="0"
                      max="50"
                      value={platformSettings.commissionRate}
                      onChange={(e) => setPlatformSettings(prev => ({ ...prev, commissionRate: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    value={platformSettings.siteDescription}
                    onChange={(e) => setPlatformSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Temporarily disable the platform for maintenance
                      </p>
                    </div>
                    <Switch
                      checked={platformSettings.maintenanceMode}
                      onCheckedChange={(checked) => 
                        setPlatformSettings(prev => ({ ...prev, maintenanceMode: checked }))
                      }
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>New User Registration</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow new users to register accounts
                      </p>
                    </div>
                    <Switch
                      checked={platformSettings.newUserRegistration}
                      onCheckedChange={(checked) => 
                        setPlatformSettings(prev => ({ ...prev, newUserRegistration: checked }))
                      }
                    />
                  </div>
                </div>
                
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Platform Settings"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Moderation Settings */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Content Moderation</CardTitle>
              <CardDescription>
                Configure content moderation and safety settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Moderation</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically flag potentially inappropriate content
                    </p>
                  </div>
                  <Switch
                    checked={moderationSettings.autoModeration}
                    onCheckedChange={(checked) => 
                      setModerationSettings(prev => ({ ...prev, autoModeration: checked }))
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Content Approval</Label>
                    <p className="text-sm text-muted-foreground">
                      All content must be approved before going live
                    </p>
                  </div>
                  <Switch
                    checked={moderationSettings.requireApproval}
                    onCheckedChange={(checked) => 
                      setModerationSettings(prev => ({ ...prev, requireApproval: checked }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bannedWords">Banned Words (comma-separated)</Label>
                  <Textarea
                    id="bannedWords"
                    value={moderationSettings.bannedWords}
                    onChange={(e) => setModerationSettings(prev => ({ ...prev, bannedWords: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                    <Input
                      id="maxFileSize"
                      type="number"
                      min="1"
                      max="1000"
                      value={moderationSettings.maxFileSize}
                      onChange={(e) => setModerationSettings(prev => ({ ...prev, maxFileSize: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
                    <Input
                      id="allowedFileTypes"
                      value={moderationSettings.allowedFileTypes}
                      onChange={(e) => setModerationSettings(prev => ({ ...prev, allowedFileTypes: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
              
              <Button>Save Moderation Settings</Button>
            </CardContent>
          </Card>

          {/* Email Settings */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>
                Configure SMTP settings for platform emails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpServer">SMTP Server</Label>
                  <Input
                    id="smtpServer"
                    value={emailSettings.smtpServer}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpServer: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPort: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpUsername">SMTP Username</Label>
                  <Input
                    id="smtpUsername"
                    value={emailSettings.smtpUsername}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpUsername: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    id="fromEmail"
                    value={emailSettings.fromEmail}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, fromEmail: e.target.value }))}
                  />
                </div>
              </div>
              
              <Button>Save Email Settings</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};