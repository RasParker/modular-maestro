import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navbar } from '@/components/shared/Navbar';
import { UserCard } from '@/components/admin/UserCard';
import { ArrowLeft, Search, Users } from 'lucide-react';
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <Button variant="outline" asChild className="mb-4">
            <Link to="/admin/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            Manage Users
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            View and manage platform users
          </p>
        </div>

        {/* Filters */}
        <Card className="bg-gradient-card border-border/50 mb-4 sm:mb-6">
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
              <Button variant="outline" className="w-full sm:w-auto">
                Export Users
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="text-base sm:text-xl">Platform Users ({filteredUsers.length})</CardTitle>
            <CardDescription className="text-sm">Manage user accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onSuspendUser={handleSuspendUser}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
