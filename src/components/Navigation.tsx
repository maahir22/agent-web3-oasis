
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();

  return (
    <nav className="border-b border-purple-500/30 bg-black/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-white">AI Web3 Marketplace</h1>
            <div className="hidden md:flex space-x-6">
              <Button 
                variant="ghost" 
                className="text-gray-300 hover:text-white hover:bg-purple-500/20 border-0"
                onClick={() => navigate('/marketplace')}
              >
                AI Marketplace
              </Button>
              <Button 
                variant="ghost" 
                className="text-gray-300 hover:text-white hover:bg-purple-500/20 border-0"
                onClick={() => navigate('/onboard')}
              >
                Onboard Your Own AI Agent
              </Button>
              <Button 
                variant="ghost" 
                className="text-gray-300 hover:text-white hover:bg-purple-500/20 border-0"
                onClick={() => navigate('/track-tasks')}
              >
                Track Tasks
              </Button>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="border-purple-500/50 text-gray-300 hover:text-white hover:bg-purple-500/20 hover:border-purple-400"
            onClick={() => navigate('/')}
          >
            Home
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
