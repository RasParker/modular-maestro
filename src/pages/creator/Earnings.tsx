
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/shared/Navbar';
import { ArrowLeft, TrendingUp, DollarSign, Users, Info, ArrowUpRight } from 'lucide-react';

const EARNINGS_DATA = {
  totalMonthlyRevenue: 850.00,
  totalActiveSubscribers: 3,
  estimatedNetRevenue: 807.50,
  currency: 'GHS'
};

const TIER_BREAKDOWN = [
  { 
    name: 'Basic Support', 
    price: 100.00, 
    subscribers: 1, 
    monthlyRevenue: 100.00,
    percentage: 11.8
  },
  { 
    name: 'Premium Content', 
    price: 250.00, 
    subscribers: 1, 
    monthlyRevenue: 250.00,
    percentage: 29.4
  },
  { 
    name: 'VIP Access', 
    price: 500.00, 
    subscribers: 1, 
    monthlyRevenue: 500.00,
    percentage: 58.8
  }
];

const CURRENT_MONTH_PROJECTIONS = {
  grossRevenue: 850.00,
  platformFee: 0.00, // 0% during MVP
  paystackFees: 42.50, // ~5% estimated
  netRevenue: 807.50
};

export const Earnings: React.FC = () => {
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Earnings Dashboard</h1>
          <p className="text-muted-foreground">
            Track your revenue and financial performance
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Monthly Revenue</p>
                  <p className="text-3xl font-bold text-foreground">
                    {EARNINGS_DATA.currency} {EARNINGS_DATA.totalMonthlyRevenue.toFixed(2)}
                  </p>
                  <p className="text-xs text-success flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    +12% vs last month
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Active Subscribers</p>
                  <p className="text-3xl font-bold text-foreground">{EARNINGS_DATA.totalActiveSubscribers}</p>
                  <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                    <ArrowUpRight className="w-3 h-3" />
                    New this month
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border-cyan-200/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Est. Net Revenue*</p>
                  <p className="text-3xl font-bold text-foreground">
                    {EARNINGS_DATA.currency} {EARNINGS_DATA.estimatedNetRevenue.toFixed(2)}
                  </p>
                  <p className="text-xs text-cyan-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    After fees
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-cyan-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Breakdown by Tier */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Revenue Breakdown by Tier</CardTitle>
              <CardDescription>Monthly revenue from each subscription tier</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {TIER_BREAKDOWN.map((tier) => (
                  <div key={tier.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{tier.name}</Badge>
                        <span className="text-sm text-muted-foreground">GHS {tier.price.toFixed(2)}/month</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {tier.subscribers} subscriber{tier.subscribers !== 1 ? 's' : ''}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          GHS {tier.monthlyRevenue.toFixed(2)}/month
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={tier.percentage} className="flex-1 h-2" />
                      <span className="text-xs text-muted-foreground w-12 text-right">
                        {tier.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total</span>
                  <div className="text-right">
                    <p className="font-medium">{EARNINGS_DATA.totalActiveSubscribers} subscribers</p>
                    <p className="text-sm text-muted-foreground">
                      GHS {EARNINGS_DATA.totalMonthlyRevenue.toFixed(2)}/month
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Month Projections */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>This Month's Projections</CardTitle>
              <CardDescription>Estimated earnings breakdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Gross Revenue:</span>
                  <span className="text-sm font-medium">GHS {CURRENT_MONTH_PROJECTIONS.grossRevenue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Platform Fee:</span>
                  <span className="text-sm font-medium text-success">
                    GHS {CURRENT_MONTH_PROJECTIONS.platformFee.toFixed(2)} (0% during MVP)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Paystack Fees:</span>
                  <span className="text-sm font-medium">-GHS {CURRENT_MONTH_PROJECTIONS.paystackFees.toFixed(2)} (est.)</span>
                </div>
                <div className="border-t border-border pt-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Net Revenue:</span>
                    <span className="font-medium text-success">
                      GHS {CURRENT_MONTH_PROJECTIONS.netRevenue.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Information */}
        <Card className="bg-gradient-card border-border/50 mb-8">
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Payment Processing:
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Payments are processed monthly via Paystack. Your earnings will be transferred to 
                    your linked bank account or mobile money wallet after deducting Paystack's transaction fees.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium mb-4">Payment Schedule:</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Payments are processed automatically by Paystack on the subscriber's billing date.</p>
                  <p>Your earnings are transferred to your account within 2-3 business days.</p>
                  <p>Minimum payout threshold: GHS 50</p>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Current Payout Method:</h4>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/creator/settings">Update Settings</Link>
                  </Button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Method:</span>
                    <span>Bank Account</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bank:</span>
                    <span>Access Bank Ghana</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account:</span>
                    <span>****1234</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
