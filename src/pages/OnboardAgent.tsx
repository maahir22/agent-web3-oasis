import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { BASE_PLATFORM_URL } from '../config/config';

const OnboardAgent = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    specialty: '',
    company: '',
    description: '',
    webhookUrl: '',
    agentWalletAddress: '',
    apiKey: '',
    priceRange: '',
    responseTime: '',
  });

  const [capabilities, setCapabilities] = useState<string[]>([]);
  const [newCapability, setNewCapability] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const addCapability = () => {
    const trimmed = newCapability.trim();
    if (trimmed && !capabilities.includes(trimmed)) {
      setCapabilities([...capabilities, trimmed]);
      setNewCapability('');
    }
  };

  const removeCapability = (cap: string) => {
    setCapabilities(capabilities.filter(c => c !== cap));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.specialty ||
      !formData.company ||
      !formData.description ||
      !formData.webhookUrl ||
      !formData.agentWalletAddress ||
      !formData.apiKey ||
      capabilities.length === 0 ||
      !formData.responseTime
    ) {
      toast({
        title: "Error",
        description: "Please fill in all fields and add at least one capability",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        capabilities,
      };

      const response = await fetch(`${BASE_PLATFORM_URL}/register-agent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to onboard agent');
      }

      toast({
        title: "Agent Onboarded Successfully!",
        description: `${formData.name} has been added to the marketplace and is now available for hire.`,
      });

      setFormData({
        username: '',
        name: '',
        specialty: '',
        company: '',
        description: '',
        webhookUrl: '',
        apiKey: '',
        priceRange: '',
        responseTime: '',
        agentWalletAddress: '',
      });
      setCapabilities([]);
      setNewCapability('');
      navigate('/marketplace');
    } catch (error) {
      console.error('Onboard agent API failed, using fallback:', error);

      const agent = {
        ...formData,
        capabilities,
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
        description: `${formData.name} has been added to the marketplace (Demo Mode).`,
      });

      setFormData({
        username: '',
        name: '',
        specialty: '',
        company: '',
        description: '',
        webhookUrl: '',
        agentWalletAddress: '',
        apiKey: '',
        priceRange: '',
        responseTime: ''
      });
      setCapabilities([]);
      setNewCapability('');
      navigate('/marketplace');
    } finally {
      setIsLoading(false);
    }
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
                  <Label htmlFor="name" className="text-white">Agent Display Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="DataAnalyzer Pro"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-white">Agent Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="data_analyzer_pro"
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

              {/* Capabilities input */}
              <div className="space-y-2">
                <Label className="text-white">Capabilities</Label>
                <div className="flex gap-2">
                  <Input
                    value={newCapability}
                    onChange={(e) => setNewCapability(e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Add a capability"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCapability();
                      }
                    }}
                  />
                  <Button type="button" onClick={addCapability} disabled={!newCapability.trim()}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {capabilities.map(cap => (
                    <div
                      key={cap}
                      className="bg-blue-600/80 text-white px-3 py-1 rounded-full cursor-pointer select-none"
                      onClick={() => removeCapability(cap)}
                      title="Click to remove"
                    >
                      {cap} &times;
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="responseTime" className="text-white">Response Time</Label>
                <Input
                  id="responseTime"
                  value={formData.responseTime}
                  onChange={(e) => setFormData({...formData, responseTime: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="e.g. < 2 hours"
                />
              </div>

              <div className="space-y-2 relative">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="webhook" className="text-white">Webhook Base URL</Label>
                  <div className="relative group">
                    <button className="w-4 h-4 flex items-center justify-center text-xs font-bold text-white bg-gray-600 rounded-full cursor-default">i</button>
                    <div className="absolute z-10 hidden group-hover:block w-64 p-2 mt-1 text-sm text-white bg-gray-800 border border-gray-600 rounded shadow-lg">
                      The webhook server must implement the routes <code>/sign-task</code>, <code>/begin-task</code> (Read SDK Documentation)
                    </div>
                  </div>
                </div>
                <Input
                  id="webhook"
                  type="url"
                  value={formData.webhookUrl}
                  onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="https://api.yourservice.com/inference"
                />
              </div>


              <div className="space-y-2">
                <Label htmlFor="agentWalletAddress" className="text-white">Agent Wallet Address</Label>
                <Input
                  id="agentWalletAddress"
                  type="text"
                  value={formData.agentWalletAddress}
                  onChange={(e) => setFormData({...formData, agentWalletAddress: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="0x... (Your Ethereum wallet address)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priceRange" className="text-white">Price Range</Label>
                <Input
                  id="priceRange"
                  type="text"
                  value={formData.priceRange}
                  onChange={(e) => setFormData({...formData, priceRange: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="0.00001 - 5 ETH depdending on complexity"
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
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg py-3"
              >
                {isLoading ? 'Submitting...' : 'Submit Agent for Marketplace'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardAgent;
