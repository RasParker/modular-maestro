
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
  totalMonthlyRevenue: 85.00,
  totalActiveSubscribers: 3,
  estimatedNetRevenue: 80.75,
  growth: 11.2,
  platformFee: 0.00,
  paystackFees: 4.25,
  nextPayout: '2025-07-15'
};

const TIER_BREAKDOWN = [
  { name: 'Basic Support', price: 10.00, subscribers: 1, monthlyRevenue: 10.00, percentage: 11.8 },
  { name: 'Premium Content', price: 25.00, subscribers: 1, monthlyRevenue: 25.00, percentage: 29.4 },
  { name: 'VIP Access', price: 50.00, subscribers: 1, monthlyRevenue: 50.00, percentage: 58.8 },
];

const TRANSACTION_HISTORY = [
  { id: '1', date: '2025-06-28', amount: 10.00, type: 'Subscription', subscriber: 'Kwame A.', tier: 'Basic Support' },
  { id: '2', date: '2025-06-27', amount: 25.00, type: 'Subscription', subscriber: 'Ama K.', tier: 'Premium Content' },
  { id: '3', date: '2025-06-26', amount: 50.00, type: 'Subscription', subscriber: 'Kofi M.', tier: 'VIP Access' },
  { id: '4', date: '2025-06-25', amount: 15.75, type: 'Tip', subscriber: 'Akua S.', tier: 'Premium Content' },
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

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm mb-1">Total Monthly Revenue</p>
                  <p className="text-3xl font-bold">GHS {EARNINGS_DATA.totalMonthlyRevenue.toFixed(2)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Total Active Subscribers</p>
                  <p className="text-3xl font-bold">{EARNINGS_DATA.totalActiveSubscribers}</p>
                </div>
                <Users className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-400 to-cyan-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-100 text-sm mb-1">Est. Net Revenue*</p>
                  <p className="text-3xl font-bold">GHS {EARNINGS_DATA.estimatedNetRevenue.toFixed(2)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-cyan-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Breakdown Table */}
        <Card className="bg-gradient-card border-border/50 mb-8">
          <CardHeader>
            <CardTitle>Revenue Breakdown by Tier</CardTitle>
            <CardDescription>Detailed breakdown of your subscription tiers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Tier Name</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Price</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Subscribers</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Monthly Revenue</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {TIER_BREAKDOWN.map((tier, index) => (
                    <tr key={index} className="border-b border-border/20">
                      <td className="py-3 px-4 font-medium text-foreground">{tier.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">GHS {tier.price.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="rounded-full w-6 h-6 p-0 flex items-center justify-center text-xs">
                          {tier.subscribers}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-medium text-foreground">GHS {tier.monthlyRevenue.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary" className="text-xs">{tier.percentage.toFixed(1)}%</Badge>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-muted/20">
                    <td className="py-3 px-4 font-semibold text-foreground">Total</td>
                    <td className="py-3 px-4">-</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="rounded-full w-6 h-6 p-0 flex items-center justify-center text-xs bg-green-100 text-green-700">
                        {EARNINGS_DATA.totalActiveSubscribers}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-semibold text-foreground">GHS {EARNINGS_DATA.totalMonthlyRevenue.toFixed(2)}</td>
                    <td className="py-3 px-4 font-semibold text-foreground">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card className="bg-gradient-card border-border/50 mb-8">
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="w-5 h-5 rounded-full bg-blue-400 flex items-center justify-center">
                    <span className="text-white text-xs">!</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-800">
                    <strong>Payment Processing:</strong> Payments are processed monthly via Paystack. Your earnings will be transferred to your linked bank account after deducting Paystack's transaction fees.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium text-foreground mb-4">This Month's Projections:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gross Revenue:</span>
                    <span className="font-medium">GHS {EARNINGS_DATA.totalMonthlyRevenue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform Fee:</span>
                    <span className="font-medium">GHS {EARNINGS_DATA.platformFee.toFixed(2)} (0% during MVP)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Paystack Fees:</span>
                    <span className="font-medium">~GHS {EARNINGS_DATA.paystackFees.toFixed(2)} (est.)</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Net Revenue:</span>
                      <span>GHS {EARNINGS_DATA.estimatedNetRevenue.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-4">Payment Schedule:</h4>
                <p className="text-sm text-muted-foreground">
                  Payments are processed automatically by Paystack on the subscriber's billing date. Your earnings are transferred to your bank account within 2-3 business days.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
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
                    <div className="text-lg font-semibold text-foreground">GHS {transaction.amount.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">{transaction.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
