import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navbar } from '@/components/shared/Navbar';
import { ArrowLeft, Flag, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MOCK_REPORTS = [
  {
    id: '1',
    type: 'content',
    reason: 'Inappropriate content',
    description: 'Contains explicit material not suitable for platform',
    reported_by: 'user123',
    target: 'artisticmia - Digital Art Post',
    status: 'pending',
    priority: 'high',
    created_at: '2024-02-19T10:30:00',
    updated_at: '2024-02-19T10:30:00'
  },
  {
    id: '2',
    type: 'user',
    reason: 'Spam behavior',
    description: 'User is sending unsolicited messages to multiple creators',
    reported_by: 'fan456',
    target: 'spamuser',
    status: 'under_review',
    priority: 'medium',
    created_at: '2024-02-19T08:15:00',
    updated_at: '2024-02-19T12:00:00'
  },
  {
    id: '3',
    type: 'payment',
    reason: 'Chargeback dispute',
    description: 'User filed chargeback after receiving content',
    reported_by: 'system',
    target: 'transaction_789',
    status: 'resolved',
    priority: 'low',
    created_at: '2024-02-18T16:45:00',
    updated_at: '2024-02-19T09:30:00'
  },
  {
    id: '4',
    type: 'content',
    reason: 'Copyright violation',
    description: 'Content appears to be copied from another creator',
    reported_by: 'originalcreator',
    target: 'copycat - Video Tutorial',
    status: 'pending',
    priority: 'high',
    created_at: '2024-02-19T14:20:00',
    updated_at: '2024-02-19T14:20:00'
  }
];

export const Reports: React.FC = () => {
  const { toast } = useToast();
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredReports = reports.filter(report => {
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    const matchesPriority = priorityFilter === 'all' || report.priority === priorityFilter;
    return matchesStatus && matchesType && matchesPriority;
  });

  const handleUpdateStatus = (reportId: string, newStatus: string) => {
    setReports(reports.map(report => 
      report.id === reportId 
        ? { ...report, status: newStatus, updated_at: new Date().toISOString() }
        : report
    ));
    toast({
      title: "Report status updated",
      description: `Report has been marked as ${newStatus}.`,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'under_review':
        return <AlertTriangle className="w-4 h-4" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Flag className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

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
            <Flag className="w-8 h-8 text-primary" />
            Reports Management
          </h1>
          <p className="text-muted-foreground">
            View and manage user reports and violations
          </p>
        </div>

        {/* Filters */}
        <Card className="bg-gradient-card border-border/50 mb-6">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="content">Content</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                Export Reports
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Platform Reports ({filteredReports.length})</CardTitle>
            <CardDescription>Manage reports and violations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <div key={report.id} className="p-6 rounded-lg border border-border/50 bg-muted/10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{report.reason}</h3>
                        <Badge variant="outline" className="capitalize">
                          {report.type}
                        </Badge>
                        <Badge variant={getPriorityColor(report.priority) as any} className="capitalize">
                          {report.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{report.description}</p>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Reported by:</span>
                          <span className="ml-2 font-medium">{report.reported_by}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Target:</span>
                          <span className="ml-2 font-medium">{report.target}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Created:</span>
                          <span className="ml-2">{new Date(report.created_at).toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Updated:</span>
                          <span className="ml-2">{new Date(report.updated_at).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Badge variant={
                        report.status === 'pending' ? 'destructive' :
                        report.status === 'under_review' ? 'secondary' : 'default'
                      } className="flex items-center gap-1">
                        {getStatusIcon(report.status)}
                        {report.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {report.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(report.id, 'under_review')}
                      >
                        Start Review
                      </Button>
                    )}
                    {report.status === 'under_review' && (
                      <Button
                        size="sm"
                        onClick={() => handleUpdateStatus(report.id, 'resolved')}
                      >
                        Resolve
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
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