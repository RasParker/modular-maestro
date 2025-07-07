import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Navbar } from '@/components/shared/Navbar';
import { Crown, Users, DollarSign, Shield, Heart, Zap } from 'lucide-react';

const FEATURES = [
  {
    icon: Crown,
    title: 'Creator-First Platform',
    description: 'Built specifically for content creators to monetize their passion and build sustainable income streams.'
  },
  {
    icon: Users,
    title: 'Engaged Community',
    description: 'Connect with your most dedicated fans through subscriptions, exclusive content, and direct messaging.'
  },
  {
    icon: DollarSign,
    title: 'Multiple Revenue Streams',
    description: 'Offer multiple subscription tiers, exclusive content, and premium experiences to maximize earnings.'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Advanced security measures protect both creators and fans with encrypted payments and data protection.'
  },
  {
    icon: Heart,
    title: 'Fan Experience',
    description: 'Fans get exclusive access to their favorite creators with personalized content and community features.'
  },
  {
    icon: Zap,
    title: 'Easy to Use',
    description: 'Intuitive interface makes it simple to create, manage, and discover content for everyone.'
  }
];

const STATS = [
  { value: '10,000+', label: 'Active Creators' },
  { value: '500K+', label: 'Total Subscribers' },
  { value: '$2M+', label: 'Creator Earnings' },
  { value: '99.9%', label: 'Uptime' }
];

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            About{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Xclusive
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're building the future of content monetization, where creators can thrive 
            and fans can support their favorite artists, educators, and entertainers 
            through meaningful subscriptions and exclusive experiences.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="mb-16">
          <Card className="bg-gradient-card border-border/50 p-8">
            <CardContent className="text-center space-y-6 p-0">
              <h2 className="text-3xl font-bold text-foreground">Our Mission</h2>
              <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
                To empower creators worldwide by providing them with the tools, platform, 
                and community they need to turn their passion into a sustainable livelihood. 
                We believe that creativity should be rewarded, and we're committed to building 
                the most creator-friendly platform in the industry.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Platform Stats */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">
            Platform by the Numbers
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {STATS.map((stat, index) => (
              <Card key={index} className="bg-gradient-card border-border/50 text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Why Choose Xclusive?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="bg-gradient-card border-border/50 p-6">
                  <CardContent className="space-y-4 p-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-card border-border/50 p-6">
              <CardContent className="text-center space-y-4 p-0">
                <h3 className="text-xl font-semibold text-foreground">Creator First</h3>
                <p className="text-muted-foreground">
                  Every decision we make puts creators at the center. We listen to feedback 
                  and continuously improve based on what creators need to succeed.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card border-border/50 p-6">
              <CardContent className="text-center space-y-4 p-0">
                <h3 className="text-xl font-semibold text-foreground">Transparency</h3>
                <p className="text-muted-foreground">
                  Clear pricing, honest communication, and transparent revenue sharing. 
                  No hidden fees or surprise changes to terms.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card border-border/50 p-6">
              <CardContent className="text-center space-y-4 p-0">
                <h3 className="text-xl font-semibold text-foreground">Innovation</h3>
                <p className="text-muted-foreground">
                  We're constantly evolving and adding new features to help creators 
                  connect with their audience in meaningful ways.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border-border/50 p-8">
            <CardContent className="space-y-6 p-0">
              <h2 className="text-3xl font-bold text-foreground">
                Ready to Join the Creator Economy?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Whether you're a creator looking to monetize your content or a fan 
                wanting to support your favorites, we'd love to have you join our community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="premium" asChild>
                  <Link to="/signup">Get Started Today</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/explore">Explore Creators</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};