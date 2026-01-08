import { Star, Zap, Building } from 'lucide-react';

export const plans = [
  {
    name: "Free Access",
    icon: Star,
    price: { monthly: 0, annual: 0 },
    description: "Perfect for getting started",
    features: [
      "Access to 100+ free courses",
      "Basic course completion certificates",
      "Community forum access",
      "Mobile app access",
      "Standard video quality"
    ],
    limitations: [
      "Limited course selection",
      "No offline downloads",
      "Basic support only"
    ],
    cta: "Get Started Free",
    popular: false,
    color: "border-gray-200 hover:border-gray-300"
  },
  {
    name: "LearnHub Plus",
    icon: Zap,
    price: { monthly: 29, annual: 19 },
    description: "Unlimited learning for individuals",
    features: [
      "Unlimited access to 50K+ courses",
      "Professional certificates",
      "Offline downloads",
      "Ad-free learning experience",
      "Priority support",
      "Advanced analytics",
      "Career guidance tools",
      "1-on-1 mentor sessions (2/month)"
    ],
    limitations: [],
    cta: "Start Free Trial",
    popular: true,
    color: "border-blue-500 ring-2 ring-blue-200"
  },
  {
    name: "Enterprise",
    icon: Building,
    price: { monthly: 99, annual: 79 },
    description: "Advanced tools for teams",
    features: [
      "Everything in LearnHub Plus",
      "Team management dashboard",
      "Advanced reporting & analytics",
      "Custom learning paths",
      "SSO integration",
      "Dedicated account manager",
      "Custom branding",
      "API access",
      "Unlimited mentor sessions"
    ],
    limitations: [],
    cta: "Contact Sales",
    popular: false,
    color: "border-purple-500 hover:border-purple-600"
  }
];