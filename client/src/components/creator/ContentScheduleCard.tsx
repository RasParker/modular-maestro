
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';

interface ScheduledContent {
  id: string;
  title: string;
  tier: string;
  type: string;
  date: string;
  time: string;
}

interface ContentScheduleCardProps {
  scheduledContent: ScheduledContent[];
}

export const ContentScheduleCard: React.FC<ContentScheduleCardProps> = ({ scheduledContent }) => {
  return (
    <Card className="bg-gradient-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
          Content Schedule
        </CardTitle>
        <CardDescription className="text-sm">Your upcoming posts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {scheduledContent.map((content) => (
            <div key={content.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-lg border border-border/50 gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm sm:text-base truncate">{content.title}</p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">{content.tier}</Badge>
                  <Badge variant="outline" className="text-xs">{content.type}</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end sm:text-right gap-2">
                <div className="flex items-center gap-1 text-xs sm:text-sm">
                  <Clock className="w-3 h-3" />
                  <span className="font-medium">{content.date}</span>
                  <span className="text-muted-foreground">{content.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4" asChild>
          <Link to="/creator/schedule">Manage Schedule</Link>
        </Button>
      </CardContent>
    </Card>
  );
};
