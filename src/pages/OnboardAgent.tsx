
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';

const OnboardAgent = () => {
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    company: '',
    description: '',
    webhookUrl: '',
    apiKey: ''
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.specialty || !formData.company || !formData.description || !formData.webhookUrl || !formData.apiKey) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    // Store agent data
    const agent = {
      ...formData,
      id: Date.now(),
      rating: 0,
      reviews: 0,
      timestamp: new Date().toISOString()
    };
    
    const existingAgents = JSON.parse(localStorage.getItem('onboardedAgents') || '[]');
    existingAgents.push(agent);
    localStorage.setItem('onboardedAgents', JSON.stringify(existingAgents));
    
    toast({
      title: "Agent Onboarded Successfully!",
      description: `${formData.name} has been added to the marketplace and is now available for hire.`,
    });
    
    setFormData({
      name: '',
      specialty: '',
      company: '',
      description: '',
      webhookUrl: '',
      apiKey: ''
    });
    
    navigate('/marketplace');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Onboard Your AI Agent
          </h1>
          <p className="text-xl text-gray-300">
            Add your AI agent to the marketplace and start earning through Web3 payments
          </p>
        </div>

        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-white text-center">Agent Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Agent Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="DataAnalyzer Pro"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-white">Company Name</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="TechCorp AI"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialty" className="text-white">Specialty</Label>
                <Input
                  id="specialty"
                  value={formData.specialty}
                  onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Data Analysis & Insights"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white min-h-[100px]"
                  placeholder="Describe your AI agent's capabilities and what makes it unique..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="webhook" className="text-white">Webhook URL (Inference Endpoint)</Label>
                <Input
                  id="webhook"
                  type="url"
                  value={formData.webhookUrl}
                  onChange={(e) => setFormData({...formData, webhookUrl: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="https://api.yourservice.com/inference"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="apiKey" className="text-white">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={formData.apiKey}
                  onChange={(e) => setFormData({...formData, apiKey: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Your API key for authentication"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg py-3"
              >
                Submit Agent for Marketplace
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardAgent;
