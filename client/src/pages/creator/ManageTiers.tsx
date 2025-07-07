import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/shared/Navbar';
import { ArrowLeft, Plus, Edit, Trash2, DollarSign, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
}

const DEFAULT_TIERS: SubscriptionTier[] = [
  {
    id: '1',
    name: 'Supporter',
    price: 5,
    description: 'Access to basic content and community posts',
    features: ['Weekly art posts', 'Community access', 'Behind-the-scenes content']
  },
  {
    id: '2',
    name: 'Fan',
    price: 15,
    description: 'Everything in Supporter plus exclusive tutorials',
    features: ['Everything in Supporter', 'Monthly tutorials', 'Process videos', 'High-res downloads']
  },
  {
    id: '3',
    name: 'Superfan',
    price: 25,
    description: 'Ultimate access with personal interaction',
    features: ['Everything in Fan', 'Direct messaging', '1-on-1 feedback', 'Custom artwork requests']
  }
];

export const ManageTiers: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tiers, setTiers] = useState<SubscriptionTier[]>(DEFAULT_TIERS);
  const [isCreating, setIsCreating] = useState(false);
  const [editingTier, setEditingTier] = useState<SubscriptionTier | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    features: ['']
  });

  const handleCreateTier = () => {
    setIsCreating(true);
    setFormData({ name: '', price: '', description: '', features: [''] });
  };

  const handleEditTier = (tier: SubscriptionTier) => {
    setEditingTier(tier);
    setFormData({
      name: tier.name,
      price: tier.price.toString(),
      description: tier.description,
      features: tier.features
    });
  };

  const handleSaveTier = () => {
    if (!formData.name || !formData.price || !formData.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const tierData: SubscriptionTier = {
      id: editingTier?.id || Date.now().toString(),
      name: formData.name,
      price: parseFloat(formData.price),
      description: formData.description,
      features: formData.features.filter(f => f.trim() !== '')
    };

    if (editingTier) {
      setTiers(prev => prev.map(t => t.id === editingTier.id ? tierData : t));
      toast({
        title: "Tier updated",
        description: "Subscription tier has been updated successfully.",
      });
    } else {
      setTiers(prev => [...prev, tierData]);
      toast({
        title: "Tier created",
        description: "New subscription tier has been created successfully.",
      });
    }

    setIsCreating(false);
    setEditingTier(null);
    setFormData({ name: '', price: '', description: '', features: [''] });
  };

  const handleDeleteTier = (id: string) => {
    setTiers(prev => prev.filter(t => t.id !== id));
    toast({
      title: "Tier deleted",
      description: "Subscription tier has been deleted successfully.",
    });
  };

  const handleFeatureChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === index ? value : f)
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-4">
            <Link to="/creator/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
                <DollarSign className="w-8 h-8 text-primary" />
                Manage Subscription Tiers
              </h1>
              <p className="text-muted-foreground">
                Create and manage your subscription tiers and pricing
              </p>
            </div>
            <Button onClick={handleCreateTier}>
              <Plus className="w-4 h-4 mr-2" />
              Create New Tier
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Create/Edit Form */}
          {(isCreating || editingTier) && (
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>{editingTier ? 'Edit Tier' : 'Create New Tier'}</CardTitle>
                <CardDescription>
                  Set up your subscription tier details and benefits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tier Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Premium Supporter"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Monthly Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="9.99"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what this tier includes..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Benefits & Features</Label>
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Enter a benefit..."
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                      />
                      {formData.features.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeFeature(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addFeature}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Feature
                  </Button>
                </div>

                <div className="flex gap-4">
                  <Button onClick={handleSaveTier}>
                    {editingTier ? 'Update Tier' : 'Create Tier'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsCreating(false);
                      setEditingTier(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Existing Tiers */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <Card key={tier.id} className="bg-gradient-card border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{tier.name}</CardTitle>
                    <Badge variant="outline">${tier.price}/mo</Badge>
                  </div>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="text-sm flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex gap-2 pt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditTier(tier)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteTier(tier.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats Card */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Tier Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{tiers.length}</div>
                  <div className="text-sm text-muted-foreground">Active Tiers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    ${Math.min(...tiers.map(t => t.price))}
                  </div>
                  <div className="text-sm text-muted-foreground">Lowest Price</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    ${Math.max(...tiers.map(t => t.price))}
                  </div>
                  <div className="text-sm text-muted-foreground">Highest Price</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
