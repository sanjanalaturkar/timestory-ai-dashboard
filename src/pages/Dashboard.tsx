import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { useActivities } from '@/hooks/useActivities';
import { Logo } from '@/components/Logo';
import { DatePicker } from '@/components/DatePicker';
import { ActivityForm } from '@/components/ActivityForm';
import { ActivityCard } from '@/components/ActivityCard';
import { TimeStats } from '@/components/TimeStats';
import { EmptyState } from '@/components/EmptyState';
import { AnalyseButton } from '@/components/AnalyseButton';
import { AnalyticsView } from '@/components/AnalyticsView';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Settings, ChevronDown } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  const {
    activities,
    loading,
    totalMinutes,
    remainingMinutes,
    isComplete,
    addActivity,
    updateActivity,
    deleteActivity,
  } = useActivities(selectedDate);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  const getInitials = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.[0].toUpperCase() || 'U';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="sm" />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 h-auto py-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:block text-sm font-medium">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                </span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass">
              <DropdownMenuItem disabled className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="truncate">{user?.email}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Date Picker */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <DatePicker date={selectedDate} onDateChange={(date) => {
            setSelectedDate(date);
            setShowAnalytics(false);
          }} />
          
          {activities.length > 0 && (
            <AnalyseButton
              isUnlocked={isComplete}
              onClick={() => setShowAnalytics(!showAnalytics)}
              remainingMinutes={remainingMinutes}
            />
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
          </div>
        ) : showAnalytics && isComplete ? (
          <AnalyticsView activities={activities} />
        ) : (
          <>
            {/* Stats */}
            {activities.length > 0 && (
              <div className="mb-8">
                <TimeStats
                  totalMinutes={totalMinutes}
                  remainingMinutes={remainingMinutes}
                  activities={activities}
                />
              </div>
            )}

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Activity Form */}
              {isToday && remainingMinutes > 0 && (
                <div className="lg:col-span-1">
                  <ActivityForm
                    remainingMinutes={remainingMinutes}
                    onAdd={addActivity}
                  />
                </div>
              )}

              {/* Activities List */}
              <div className={`${isToday && remainingMinutes > 0 ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
                {activities.length === 0 ? (
                  <EmptyState 
                    type={isToday ? 'no-activities' : 'no-data-for-date'}
                    onAction={!isToday ? () => setSelectedDate(new Date()) : undefined}
                  />
                ) : (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      Activities
                      <span className="text-sm font-normal text-muted-foreground">
                        ({activities.length})
                      </span>
                    </h3>
                    {activities.map((activity, index) => (
                      <div 
                        key={activity.id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <ActivityCard
                          activity={activity}
                          onUpdate={updateActivity}
                          onDelete={deleteActivity}
                          maxAdditionalMinutes={remainingMinutes}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
