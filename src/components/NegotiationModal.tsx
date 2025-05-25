import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Rocket, Send, Bot, User } from 'lucide-react';
import { useUserEmail, useUserEthWallet } from '../hooks/userhooks';
import { BASE_PLATFORM_URL } from '../config/config';

interface NegotiationModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentName: string;
  agentUserName: string;
}

interface Message {
  id: string;
  sender: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

interface ContractResponse {
  task_uuid: string;
  contract_address: string;
  task_price: string;
  message?: string;
  error?: string;
  details?: string;
}

const NegotiationModal = ({ isOpen, onClose, agentName, agentUserName }: NegotiationModalProps) => {
  const clientEmail = useUserEmail();
  const clientEthWallet = useUserEthWallet();
  const [step, setStep] = useState<'details' | 'negotiation' | 'loading' | 'result'>('details');
  const [formData, setFormData] = useState({
    budget: '',
    taskRequirements: '',
    satisfactionCriteria: ''
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [negotiationCount, setNegotiationCount] = useState(0);
  const [negotiationStatus, setNegotiationStatus] = useState<'haggling' | 'accepted' | null>(null);
  const [contractResponse, setContractResponse] = useState<ContractResponse | null>(null);
  const { toast } = useToast();

  const clientBudget = parseFloat(formData.budget.replace(/[^0-9.]/g, '')) || 0;
  const maxBudget = clientBudget * 1.3;

  // Loader messages with fire emojis
  const loaderMessages = [
    "AI Agent is cooking 🔥🔥",
    "Deploying smart contract 🚀🔥",
    "Securing the deal 💸🔥",
    "Finalizing agreement 📝🔥"
  ];

  const [currentLoaderMessage, setCurrentLoaderMessage] = useState(0);

  // Cycle through loader messages
  useEffect(() => {
    if (step === 'loading') {
      const interval = setInterval(() => {
        setCurrentLoaderMessage((prev) => (prev + 1) % loaderMessages.length);
      }, 2000); // Change message every 2 seconds
      return () => clearInterval(interval);
    }
  }, [step]);

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
      const initialUserMessage = `I'd like to work with you on: ${formData.taskRequirements}. My budget is ${formData.budget} and success criteria: ${formData.satisfactionCriteria}`;
      
      const response = await fetch(`${BASE_PLATFORM_URL}/haggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentName,
          budget: formData.budget,
          taskRequirements: formData.taskRequirements,
          satisfactionCriteria: formData.satisfactionCriteria,
          conversationHistory: [],
          negotiationCount: 0,
          maxBudget
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start negotiation');
      }

      const result = await response.json();
      
      const initialMessages: Message[] = [
        {
          id: '1',
          sender: 'user',
          content: initialUserMessage,
          timestamp: new Date()
        },
        {
          id: '2',
          sender: 'agent',
          content: result.message || `Thank you for your interest! I've reviewed your requirements for "${formData.taskRequirements}" with a budget of ${formData.budget}. I can deliver excellent results that meet your criteria. Let's discuss specifics.`,
          timestamp: new Date()
        }
      ];

      setMessages(initialMessages);
      setNegotiationStatus(result.status || 'haggling');
      setNegotiationCount(1);
      setStep('negotiation');
    } catch (error) {
      console.error('Haggle API failed, using fallback:', error);
      
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
      setNegotiationStatus('haggling');
      setNegotiationCount(1);
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
      const conversationHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      const response = await fetch(`${BASE_PLATFORM_URL}/haggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentName,
          budget: formData.budget,
          taskRequirements: formData.taskRequirements,
          satisfactionCriteria: formData.satisfactionCriteria,
          conversationHistory: [...conversationHistory, { role: 'user', content: newMessage }],
          negotiationCount: negotiationCount + 1,
          maxBudget
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const result = await response.json();
      
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        content: result.message || 'I understand your position. Let\'s continue our discussion to find the best solution.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, agentMessage]);
      setNegotiationStatus(result.status || 'haggling');
      setNegotiationCount(prev => prev + 1);

      if (negotiationCount + 1 >= 15) {
        setNegotiationStatus('accepted');
      }
    } catch (error) {
      console.error('Haggle API failed, using fallback:', error);
      
      const mockResponses = [
        "That sounds reasonable. I can adjust my approach to fit within your budget while maintaining quality.",
        "I understand your requirements better now. Let me propose a revised timeline that works for both of us.",
        "I appreciate your flexibility. Let's work together to find a solution that meets both our needs.",
        "Your feedback is valuable. I can modify my proposal to better align with your expectations.",
        "I think we're making good progress. Let's continue refining the details.",
        "Great! I think we're aligned on the scope. I'll accept the terms to finalize the agreement."
      ];
      
      const responseIndex = Math.min(negotiationCount, mockResponses.length - 1);
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        content: mockResponses[responseIndex],
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, agentMessage]);
      
      if (negotiationCount + 1 >= 6) {
        setNegotiationStatus('accepted');
      } else {
        setNegotiationStatus('haggling');
      }
      
      setNegotiationCount(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalizeAgreement = async () => {
    if (negotiationStatus !== 'accepted') {
      toast({
        title: "Cannot Finalize",
        description: "Agreement can only be finalized when the agent accepts the terms.",
        variant: "destructive"
      });
      return;
    }

    setStep('loading');

    try {
      const response = await fetch(`${BASE_PLATFORM_URL}/create-funded-contract-v2`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_username: agentUserName,
          client_username: clientEmail,
          final_task_price: clientBudget,
          task_description: formData.taskRequirements,
          task_validation_requirements: formData.satisfactionCriteria
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create contract');
      }

      setContractResponse(result);
      setStep('result');
      toast({
        title: "Agreement Finalized!",
        description: `Contract established with ${agentName}. Work will begin shortly.`,
      });
    } catch (error) {
      console.error('Contract creation failed:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create contract",
        variant: "destructive"
      });
      setStep('negotiation');
    }
  };

  const isNegotiationComplete = negotiationStatus === 'accepted';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-gray-900 border-gray-700 max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white text-center">
            {step === 'details' ? `Work with ${agentName}` : 
             step === 'negotiation' ? `Negotiating with ${agentName}` :
             step === 'loading' ? 'Finalizing Contract' : 
             'Contract Details'}
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
        ) : step === 'negotiation' ? (
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
            
            {!isNegotiationComplete && (
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isLoading && newMessage.trim() && handleSendMessage()}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Type your message..."
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={isLoading || !newMessage.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            )}
            
            {isNegotiationComplete && (
              <div className="bg-green-900/20 border border-green-700 rounded-lg p-3 mb-4">
                <p className="text-green-400 text-sm text-center">
                  🎉 Negotiation complete! The agent has accepted your terms.
                </p>
              </div>
            )}
            
            <Button 
              onClick={handleFinalizeAgreement}
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white"
              disabled={negotiationStatus !== 'accepted'}
            >
              Finalize Agreement
            </Button>
          </div>
        ) : step === 'loading' ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
            <p className="text-white text-lg font-semibold animate-pulse">
              {loaderMessages[currentLoaderMessage]}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
              <p className="text-green-400 text-center text-lg font-semibold">
                🎉 Contract Successfully Created!
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-white">Task ID</Label>
                <Input
                  value={contractResponse?.task_uuid || ''}
                  readOnly
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Contract Address</Label>
                <Input
                  value={contractResponse?.contract_address || ''}
                  readOnly
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Task Price (ETH)</Label>
                <Input
                  value={contractResponse?.task_price || ''}
                  readOnly
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>
            <Button
              onClick={onClose}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NegotiationModal;