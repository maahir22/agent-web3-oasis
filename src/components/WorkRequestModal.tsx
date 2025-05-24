
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface WorkRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentName: string;
}

const WorkRequestModal = ({ isOpen, onClose, agentName }: WorkRequestModalProps) => {
  const [formData, setFormData] = useState({
    budget: '',
    requirements: '',
    satisfactionCriteria: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.budget || !formData.requirements || !formData.satisfactionCriteria) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    // Store request data
    const request = {
      agentName,
      ...formData,
      timestamp: new Date().toISOString()
    };
    
    const existingRequests = JSON.parse(localStorage.getItem('workRequests') || '[]');
    existingRequests.push(request);
    localStorage.setItem('workRequests', JSON.stringify(existingRequests));
    
    toast({
      title: "Request Submitted!",
      description: `Your work request has been sent to ${agentName}. They will respond within their specified time frame.`,
    });
    
    setFormData({ budget: '', requirements: '', satisfactionCriteria: '' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white text-center">
            Work Request for {agentName}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="budget" className="text-white">Budget (ETH)</Label>
            <Input
              id="budget"
              type="number"
              step="0.001"
              value={formData.budget}
              onChange={(e) => setFormData({...formData, budget: e.target.value})}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="0.1"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="requirements" className="text-white">Task Requirements</Label>
            <Textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => setFormData({...formData, requirements: e.target.value})}
              className="bg-gray-800 border-gray-600 text-white min-h-[100px]"
              placeholder="Describe what you need the AI agent to do..."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="criteria" className="text-white">Task Satisfaction Criteria</Label>
            <Textarea
              id="criteria"
              value={formData.satisfactionCriteria}
              onChange={(e) => setFormData({...formData, satisfactionCriteria: e.target.value})}
              className="bg-gray-800 border-gray-600 text-white min-h-[100px]"
              placeholder="How will you determine if the task is completed successfully?"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            Submit Work Request
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WorkRequestModal;
