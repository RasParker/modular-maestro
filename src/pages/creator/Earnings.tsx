
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navbar } from '@/components/shared/Navbar';
import { ArrowLeft, TrendingUp, DollarSign, Users, Calendar, Download, Eye } from 'lucide-react';

const EARNINGS_DATA = {
  totalEarnings: 15420.50,
  thisMonth: 3280.75,
  lastMonth: 2950.25,
  growth: 11.2,
  subscribers: 156,
  pendingPayout: 1240.30,
  nextPayout: '2025-07-15'
};

const MONTHLY_DATA = [
  { month: 'Jan 2025', earnings: 2150.30, subscribers: 128 },
  { month: 'Feb 2025', earnings: 2680.45, subscribers: 142 },
  { month: 'Mar 2025', earnings: 2950.25, subscribers: 150 },
  { month: 'Apr 2025', earnings: 3280.75, subscribers: 156 },
];

const TRANSACTION_HISTORY = [
  { id: '1', date: '2025-06-28', amount: 45.50, type: 'Subscription', subscriber: 'Kwame A.', tier: 'Basic Support' },
  { id: '2', date: '2025-06-27', amount: 120.00, type: 'Tip', subscriber: 'Ama K.', tier: 'Premium Content' },
  { id: '3', date: '2025-06-26', amount: 25.00, type: 'Subscription', subscriber: 'Kofi M.', tier: 'Free' },
  { id: '4', date: '2025-06-25', amount: 85.75, type: 'PPV Content', subscriber: 'Akua S.', tier: 'Premium Content' },
];

export const Earnings: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('all-time');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-4">
            <Link to="/creator/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Earnings Dashboard</h1>
              <p className="text-muted-foreground">
                Track your revenue and financial performance
              </p>
            </div>
            <div className="flex gap-3">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-time">All Time</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">GH₵ {EARNINGS_DATA.totalEarnings.toLocaleString()}</div>
              <div className="flex items-center text-xs text-success">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{EARNINGS_DATA.growth}% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">GH₵ {EARNINGS_DATA.thisMonth.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +GH₵ {(EARNINGS_DATA.thisMonth - EARNINGS_DATA.lastMonth).toFixed(2)} from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{EARNINGS_DATA.subscribers}</div>
              <p className="text-xs text-muted-foreground">
                +6 new this month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payout</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">GH₵ {EARNINGS_DATA.pendingPayout.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Next payout: {EARNINGS_DATA.nextPayout}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Monthly Performance */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Monthly Performance</CardTitle>
                <CardDescription>Your earnings and subscriber growth over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {MONTHLY_DATA.map((data, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/20">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{data.month}</h4>
                        <p className="text-sm text-muted-foreground">{data.subscribers} subscribers</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-foreground">GH₵ {data.earnings.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Revenue Breakdown */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Where your earnings come from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/10">
                    <span className="text-sm text-foreground">Subscriptions</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">65%</span>
                      <Badge variant="secondary">GH₵ 2,132.50</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/10">
                    <span className="text-sm text-foreground">Tips & Donations</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">20%</span>
                      <Badge variant="secondary">GH₵ 656.15</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/10">
                    <span className="text-sm text-foreground">Pay-per-view Content</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">15%</span>
                      <Badge variant="secondary">GH₵ 492.10</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest earnings from subscribers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {TRANSACTION_HISTORY.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div>
                            <h4 className="font-medium text-foreground">{transaction.subscriber}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">{transaction.type}</Badge>
                              <Badge variant="secondary" className="text-xs">{transaction.tier}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-foreground">GH₵ {transaction.amount.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payouts" className="space-y-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Payout Information</CardTitle>
                <CardDescription>Manage your payout preferences and history</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-lg bg-muted/20">
                  <h4 className="font-medium text-foreground mb-2">Next Payout</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Amount: GH₵ {EARNINGS_DATA.pendingPayout.toFixed(2)}</span>
                    <span className="text-muted-foreground">Date: {EARNINGS_DATA.nextPayout}</span>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-medium text-foreground mb-2">Payout Method</h4>
                  <p className="text-sm text-muted-foreground">Mobile Money (MTN) - *****1234</p>
                  <Button variant="outline" size="sm" className="mt-2" asChild>
                    <Link to="/creator/settings">Update Payout Method</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
