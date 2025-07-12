import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Navbar } from '@/components/shared/Navbar';
import { ArrowLeft, BarChart3, TrendingUp, Users, DollarSign, Crown, Activity } from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-4">
            <Link to="/admin/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-primary" />
            Platform Analytics
          </h1>
          <p className="text-muted-foreground">
            Comprehensive platform performance metrics
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          {/* Key Metrics */}
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-foreground">GHS 1.2M</p>
                  <p className="text-xs text-success">+25% vs last month</p>
                </div>
                <DollarSign className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold text-foreground">125K</p>
                  <p className="text-xs text-success">+8.5% growth</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Creator Retention</p>
                  <p className="text-2xl font-bold text-foreground">94%</p>
                  <p className="text-xs text-success">+2% improvement</p>
                </div>
                <Crown className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Platform Uptime</p>
                  <p className="text-2xl font-bold text-foreground">99.9%</p>
                  <p className="text-xs text-success">Excellent</p>
                </div>
                <Activity className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Revenue Analytics */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Revenue Analytics</CardTitle>
              <CardDescription>Monthly revenue breakdown and trends</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Creator Subscriptions</span>
                  <span className="text-sm text-muted-foreground">GHS 980K (82%)</span>
                </div>
                <Progress value={82} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Platform Fees</span>
                  <span className="text-sm text-muted-foreground">GHS 147K (12%)</span>
                </div>
                <Progress value={12} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Premium Features</span>
                  <span className="text-sm text-muted-foreground">GHS 73K (6%)</span>
                </div>
                <Progress value={6} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* User Growth */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>Platform growth metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">New Users (This Month)</span>
                  <span className="text-sm font-medium">+8,245</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Creator Sign-ups</span>
                  <span className="text-sm font-medium">+425</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Fan Registrations</span>
                  <span className="text-sm font-medium">+7,820</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Churn Rate</span>
                  <span className="text-sm font-medium text-success">2.1%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Categories */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Top Content Categories</CardTitle>
              <CardDescription>Most popular content types</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Art & Design</span>
                  <span className="text-sm text-muted-foreground">35%</span>
                </div>
                <Progress value={35} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Fitness</span>
                  <span className="text-sm text-muted-foreground">28%</span>
                </div>
                <Progress value={28} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Music</span>
                  <span className="text-sm text-muted-foreground">22%</span>
                </div>
                <Progress value={22} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Technology</span>
                  <span className="text-sm text-muted-foreground">15%</span>
                </div>
                <Progress value={15} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Platform Performance */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Platform Performance</CardTitle>
              <CardDescription>System health and performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Server Response Time</span>
                  <span>245ms</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Content Delivery Speed</span>
                  <span>Fast</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Error Rate</span>
                  <span>0.02%</span>
                </div>
                <Progress value={98} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Database Performance</span>
                  <span>Optimal</span>
                </div>
                <Progress value={96} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};