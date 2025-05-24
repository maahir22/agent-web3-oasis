
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Rocket, Send, Bot, User } from 'lucide-react';

interface NegotiationModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentName: string;
}

interface Message {
  id: string;
  sender: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

const NegotiationModal = ({ isOpen, onClose, agentName }: NegotiationModalProps) => {
  const [step, setStep] = useState<'details' | 'negotiation'>('details');
  const [formData, setFormData] = useState({
    budget: '',
    taskRequirements: '',
    satisfactionCriteria: ''
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.budget || !formData.taskRequirements || !formData.satisfactionCriteria) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/negotiations/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentName,
          ...formData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start negotiation');
      }

      const result = await response.json();
      
      // Add initial messages
      const initialMessages: Message[] = [
        {
          id: '1',
          sender: 'user',
          content: `I'd like to work with you on: ${formData.taskRequirements}. My budget is ${formData.budget} and success criteria: ${formData.satisfactionCriteria}`,
          timestamp: new Date()
        },
        {
          id: '2',
          sender: 'agent',
          content: result.agentResponse || `Thank you for your interest! I've reviewed your requirements. Based on the complexity of "${formData.taskRequirements}" and your budget of ${formData.budget}, I can definitely help. Let me propose a detailed approach that meets your satisfaction criteria.`,
          timestamp: new Date()
        }
      ];
      
      setMessages(initialMessages);
      setStep('negotiation');
    } catch (error) {
      console.error('Negotiation start API failed, using fallback:', error);
      
      // Fallback mock response
      const initialMessages: Message[] = [
        {
          id: '1',
          sender: 'user',
          content: `I'd like to work with you on: ${formData.taskRequirements}. My budget is ${formData.budget} and success criteria: ${formData.satisfactionCriteria}`,
          timestamp: new Date()
        },
        {
          id: '2',
          sender: 'agent',
          content: `Thank you for your interest! I've reviewed your requirements for "${formData.taskRequirements}" with a budget of ${formData.budget}. I can deliver excellent results that meet your criteria. Let's discuss the timeline and specific deliverables.`,
          timestamp: new Date()
        }
      ];
      
      setMessages(initialMessages);
      setStep('negotiation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/negotiations/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentName,
          message: newMessage,
          conversationHistory: messages
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const result = await response.json();
      
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        content: result.agentResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      console.error('Message API failed, using fallback:', error);
      
      // Fallback mock responses
      const mockResponses = [
        "That sounds reasonable. I can adjust my approach to fit within your budget while maintaining quality.",
        "I understand your requirements better now. Let me propose a revised timeline that works for both of us.",
        "Great! I think we're aligned on the scope. Shall we finalize the agreement and start working?",
        "I can definitely accommodate that request. Let me outline the specific deliverables."
      ];
      
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        content: mockResponses[Math.floor(Math.random() * mockResponses.length)],
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, agentMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalizeAgreement = () => {
    toast({
      title: "Agreement Finalized!",
      description: `Contract established with ${agentName}. Work will begin shortly.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-gray-900 border-gray-700 max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white text-center">
            {step === 'details' ? `Work with ${agentName}` : `Negotiating with ${agentName}`}
          </DialogTitle>
        </DialogHeader>
        
        {step === 'details' ? (
          <form onSubmit={handleDetailsSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="budget" className="text-white">Budget Range</Label>
              <Input
                id="budget"
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="e.g., $100-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="requirements" className="text-white">Task Requirements</Label>
              <Textarea
                id="requirements"
                value={formData.taskRequirements}
                onChange={(e) => setFormData({...formData, taskRequirements: e.target.value})}
                className="bg-gray-800 border-gray-600 text-white min-h-[100px]"
                placeholder="Describe what you need the AI agent to accomplish..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="criteria" className="text-white">Success Criteria</Label>
              <Textarea
                id="criteria"
                value={formData.satisfactionCriteria}
                onChange={(e) => setFormData({...formData, satisfactionCriteria: e.target.value})}
                className="bg-gray-800 border-gray-600 text-white min-h-[80px]"
                placeholder="How will you measure if the task is completed successfully?"
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {isLoading ? 'Starting Negotiation...' : 'Start Negotiation'} <Rocket className="ml-2 h-5 w-5" />
            </Button>
          </form>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-96">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <Card className={`max-w-[80%] ${message.sender === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                    <CardContent className="p-3">
                      <div className="flex items-start space-x-2">
                        {message.sender === 'user' ? (
                          <User className="w-4 h-4 text-white mt-1" />
                        ) : (
                          <Bot className="w-4 h-4 text-white mt-1" />
                        )}
                        <p className="text-white text-sm">{message.content}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Type your message..."
                disabled={isLoading}
              />
              <Button onClick={handleSendMessage} disabled={isLoading || !newMessage.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            <Button 
              onClick={handleFinalizeAgreement}
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white"
            >
              Finalize Agreement
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NegotiationModal;
