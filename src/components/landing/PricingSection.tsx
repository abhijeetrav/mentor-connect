import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free Consultation",
    description: "Try before you commit",
    price: "Free",
    period: "",
    features: [
      "15-minute intro session",
      "Browse all mentor profiles",
      "Access to free resources",
      "Community forum access",
    ],
    cta: "Get Started Free",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "Hourly Session",
    description: "Perfect for specific questions",
    price: "$50",
    period: "/hour",
    priceNote: "Starting from",
    features: [
      "1-on-1 video or voice call",
      "Session recording available",
      "Follow-up resources",
      "Direct messaging (24hrs)",
    ],
    cta: "Book a Session",
    variant: "hero" as const,
    popular: true,
  },
  {
    name: "Weekly Package",
    description: "Consistent guidance",
    price: "$180",
    period: "/week",
    priceNote: "Starting from",
    features: [
      "2 hours of sessions/week",
      "Unlimited messaging",
      "Goal tracking dashboard",
      "Priority scheduling",
      "Homework & assignments",
    ],
    cta: "Subscribe Weekly",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "Monthly Plan",
    description: "Best value for serious growth",
    price: "$599",
    period: "/month",
    priceNote: "Starting from",
    features: [
      "8 hours of sessions/month",
      "Unlimited messaging",
      "Custom learning roadmap",
      "Progress reports",
      "Resource library access",
      "Emergency support",
    ],
    cta: "Go Monthly",
    variant: "warm" as const,
    popular: false,
  },
];

const PricingSection = () => {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Flexible <span className="text-gradient">Pricing</span> Plans
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose a plan that fits your needs. From free consultations to comprehensive monthly packages.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative bg-card rounded-2xl border ${
                plan.popular ? "border-primary shadow-glow" : "border-border shadow-soft"
              } p-6 flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 gradient-hero rounded-full text-primary-foreground text-sm font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <div className="mb-6">
                {plan.priceNote && (
                  <p className="text-xs text-muted-foreground mb-1">{plan.priceNote}</p>
                )}
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button variant={plan.variant} className="w-full" asChild>
                <Link to="/signup">{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
