import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Navbar } from '@/components/shared/Navbar';
import { ArrowLeft, Search, Users, Crown, Shield, Ban, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MOCK_USERS = [
  {
    id: '1',
    username: 'artisticmia',
    email: 'mia@example.com',
    role: 'creator',
    status: 'active',
    joined: '2024-01-15',
    subscribers: 2840,
    revenue: 12500
  },
  {
    id: '2',
    username: 'fitnessking',
    email: 'fitness@example.com',
    role: 'creator',
    status: 'active',
    joined: '2024-01-10',
    subscribers: 5120,
    revenue: 18900
  },
  {
    id: '3',
    username: 'fan123',
    email: 'fan@example.com',
    role: 'fan',
    status: 'active',
    joined: '2024-02-01',
    subscribers: 0,
    revenue: 0
  },
  {
    id: '4',
    username: 'suspended_user',
    email: 'suspended@example.com',
    role: 'fan',
    status: 'suspended',
    joined: '2024-01-20',
    subscribers: 0,
    revenue: 0
  }
];

export const ManageUsers: React.FC = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSuspendUser = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'suspended' ? 'active' : 'suspended' }
        : user
    ));
    toast({
      title: "User status updated",
      description: "User status has been successfully updated.",
    });
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
            <Users className="w-8 h-8 text-primary" />
            Manage Users
          </h1>
          <p className="text-muted-foreground">
            View and manage platform users
          </p>
        </div>

        {/* Filters */}
        <Card className="bg-gradient-card border-border/50 mb-6">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="creator">Creators</SelectItem>
                  <SelectItem value="fan">Fans</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                Export Users
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Platform Users ({filteredUsers.length})</CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} />
                      <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{user.username}</p>
                        {user.role === 'creator' && <Crown className="w-4 h-4 text-accent" />}
                        {user.role === 'admin' && <Shield className="w-4 h-4 text-primary" />}
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="capitalize">
                          {user.role}
                        </Badge>
                        <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                          {user.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        Joined: {new Date(user.joined).toLocaleDateString()}
                      </p>
                      {user.role === 'creator' && (
                        <div className="text-xs text-muted-foreground">
                          {user.subscribers} subscribers • ${user.revenue} revenue
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuspendUser(user.id)}
                      >
                        {user.status === 'suspended' ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Activate
                          </>
                        ) : (
                          <>
                            <Ban className="w-4 h-4 mr-1" />
                            Suspend
                          </>
                        )}
                      </Button>
                    </div>
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