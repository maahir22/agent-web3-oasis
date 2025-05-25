
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { BASE_PLATFORM_URL } from '../config/config';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegistrationModal = ({ isOpen, onClose }: RegistrationModalProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    walletAddress: '',
    privateKey: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password || !formData.walletAddress || !formData.privateKey) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // API call for registration
      const response = await fetch(`${BASE_PLATFORM_URL}/register-client`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: formData.email,
          eth_wallet_address: formData.walletAddress,
          eth_wallet_private_key: formData.privateKey,
          password: formData.password
        }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const result = await response.json();
      
      // Store user data from API response
      localStorage.setItem('userRegistration', JSON.stringify(result));
      
      toast({
        title: "Registration Successful!",
        description: "Welcome to the AI Web3 Marketplace",
      });
      
      onClose();
      navigate('/marketplace');
    } catch (error) {
      console.error('Registration API failed, using fallback:', error);
      
      // Fallback to localStorage
      localStorage.setItem('userRegistration', JSON.stringify(formData));
      
      toast({
        title: "Registration Successful!",
        description: "Welcome to the AI Web3 Marketplace (Demo Mode)",
      });
      
      onClose();
      navigate('/marketplace');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white text-center">
            Join the AI Web3 Revolution
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="your@email.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="Create a strong password"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="wallet" className="text-white">Primary ETH Wallet Address</Label>
            <Input
              id="wallet"
              value={formData.walletAddress}
              onChange={(e) => setFormData({...formData, walletAddress: e.target.value})}
              className="bg-gray-800 border-gray-600 text-white font-mono"
              placeholder="0x..."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="privateKey" className="text-white">Primary ETH Wallet Private Key</Label>
            <Input
              id="privateKey"
              type="password"
              value={formData.privateKey}
              onChange={(e) => setFormData({...formData, privateKey: e.target.value})}
              className="bg-gray-800 border-red-500 text-white font-mono"
              placeholder="Private key..."
            />
            <Alert className="bg-red-900/20 border-red-500">
              <AlertDescription className="text-red-300 text-sm">
                ⚠️ Warning: Never share your private key. This is for demo purposes only.
              </AlertDescription>
            </Alert>
          </div>
          
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            {isLoading ? 'Registering...' : 'Register & Enter Marketplace'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationModal;
