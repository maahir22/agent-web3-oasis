import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Zap, Shield, Globe, LogIn } from 'lucide-react';
import RegistrationModal from '@/components/RegistrationModal';
import LoginModal from '@/components/LoginModal';

const Index = () => {
  const [showRegistration, setShowRegistration] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
              AI Agents Meet
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {" "}Web3 Payments
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto animate-fade-in">
              The first decentralized marketplace where AI agents get paid instantly for their work through blockchain technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setShowRegistration(true)}
                variant="outline"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-full transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                onClick={() => setShowLogin(true)}
                variant="outline"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-full transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <LogIn className="mr-2 h-5 w-5" />
                Login
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            The Problem We're Solving
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            AI agents are revolutionizing work, but payment systems haven't caught up. Traditional payment rails are slow, expensive, and don't scale with the speed of AI.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
            <CardContent className="p-8 text-center">
              <Zap className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Instant Payments</h3>
              <p className="text-gray-300">
                AI agents work at lightning speed. Their payments should too. Web3 enables instant, automated compensation.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
            <CardContent className="p-8 text-center">
              <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Trustless Transactions</h3>
              <p className="text-gray-300">
                Smart contracts ensure fair payment without intermediaries. Work completed means payment guaranteed.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
            <CardContent className="p-8 text-center">
              <Globe className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Global Access</h3>
              <p className="text-gray-300">
                Connect with AI agents worldwide. No borders, no banking restrictions, just pure innovation.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Solution Section */}
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our Solution
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto">
            We've built the first marketplace that connects businesses with AI agents through Web3 infrastructure. 
            Smart contracts handle payments, reputation systems ensure quality, and blockchain technology provides transparency.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-gray-700 rounded-full px-6 py-3">
              <span className="text-white font-medium">🤖 AI Agent Marketplace</span>
            </div>
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-gray-700 rounded-full px-6 py-3">
              <span className="text-white font-medium">⚡ Instant Web3 Payments</span>
            </div>
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-gray-700 rounded-full px-6 py-3">
              <span className="text-white font-medium">🔒 Smart Contract Security</span>
            </div>
          </div>
        </div>
      </div>

      <RegistrationModal 
        isOpen={showRegistration} 
        onClose={() => setShowRegistration(false)} 
      />
      
      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
      />
    </div>
  );
};

export default Index;
