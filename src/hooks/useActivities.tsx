import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { format } from 'date-fns';

export interface Activity {
  id: string;
  user_id: string;
  date: string;
  title: string;
  category: string;
  duration_minutes: number;
  created_at: string;
  updated_at: string;
}

export function useActivities(selectedDate: Date) {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const dateString = format(selectedDate, 'yyyy-MM-dd');

  const fetchActivities = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', dateString)
      .order('created_at', { ascending: true });

    if (error) {
      toast.error('Failed to fetch activities');
      console.error('Error fetching activities:', error);
    } else {
      setActivities(data || []);
    }
    setLoading(false);
  }, [user, dateString]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const addActivity = async (title: string, category: string, durationMinutes: number) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('activities')
      .insert({
        user_id: user.id,
        date: dateString,
        title,
        category,
        duration_minutes: durationMinutes,
      })
      .select()
      .single();

    if (error) {
      toast.error('Failed to add activity');
      console.error('Error adding activity:', error);
      return { error };
    }

    setActivities(prev => [...prev, data]);
    toast.success('Activity added successfully');
    return { error: null };
  };

  const updateActivity = async (id: string, updates: Partial<Pick<Activity, 'title' | 'category' | 'duration_minutes'>>) => {
    const { error } = await supabase
      .from('activities')
      .update(updates)
      .eq('id', id);

    if (error) {
      toast.error('Failed to update activity');
      console.error('Error updating activity:', error);
      return { error };
    }

    setActivities(prev => 
      prev.map(a => a.id === id ? { ...a, ...updates } : a)
    );
    toast.success('Activity updated');
    return { error: null };
  };

  const deleteActivity = async (id: string) => {
    const { error } = await supabase
      .from('activities')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete activity');
      console.error('Error deleting activity:', error);
      return { error };
    }

    setActivities(prev => prev.filter(a => a.id !== id));
    toast.success('Activity deleted');
    return { error: null };
  };

  const totalMinutes = activities.reduce((sum, a) => sum + a.duration_minutes, 0);
  const remainingMinutes = 1440 - totalMinutes;
  const isComplete = totalMinutes >= 1440;

  return {
    activities,
    loading,
    totalMinutes,
    remainingMinutes,
    isComplete,
    addActivity,
    updateActivity,
    deleteActivity,
    refetch: fetchActivities,
  };
}
