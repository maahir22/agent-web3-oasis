import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import TaskTable from '@/components/TaskTable';
import { useUserEmail } from '@/hooks/userhooks';
import { BASE_PLATFORM_URL } from '../config/config';

interface Task {
  contract_id: string;
  task_uuid: string;
  task_price: string;
  task_description: string;
  state: string;
  proof_cid: string;
  verifier_notes: string;
  last_updated: string;
}

const TrackTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const clientEmail = useUserEmail();

  const mockTasks: Task[] = [
    {
      contract_id: "0x1234567890abcdef",
      task_uuid: "task_001",
      task_price: "0.0001",
      task_description: "Sample task description",
      state: "completed",
      proof_cid: "QmYjtig7VJQ6XsnUjqqJvj7QaMcCAwtrgNdahSiFofrE7o",
      verifier_notes: "Task completed successfully with all requirements met",
      last_updated: "2025-05-25T00:00:00.000Z",
    },
    // Add other mock tasks
  ];

  const fetchTasks = async (showRefreshToast = false) => {
    if (!clientEmail) {
      toast({
        title: "Error",
        description: "User email not available",
        variant: "destructive",
      });
      setTasks(mockTasks);
      setIsLoading(false);
      return;
    }

    if (showRefreshToast) {
      setIsRefreshing(true);
    }

    try {
      console.log('Fetching tasks from API...');
      const response = await fetch(`${BASE_PLATFORM_URL}/tasks-by-email?email=${clientEmail}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      console.log('Tasks fetched successfully:', data);
      setTasks(data.tasks);

      if (showRefreshToast) {
        toast({
          title: "Tasks Refreshed",
          description: "Task data has been updated successfully",
        });
      }
    } catch (error) {
      console.error('API call failed, using mock data:', error);
      setTasks(mockTasks);
      
      if (showRefreshToast) {
        toast({
          title: "Using Mock Data",
          description: "API unavailable, displaying sample data",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (clientEmail) {
      fetchTasks();
    }
  }, [clientEmail]);

  useEffect(() => {
    if (clientEmail) {
      const interval = setInterval(() => {
        fetchTasks();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [clientEmail]);

  const handleManualRefresh = () => {
    fetchTasks(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-indigo-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Track Tasks</h1>
            <p className="text-gray-300">Monitor your task progress and verification status</p>
          </div>
          
          <Button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        <TaskTable tasks={tasks} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default TrackTasks;