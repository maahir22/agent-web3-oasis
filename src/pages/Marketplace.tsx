import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Building, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { BASE_PLATFORM_URL } from '../config/config';

const mockAgents = [
  {
    id: 'data-analyzer-pro',
    name: "DataAnalyzer Pro",
    company: "TechCorp AI",
    specialty: "Data Analysis & Insights",
    rating: 4.9,
    reviews: 156,
    description:
      "Advanced AI agent specializing in complex data analysis, pattern recognition, and business insights generation.",
    avatar: "🤖",
  },
  {
    id: 'content-craft-ai',
    name: "ContentCraft AI",
    company: "Creative Solutions",
    specialty: "Content Creation",
    rating: 4.8,
    reviews: 203,
    description:
      "Expert content creation AI for marketing materials, blog posts, and creative writing with brand consistency.",
    avatar: "✍️",
  },
  {
    id: 3,
    name: "CodeMaster Bot",
    company: "DevGenius Inc",
    specialty: "Software Development",
    rating: 4.9,
    reviews: 89,
    description:
      "Full-stack development AI capable of writing, testing, and deploying production-ready code across multiple languages.",
    avatar: "💻",
  },
  {
    id: 4,
    name: "VisionAnalyst AI",
    company: "ImageTech Solutions",
    specialty: "Image & Video Analysis",
    rating: 4.7,
    reviews: 124,
    description:
      "Computer vision specialist for object detection, image classification, and video content analysis.",
    avatar: "👁️",
  },
  {
    id: 5,
    name: "CustomerCare Pro",
    company: "ServiceBot Ltd",
    specialty: "Customer Support",
    rating: 4.8,
    reviews: 312,
    description:
      "Intelligent customer service AI with natural language processing and multi-language support.",
    avatar: "💬",
  },
  {
    id: 6,
    name: "MarketPredictor AI",
    company: "FinanceAI Corp",
    specialty: "Market Analysis",
    rating: 4.9,
    reviews: 78,
    description:
      "Financial market analysis AI with predictive modeling and risk assessment capabilities.",
    avatar: "📈",
  },
];

const Marketplace = () => {
  const navigate = useNavigate();

  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    async function fetchAgents() {
      try {
        const response = await fetch(`${BASE_PLATFORM_URL}/list-agents`);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        const apiAgents = await response.json();

        // Append mock agents to fetched agents
        const combinedAgents = [...apiAgents, ...mockAgents];
        setAgents(combinedAgents);
      } catch (error) {
        console.error("Fetch failed, falling back to mock data:", error);
        setAgents(mockAgents);
        setFetchError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAgents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl">
        Loading agents...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            AI Agent Marketplace
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover and hire specialized AI agents for your business needs. All
            powered by Web3 payments.
          </p>
          {fetchError && (
            <p className="mt-4 text-red-400">
              Error fetching agents: {fetchError}. Showing fallback mock data.
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <Card
              key={agent.id}
              className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 cursor-pointer transform hover:scale-105"
              onClick={() => navigate(`/agent/${agent.id}`)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="text-4xl">{agent.avatar}</div>
                  <Badge
                    variant="secondary"
                    className="bg-blue-600/20 text-blue-300 border-blue-500/30"
                  >
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    {agent.rating}
                  </Badge>
                </div>
                <CardTitle className="text-white text-xl">{agent.name}</CardTitle>
                <div className="flex items-center text-gray-400 text-sm">
                  <Building className="w-4 h-4 mr-1" />
                  {agent.company}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
                    <span className="text-purple-300 font-medium">{agent.specialty}</span>
                  </div>
                  <p className="text-gray-300 text-sm line-clamp-2">{agent.description}</p>
                  <div className="text-gray-400 text-xs">{agent.reviews} reviews</div>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/agent/${agent.id}`);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
