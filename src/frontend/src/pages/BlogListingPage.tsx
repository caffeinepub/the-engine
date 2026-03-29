import MarketingFooter from "@/components/MarketingFooter";
import MarketingHeader from "@/components/MarketingHeader";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { useEffect } from "react";

interface BlogListingPageProps {
  onNavigate: (path: string) => void;
}

export const blogArticles = [
  {
    slug: "how-automation-saves-small-businesses-10-hours-per-week",
    title: "How Automation Saves Small Businesses 10+ Hours Per Week",
    excerpt:
      "Discover the top business processes that small business owners are automating to reclaim their time and focus on growth.",
    date: "February 15, 2026",
    readTime: "6 min read",
    category: "Productivity",
    keywords:
      "business automation, small business productivity, time management, workflow automation",
  },
  {
    slug: "5-ways-to-automate-your-sales-pipeline",
    title: "5 Ways to Automate Your Sales Pipeline and Close More Deals",
    excerpt:
      "Learn how CRM automation, lead scoring, and follow-up sequences can dramatically increase your close rate without extra effort.",
    date: "January 28, 2026",
    readTime: "8 min read",
    category: "Sales",
    keywords:
      "sales automation, CRM software, pipeline management, lead generation, close rate",
  },
  {
    slug: "ultimate-guide-to-business-process-automation",
    title: "The Ultimate Guide to Business Process Automation for SMEs",
    excerpt:
      "A comprehensive guide covering everything small and medium enterprises need to know about automating operations, finance, HR, and logistics.",
    date: "January 10, 2026",
    readTime: "12 min read",
    category: "Strategy",
    keywords:
      "business process automation, SME software, operations management, digital transformation",
  },
  {
    slug: "logistics-automation-reduce-shipping-costs",
    title: "Logistics Automation: How to Reduce Shipping Costs by 25%",
    excerpt:
      "Route optimization, automated tracking, and smart inventory management can slash your logistics costs while improving delivery times.",
    date: "December 20, 2025",
    readTime: "7 min read",
    category: "Logistics",
    keywords:
      "logistics automation, shipping software, route optimization, inventory management, supply chain",
  },
  {
    slug: "financial-management-software-small-business",
    title: "Why Every Small Business Needs Automated Financial Management",
    excerpt:
      "Manual bookkeeping is costing you more than you think. Here's how automated financial management software pays for itself.",
    date: "December 5, 2025",
    readTime: "5 min read",
    category: "Finance",
    keywords:
      "financial management software, accounting automation, small business finance, invoicing software",
  },
];

export default function BlogListingPage({ onNavigate }: BlogListingPageProps) {
  useEffect(() => {
    document.title = "Blog — Business Automation Tips & Strategies | Agenda AS";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Expert tips, strategies, and guides on business automation, CRM, logistics, HR, and financial management for small and medium businesses.",
      );
    }
  }, []);

  const categoryColors: Record<string, string> = {
    Productivity: "bg-gold/10 text-gold",
    Sales: "bg-green-100 text-green-700",
    Strategy: "bg-blue-100 text-blue-700",
    Logistics: "bg-orange-100 text-orange-700",
    Finance: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MarketingHeader onNavigate={onNavigate} />

      {/* Hero */}
      <section className="bg-navy text-white py-14 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold mb-4">
            Business Automation <span className="text-gold">Blog</span>
          </h1>
          <p className="text-white/70 text-lg">
            Expert insights, strategies, and guides to help you automate and
            grow your business.
          </p>
        </div>
      </section>

      {/* Articles */}
      <section className="py-16 bg-background flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogArticles.map((article) => (
              <article
                key={article.slug}
                className="bg-card border border-border rounded-xl overflow-hidden hover:border-gold/50 hover:shadow-gold transition-all duration-200 flex flex-col"
              >
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[article.category] || "bg-muted text-muted-foreground"}`}
                    >
                      {article.category}
                    </span>
                  </div>
                  <h2 className="font-display font-bold text-foreground text-lg mb-2 leading-snug">
                    {article.title}
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-4">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {article.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {article.readTime}
                      </span>
                    </div>
                    <Button
                      onClick={() => onNavigate(`/blog/${article.slug}`)}
                      variant="ghost"
                      size="sm"
                      className="text-gold hover:text-gold hover:bg-gold/10 font-semibold text-xs"
                    >
                      Read More <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <MarketingFooter onNavigate={onNavigate} />
    </div>
  );
}
