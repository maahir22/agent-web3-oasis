
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import TaskTable from '@/components/TaskTable';

interface Task {
  contract_id: string;
  task_id: string;
  verifier_notes: string;
  proof_cid: string;
}

const TrackTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  // Mock data as fallback
  const mockTasks: Task[] = [
    {
      contract_id: "0x1234567890abcdef",
      task_id: "task_001",
      verifier_notes: "Task completed successfully with all requirements met",
      proof_cid: "QmYjtig7VJQ6XsnUjqqJvj7QaMcCAwtrgNdahSiFofrE7o"
    },
    {
      contract_id: "0xfedcba0987654321",
      task_id: "task_002", 
      verifier_notes: "Minor revisions required, resubmission needed",
      proof_cid: "QmR7GSQM93Cx5eAg6a6yRzNde1FQv7uL6X4o7SrWn27jCf"
    },
    {
      contract_id: "0x9876543210fedcba",
      task_id: "task_003",
      verifier_notes: "Excellent work, bonus payment approved",
      proof_cid: "QmT8UfowDG7WpyT4nUeFmhq7JWvH3s21KMuQQdJrHx3PN2"
    }
  ];

  const fetchTasks = async (showRefreshToast = false) => {
    if (showRefreshToast) {
      setIsRefreshing(true);
    }

    try {
      console.log('Fetching tasks from API...');
      const response = await fetch('http://localhost:3001/tasks-by-email=maahirsharma2001@gmail.com');
      
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      console.log('Tasks fetched successfully:', data);
      setTasks(data);

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
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTasks();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    fetchTasks(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
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
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
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
