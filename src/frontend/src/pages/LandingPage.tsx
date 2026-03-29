import AIChatWidget from "@/components/AIChatWidget";
import EmailCaptureForm from "@/components/EmailCaptureForm";
import MarketingFooter from "@/components/MarketingFooter";
import MarketingHeader from "@/components/MarketingHeader";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle,
  Clock,
  DollarSign,
  Settings,
  Shield,
  Star,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";
import { useEffect } from "react";

interface LandingPageProps {
  onNavigate: (path: string) => void;
  isAuthenticated: boolean;
}

const features = [
  {
    icon: BarChart3,
    title: "Sales CRM",
    desc: "Manage leads, pipelines, and close deals faster with intelligent automation.",
  },
  {
    icon: Settings,
    title: "Services Scheduling",
    desc: "Dispatch technicians, track service requests, and delight customers.",
  },
  {
    icon: Truck,
    title: "Logistics & Shipping",
    desc: "Real-time shipment tracking, route optimization, and inventory control.",
  },
  {
    icon: DollarSign,
    title: "Financial Management",
    desc: "Double-entry accounting, invoicing, budgets, and tax management in one place.",
  },
  {
    icon: Users,
    title: "HR & Employees",
    desc: "Onboard staff, track time, manage performance, and handle payroll.",
  },
  {
    icon: Brain,
    title: "Business Intelligence",
    desc: "KPI dashboards, workflow automation agents, and custom reports.",
  },
];

const stats = [
  { value: "10+", label: "Hours saved per week" },
  { value: "8", label: "Integrated modules" },
  { value: "99.9%", label: "Uptime guarantee" },
  { value: "24/7", label: "Platform availability" },
];

const testimonials = [
  {
    name: "Marcus T.",
    role: "Operations Manager",
    text: "Agenda AS transformed how we run our logistics. We cut manual work by 60% in the first month.",
    stars: 5,
  },
  {
    name: "Sandra K.",
    role: "Small Business Owner",
    text: "Finally, one platform that handles everything — from invoicing to employee scheduling. Worth every penny.",
    stars: 5,
  },
  {
    name: "Derek W.",
    role: "Sales Director",
    text: "The CRM pipeline view alone paid for the subscription. Our close rate jumped 35%.",
    stars: 5,
  },
];

export default function LandingPage({
  onNavigate,
  isAuthenticated,
}: LandingPageProps) {
  useEffect(() => {
    document.title =
      "Agenda Automation Station — Business Automation Software for SMEs";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Agenda Automation Station is the all-in-one business automation platform for small and medium enterprises. Manage sales, logistics, HR, finance, and operations in one place.",
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content =
        "Agenda Automation Station is the all-in-one business automation platform for small and medium enterprises. Manage sales, logistics, HR, finance, and operations in one place.";
      document.head.appendChild(meta);
    }

    // Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement("meta");
      metaKeywords.setAttribute("name", "keywords");
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute(
      "content",
      "business automation software, small business management, CRM, logistics software, HR management, financial management, business intelligence, SME software",
    );

    // Open Graph
    const ogTags: Record<string, string> = {
      "og:title": "Agenda Automation Station — Business Automation for SMEs",
      "og:description":
        "The all-in-one platform to automate sales, logistics, HR, finance, and operations.",
      "og:type": "website",
      "og:url": window.location.href,
    };
    for (const [property, content] of Object.entries(ogTags)) {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    }

    // JSON-LD
    const existingScript = document.querySelector(
      'script[type="application/ld+json"]',
    );
    if (!existingScript) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Agenda Automation Station",
        applicationCategory: "BusinessApplication",
        description:
          "All-in-one business automation platform for small and medium enterprises.",
        offers: {
          "@type": "Offer",
          price: "49",
          priceCurrency: "USD",
        },
        operatingSystem: "Web",
      });
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MarketingHeader
        onNavigate={onNavigate}
        isAuthenticated={isAuthenticated}
      />

      {/* Hero */}
      <section
        className="relative min-h-[600px] flex items-center justify-center text-white overflow-hidden"
        style={{
          backgroundImage: "url(/assets/generated/hero-bg.dim_1440x800.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-navy/80" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center py-20">
          <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/40 rounded-full px-4 py-1.5 mb-6">
            <TrendingUp className="w-4 h-4 text-gold" />
            <span className="text-gold text-sm font-medium">
              Trusted by growing businesses
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold leading-tight mb-6">
            Automate Your Business.
            <br />
            <span className="text-gold">Scale Without Limits.</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed">
            Agenda Automation Station is the all-in-one platform that replaces 8
            separate tools — CRM, logistics, HR, finance, operations, and more.
            Built for small and medium businesses ready to grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => onNavigate("/pricing")}
              className="bg-gold text-navy hover:bg-gold/90 font-bold text-base px-8 py-3 h-auto"
            >
              Get Started Today <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              onClick={() => onNavigate("/blog")}
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10 font-semibold text-base px-8 py-3 h-auto"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-navy py-10">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-display font-extrabold text-gold">
                {stat.value}
              </div>
              <div className="text-sm text-white/60 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-foreground mb-4">
              Everything Your Business Needs
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Replace fragmented tools with one powerful platform. Every module
              works together seamlessly.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-card border border-border rounded-xl p-6 hover:border-gold/50 hover:shadow-gold transition-all duration-200"
              >
                <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-display font-bold text-foreground text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              {
                icon: Clock,
                title: "Save 10+ Hours/Week",
                desc: "Automate repetitive tasks and focus on what matters — growing your business.",
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                desc: "Built on the Internet Computer blockchain for unmatched data security and uptime.",
              },
              {
                icon: TrendingUp,
                title: "Grow Revenue",
                desc: "Businesses using Agenda AS report 30%+ revenue growth within 6 months.",
              },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center">
                <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center mb-4">
                  <item.icon className="w-7 h-7 text-gold" />
                </div>
                <h3 className="font-display font-bold text-foreground text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-extrabold text-center text-foreground mb-12">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-card border border-border rounded-xl p-6"
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: star rating uses stable index
                    <Star key={i} className="w-4 h-4 text-gold fill-gold" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  "{t.text}"
                </p>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {t.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + Email Capture */}
      <section className="py-16 bg-navy text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold mb-4">
            Ready to Automate Your Business?
          </h2>
          <p className="text-white/70 text-lg mb-8">
            Join hundreds of businesses already saving time and growing revenue
            with Agenda Automation Station.
          </p>
          <Button
            onClick={() => onNavigate("/pricing")}
            className="bg-gold text-navy hover:bg-gold/90 font-bold text-base px-10 py-3 h-auto mb-10"
          >
            View Pricing & Subscribe <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-left">
            <EmailCaptureForm
              title="Not ready yet? Join our waitlist"
              subtitle="Get notified about new features, tips, and exclusive launch offers."
            />
          </div>
        </div>
      </section>

      {/* Features checklist */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-display font-extrabold text-foreground text-center mb-8">
            Everything Included in Your Subscription
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "Sales CRM & Pipeline Management",
              "Services Scheduling & Dispatch",
              "Logistics & Shipment Tracking",
              "Financial Accounting & Invoicing",
              "HR & Employee Management",
              "Operations & Task Management",
              "Business Intelligence Dashboard",
              "Inventory Management",
              "Customer & Supplier Database",
              "Workflow Automation Agents",
              "Custom Reports & Analytics",
              "Secure Cloud Storage",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-gold shrink-0" />
                <span className="text-sm text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MarketingFooter onNavigate={onNavigate} />

      {/* 24/7 AI Chat Widget */}
      <AIChatWidget />
    </div>
  );
}
