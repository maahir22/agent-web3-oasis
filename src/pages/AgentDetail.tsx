import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Building, Sparkles, ArrowLeft, Rocket } from "lucide-react";
import Navigation from "@/components/Navigation";
import NegotiationModal from "@/components/NegotiationModal";
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
      "Advanced AI agent specializing in complex data analysis, pattern recognition, and business insights generation. With over 5 years of training data and sophisticated algorithms, DataAnalyzer Pro can process large datasets, identify trends, and provide actionable recommendations for business growth.",
    avatar: "🤖",
    capabilities: [
      "Statistical Analysis",
      "Predictive Modeling",
      "Data Visualization",
      "Report Generation",
    ],
    priceRange: "0.004 - 0.6 ETH",
    responseTime: "< 2 hours",
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
    capabilities: ["Blog Writing", "Marketing Copy", "Social Media", "SEO Content"],
    priceRange: "0.001 - 5 ETH",
    responseTime: "< 1 hour",
  },
];

const AgentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agents, setAgents] = useState<typeof mockAgents>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showNegotiation, setShowNegotiation] = useState(false);

  useEffect(() => {
    async function fetchAgents() {
      try {
        const res = await fetch(`${BASE_PLATFORM_URL}/list-agents`);
        if (!res.ok) throw new Error(`Failed to fetch agents: ${res.status}`);
        const apiAgents = await res.json();

        // Merge API agents with mock agents
        setAgents([...apiAgents, ...mockAgents]);
      } catch (error) {
        console.error("Fetch failed, using mock agents:", error);
        setFetchError(error.message);
        setAgents(mockAgents);
      } finally {
        setLoading(false);
      }
    }
    fetchAgents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        Loading agent details...
      </div>
    );
  }

  // Find the agent by id (id from useParams is string)
  const agent = agents.find((a) => String(a.id) === id);

  if (!agent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Agent Not Found</h1>
          <Button onClick={() => navigate("/marketplace")}>
            Back to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          className="text-gray-300 hover:text-white mb-6"
          onClick={() => navigate("/marketplace")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Marketplace
        </Button>

        {fetchError && (
          <p className="mb-4 text-red-400">
            Error loading some data: {fetchError}
          </p>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="text-6xl">{agent.avatar}</div>
                  <div>
                    <CardTitle className="text-3xl text-white mb-2">
                      {agent.name}
                    </CardTitle>
                    <div className="flex items-center text-gray-400 mb-2">
                      <Building className="w-4 h-4 mr-2" />
                      {agent.company}
                    </div>
                    <div className="flex items-center">
                      <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
                      <span className="text-purple-300 font-medium">
                        {agent.specialty}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">
                      About This Agent
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {agent.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Capabilities
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {agent.capabilities?.map((capability, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-blue-600/20 text-blue-300 border-blue-500/30"
                        >
                          {capability}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center">
                    <Star className="w-6 h-6 text-yellow-400 fill-current mr-2" />
                    <span className="text-2xl font-bold text-white">
                      {agent.rating}
                    </span>
                  </div>
                  <p className="text-gray-400">{agent.reviews} reviews</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Price Range:</span>
                      <span className="text-white">{agent.priceRange}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Response Time:</span>
                      <span className="text-white">{agent.responseTime}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => setShowNegotiation(true)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg py-3"
                  >
                    Work With Me <Rocket className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Placeholder for recent reviews — you can extend this */}
          </div>
        </div>
      </div>

      <NegotiationModal
        isOpen={showNegotiation}
        onClose={() => setShowNegotiation(false)}
        agentName={agent.name}
        agentUserName={agent.id}
      />
    </div>
  );
};

export default AgentDetail;
