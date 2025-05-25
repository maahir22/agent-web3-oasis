
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { BASE_PLATFORM_URL } from '../config/config';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_PLATFORM_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        console.error('Login API failed:', response.statusText);
        throw new Error('Login failed');
      }

      const result = await response.json();
      
      localStorage.setItem('userSession', JSON.stringify(result));
      
      toast({
        title: "Login Successful!",
        description: "Welcome back to the AI Web3 Marketplace",
      });
      
      onClose();
      navigate('/marketplace');
    } catch (error) {
      console.error('Login API failed, using fallback:', error);
      
      // Fallback: check if user exists in localStorage
      const existingUser = localStorage.getItem('userRegistration');
      if (existingUser) {
        const userData = JSON.parse(existingUser);
        if (userData.email === formData.email && userData.password === formData.password) {
          localStorage.setItem('userSession', JSON.stringify({ email: formData.email, loggedIn: true }));
          
          toast({
            title: "Login Successful!",
            description: "Welcome back to the AI Web3 Marketplace (Demo Mode)",
          });
          
          onClose();
          navigate('/marketplace');
        } else {
          toast({
            title: "Login Failed",
            description: "Invalid credentials",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Login Failed",
          description: "No account found. Please register first.",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white text-center">
            Welcome Back
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
              placeholder="Enter your password"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
