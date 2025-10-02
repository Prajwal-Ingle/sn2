"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Car, BarChart3, Brain, Users, CheckCircle, ArrowRight, Zap, Target, TrendingUp } from "lucide-react"
import { useState } from "react"

interface LandingPageProps {
  onGetStarted: () => void
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  const features = [
    {
      icon: Brain,
      title: "AI Safety Scoring",
      description:
        "Advanced machine learning algorithms analyze driving patterns and provide personalized safety scores with actionable insights.",
      stats: "98% accuracy",
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description:
        "Interactive dashboards with live data visualization for comprehensive driving behavior analysis and trend monitoring.",
      stats: "5+ visualizations",
    },
    {
      icon: Car,
      title: "Vehicle Management",
      description:
        "Complete vehicle lifecycle management with document tracking, maintenance alerts, and compliance monitoring.",
      stats: "100% compliance",
    },
    {
      icon: Shield,
      title: "Risk Assessment",
      description:
        "Predictive risk modeling identifies potential safety issues before they occur, enabling proactive intervention.",
      stats: "85% risk reduction",
    },
    {
      icon: Users,
      title: "Fleet Oversight",
      description:
        "Comprehensive admin panel for managing multiple drivers with detailed analytics and performance insights.",
      stats: "Unlimited drivers",
    },
    {
      icon: Target,
      title: "Violation Tracking",
      description:
        "Automated challan detection and tracking with detailed violation history and payment status monitoring.",
      stats: "Real-time updates",
    },
  ]

  const testimonials = [
    {
      company: "TransLogistics",
      metric: "45% reduction",
      description: "in traffic violations",
      logo: "TL",
    },
    {
      company: "FleetMax",
      metric: "92% improvement",
      description: "in safety scores",
      logo: "FM",
    },
    {
      company: "DriveSecure",
      metric: "60% faster",
      description: "incident response",
      logo: "DS",
    },
    {
      company: "SafeRoads",
      metric: "3x increase",
      description: "in compliance rates",
      logo: "SR",
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 premium-glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold instagram-gradient-text text-glow">SafeSync</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#analytics" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Analytics
              </a>
              <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Testimonials
              </a>
              <Button
                onClick={onGetStarted}
                className="instagram-gradient hover:opacity-90 text-white font-medium neon-glow"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 premium-glass border-white/20 neon-glow">
            <Zap className="h-3 w-3 mr-1" />
            AI for Driver Safety
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
            Sync Detect Protect
            <br />
            <span className="instagram-gradient-text text-glow">with AI-powered driver safety</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
            Synchronize your fleet data, detect safety risks in real-time, and protect your drivers with
            industry-leading AI models and comprehensive analytics tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={onGetStarted}
              className="instagram-gradient hover:opacity-90 text-white font-medium neon-glow"
            >
              Start building <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 hover:bg-white/5 bg-transparent premium-glass"
            >
              View demo <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="premium-card border-white/10 text-center hover:neon-glow transition-all duration-300"
              >
                <CardContent className="pt-6">
                  <div className="w-12 h-12 instagram-gradient rounded-lg flex items-center justify-center mx-auto mb-4 neon-glow">
                    <span className="text-white font-bold text-sm">{testimonial.logo}</span>
                  </div>
                  <div className="text-2xl font-bold instagram-gradient-text mb-1">{testimonial.metric}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.description}</div>
                  <div className="text-xs text-muted-foreground mt-2">{testimonial.company}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Advanced Safety Features</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our AI models provide comprehensive safety analysis with real-time insights and predictive capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="premium-card border-white/10 hover:border-white/20 hover:neon-glow transition-all duration-300 cursor-pointer float-premium"
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-lg instagram-gradient ${hoveredFeature === index ? "scale-110 neon-glow" : ""} transition-transform duration-300`}
                    >
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-xs premium-glass">
                      {feature.stats}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                  <div className="flex items-center mt-4 text-sm instagram-gradient-text">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Enterprise ready
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics Preview */}
      <section id="analytics" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Flagship Analytics</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Powerful analytics models for a variety of real-world safety scenarios with comprehensive insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="premium-card border-white/10 hover:neon-glow-green transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  Safety Score AI
                </CardTitle>
                <CardDescription>Smartest model for complex safety analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Real-time scoring
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Predictive analysis
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Multi-factor assessment
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="premium-card border-white/10 hover:neon-glow-blue transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                  Behavior Analytics
                </CardTitle>
                <CardDescription>Affordable model balancing speed and intelligence</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Pattern recognition
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Risk assessment
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Trend analysis
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="premium-card border-white/10 hover:neon-glow transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-400" />
                  Fleet Insights
                </CardTitle>
                <CardDescription>Fastest, most cost-effective model for fleet management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Fleet overview
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Driver comparison
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Performance metrics
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            The complete platform to
            <br />
            <span className="instagram-gradient-text text-glow">build driver safety.</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your team's toolkit to stop configuring and start innovating. Securely build, deploy, and scale the best
            driver safety experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={onGetStarted}
              className="instagram-gradient hover:opacity-90 text-white font-medium neon-glow"
            >
              Get a demo
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 hover:bg-white/5 bg-transparent premium-glass"
            >
              Explore the Platform
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="text-2xl font-bold instagram-gradient-text text-glow">SafeSync</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 SafeSync. AI-powered driver safety platform.</p>
        </div>
      </footer>
    </div>
  )
}
