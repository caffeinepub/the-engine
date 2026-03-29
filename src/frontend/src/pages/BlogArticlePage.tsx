import MarketingFooter from "@/components/MarketingFooter";
import MarketingHeader from "@/components/MarketingHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { useEffect } from "react";
import { blogArticles } from "./BlogListingPage";

interface BlogArticlePageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

const articleContent: Record<string, string[]> = {
  "how-automation-saves-small-businesses-10-hours-per-week": [
    "Running a small business means wearing many hats — and too often, those hats include data entry, manual scheduling, and repetitive administrative tasks that eat into your most productive hours. The good news? Business automation software can reclaim 10 or more hours per week for the average small business owner.",
    "## The Hidden Time Drain in Small Businesses",
    "Studies show that small business owners spend an average of 40% of their working hours on tasks that could be automated. That includes invoicing, appointment scheduling, inventory updates, employee time tracking, and customer follow-ups. At 40 hours per week, that's 16 hours lost to manual work.",
    "## Top Processes to Automate Right Now",
    "**1. Invoicing and Payment Reminders** — Automated invoicing software sends invoices immediately after a job is completed and follows up automatically on overdue payments. Businesses using automated invoicing report getting paid 30% faster.",
    "**2. Appointment and Service Scheduling** — Instead of back-and-forth emails, automated scheduling lets customers book directly into your calendar. Your team gets notified instantly, and reminders go out automatically.",
    "**3. Inventory Management** — Automated inventory tracking updates stock levels in real time, sends low-stock alerts, and can even trigger reorder requests. No more manual counts or surprise stockouts.",
    "**4. Employee Time Tracking** — Digital time tracking eliminates paper timesheets and manual payroll calculations. Employees clock in via app, and the system calculates hours, overtime, and pay automatically.",
    "**5. Sales Follow-Ups** — CRM automation ensures no lead falls through the cracks. Set up automated follow-up sequences that nurture prospects until they're ready to buy.",
    "## The ROI of Business Automation",
    "For a business owner billing $75/hour, saving 10 hours per week equals $750 in recovered productive time — every single week. That's $39,000 per year. Even a mid-tier automation platform paying for itself many times over.",
    "## Getting Started with Agenda Automation Station",
    "Agenda Automation Station brings all these automation capabilities into one integrated platform. From CRM and scheduling to logistics and financial management, every module works together to eliminate manual work and give you back your time.",
    "Start your subscription today and experience the difference automation makes.",
  ],
  "5-ways-to-automate-your-sales-pipeline": [
    "Your sales pipeline is the lifeblood of your business. But managing it manually — tracking leads in spreadsheets, sending follow-up emails one by one, updating deal stages by hand — is a recipe for missed opportunities and burnout. Here are five proven ways to automate your sales pipeline and close more deals.",
    "## 1. Automated Lead Capture and Scoring",
    "Every time a prospect fills out a form, visits your pricing page, or engages with your content, your CRM should automatically capture that lead and score them based on their behavior. High-scoring leads get prioritized for immediate follow-up; lower-scoring leads enter nurture sequences.",
    "## 2. Automated Follow-Up Sequences",
    "The average sale requires 5–8 touchpoints, but most salespeople give up after 2. Automated follow-up sequences ensure every lead receives consistent, timely communication without manual effort. Set up email sequences that trigger based on lead behavior — opened an email? Send a follow-up. Visited the pricing page? Trigger a personalized outreach.",
    "## 3. Pipeline Stage Automation",
    "When a lead takes a specific action — books a demo, signs a proposal, makes a payment — your CRM should automatically move them to the next pipeline stage and notify the relevant team member. This eliminates manual updates and ensures nothing slips through the cracks.",
    "## 4. Automated Quote Generation",
    "Instead of manually creating quotes in Word or Excel, use your CRM to generate professional quotes automatically based on the products or services selected. Quotes can be sent directly from the platform and tracked for opens and acceptance.",
    "## 5. Reporting and Forecasting Automation",
    "Manual sales reporting takes hours. Automated reporting gives you real-time visibility into pipeline value, close rates, average deal size, and revenue forecasts — without lifting a finger. Use these insights to coach your team and allocate resources effectively.",
    "## The Bottom Line",
    "Businesses that automate their sales pipeline close 30–50% more deals with the same team size. The key is choosing a CRM that integrates with your other business systems — so your sales data flows seamlessly into finance, operations, and customer service.",
    "Agenda Automation Station's Sales CRM module includes all five of these automation capabilities, fully integrated with the rest of your business operations.",
  ],
  "ultimate-guide-to-business-process-automation": [
    "Business process automation (BPA) is no longer just for large enterprises. Thanks to modern cloud-based platforms, small and medium businesses can now automate the same processes that Fortune 500 companies use to stay competitive. This guide covers everything you need to know.",
    "## What Is Business Process Automation?",
    "Business process automation uses technology to perform repetitive tasks or processes in a business where manual effort can be replaced. It's different from simple task automation — BPA focuses on end-to-end processes that span multiple departments and systems.",
    "## The 6 Core Areas of Business Automation",
    "**Sales & CRM** — Lead management, pipeline tracking, quote generation, and customer communication automation.",
    "**Operations & Scheduling** — Service dispatch, appointment booking, task assignment, and project management.",
    "**Logistics & Supply Chain** — Shipment tracking, inventory management, supplier ordering, and route optimization.",
    "**Financial Management** — Invoicing, expense tracking, payroll, tax preparation, and financial reporting.",
    "**Human Resources** — Employee onboarding, time tracking, performance reviews, and compliance management.",
    "**Business Intelligence** — KPI dashboards, automated reports, trend analysis, and forecasting.",
    "## How to Start Your Automation Journey",
    "**Step 1: Audit Your Current Processes** — Document every repetitive task your team performs. Note how long each takes and how often it occurs.",
    "**Step 2: Prioritize by Impact** — Focus first on processes that are high-frequency, time-consuming, or error-prone. These offer the highest ROI.",
    "**Step 3: Choose an Integrated Platform** — Avoid point solutions that create data silos. Choose a platform like Agenda Automation Station that handles all your business functions in one place.",
    "**Step 4: Train Your Team** — Automation only works if your team uses it. Invest in proper onboarding and training.",
    "**Step 5: Measure and Optimize** — Track time saved, error rates, and revenue impact. Use this data to continuously improve your automation strategy.",
    "## Common Mistakes to Avoid",
    "Don't automate broken processes — fix them first. Don't ignore change management — bring your team along. Don't over-automate customer interactions — keep the human touch where it matters.",
    "## The Competitive Advantage of Automation",
    "Businesses that embrace automation grow 2–3x faster than those that don't. They operate with leaner teams, make fewer errors, and can scale without proportional cost increases. In today's competitive landscape, automation isn't optional — it's essential.",
  ],
  "logistics-automation-reduce-shipping-costs": [
    "Shipping costs are one of the largest variable expenses for product-based businesses. But with the right logistics automation tools, you can reduce those costs by 25% or more while actually improving delivery times and customer satisfaction.",
    "## Why Logistics Costs Are Out of Control",
    "Manual logistics management leads to inefficient routes, missed carrier discounts, inventory errors, and delayed shipments. Each of these problems has a direct cost — and they compound over time.",
    "## 5 Ways Logistics Automation Cuts Costs",
    "**1. Route Optimization** — Automated route planning calculates the most efficient delivery routes in real time, accounting for traffic, distance, and delivery windows. This alone can reduce fuel costs by 15–20%.",
    "**2. Carrier Rate Shopping** — Automated systems compare rates across multiple carriers for every shipment and select the best option based on cost, speed, and reliability.",
    "**3. Inventory Optimization** — Automated inventory management prevents both overstocking (which ties up capital) and stockouts (which lose sales). Smart reorder points ensure you always have the right amount of stock.",
    "**4. Automated Tracking and Notifications** — Real-time shipment tracking reduces customer service calls about order status by up to 40%. Automated notifications keep customers informed without manual effort.",
    "**5. Returns Management** — Automated returns processing reduces the cost and complexity of handling returns, improving customer satisfaction while minimizing losses.",
    "## Implementing Logistics Automation",
    "The key to successful logistics automation is integration. Your shipping system needs to connect with your inventory management, order management, and financial systems. Siloed logistics software creates as many problems as it solves.",
    "Agenda Automation Station's Logistics module provides end-to-end visibility and automation across your entire supply chain, fully integrated with inventory, finance, and customer management.",
  ],
  "financial-management-software-small-business": [
    "If you're still managing your business finances with spreadsheets or basic accounting software, you're leaving money on the table — and spending far too much time on bookkeeping. Here's why automated financial management software is essential for every small business.",
    "## The True Cost of Manual Bookkeeping",
    "The average small business owner spends 10 hours per month on bookkeeping. At $75/hour, that's $750/month or $9,000/year in lost productive time. Add in the cost of errors — missed deductions, late payment penalties, incorrect invoices — and the true cost is even higher.",
    "## What Automated Financial Management Does",
    "**Automated Invoicing** — Generate and send professional invoices instantly. Automated payment reminders reduce late payments by 30%.",
    "**Expense Tracking** — Categorize expenses automatically, capture receipts digitally, and reconcile accounts without manual data entry.",
    "**Double-Entry Accounting** — Maintain accurate books with automated journal entries that ensure every transaction is properly recorded.",
    "**Tax Preparation** — Automated tax categorization and reporting makes tax season a breeze instead of a nightmare.",
    "**Cash Flow Forecasting** — Real-time visibility into your cash position and automated forecasting helps you make better financial decisions.",
    "**Financial Reporting** — Generate profit & loss statements, balance sheets, and cash flow reports in seconds, not hours.",
    "## The ROI of Financial Automation",
    "Businesses using automated financial management software report saving an average of 8 hours per month on bookkeeping, reducing invoice payment times by 30%, and catching 50% more deductible expenses. The software typically pays for itself within the first month.",
    "## Integration Is Key",
    "Financial management software is most powerful when it's integrated with your other business systems. When your CRM, logistics, and HR systems all feed data into your financial platform automatically, you get a complete picture of your business health in real time.",
    "Agenda Automation Station's Financial Management module provides all of these capabilities, fully integrated with every other aspect of your business operations.",
  ],
};

export default function BlogArticlePage({
  slug,
  onNavigate,
}: BlogArticlePageProps) {
  const article = blogArticles.find((a) => a.slug === slug);

  useEffect(() => {
    if (article) {
      document.title = `${article.title} | Agenda AS Blog`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", article.excerpt);
      }
    }
  }, [article]);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <MarketingHeader onNavigate={onNavigate} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Article Not Found
            </h1>
            <Button
              onClick={() => onNavigate("/blog")}
              className="bg-gold text-navy hover:bg-gold/90"
            >
              Back to Blog
            </Button>
          </div>
        </div>
        <MarketingFooter onNavigate={onNavigate} />
      </div>
    );
  }

  const content = articleContent[slug] || [];

  const renderContent = (text: string, index: number) => {
    if (text.startsWith("## ")) {
      return (
        <h2
          key={index}
          className="text-xl font-display font-bold text-foreground mt-8 mb-3"
        >
          {text.replace("## ", "")}
        </h2>
      );
    }
    if (text.startsWith("**") && text.includes("**")) {
      const parts = text.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={index} className="text-foreground/80 leading-relaxed mb-4">
          {parts.map((part, i) =>
            i % 2 === 1 ? (
              // biome-ignore lint/suspicious/noArrayIndexKey: inline bold splits use stable index
              <strong key={i} className="text-foreground font-semibold">
                {part}
              </strong>
            ) : (
              part
            ),
          )}
        </p>
      );
    }
    return (
      <p key={index} className="text-foreground/80 leading-relaxed mb-4">
        {text}
      </p>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MarketingHeader onNavigate={onNavigate} />

      {/* Article Header */}
      <section className="bg-navy text-white py-14">
        <div className="max-w-3xl mx-auto px-4">
          <Button
            onClick={() => onNavigate("/blog")}
            variant="ghost"
            className="text-white/60 hover:text-white hover:bg-white/10 mb-6 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
          </Button>
          <div className="mb-4">
            <span className="text-xs font-semibold bg-gold/20 text-gold px-3 py-1 rounded-full">
              {article.category}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold leading-tight mb-4">
            {article.title}
          </h1>
          <p className="text-white/70 text-lg mb-6">{article.excerpt}</p>
          <div className="flex items-center gap-4 text-sm text-white/50">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" /> Agenda AS Team
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> {article.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> {article.readTime}
            </span>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="prose-custom">
            {content.map((paragraph, index) => renderContent(paragraph, index))}
          </div>

          {/* CTA */}
          <div className="mt-12 bg-navy text-white rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-display font-bold mb-3">
              Ready to Automate Your Business?
            </h3>
            <p className="text-white/70 mb-6">
              Start your Agenda Automation Station subscription today and see
              the difference in your first week.
            </p>
            <Button
              onClick={() => onNavigate("/pricing")}
              className="bg-gold text-navy hover:bg-gold/90 font-bold px-8"
            >
              View Pricing Plans
            </Button>
          </div>

          {/* Related articles */}
          <div className="mt-10">
            <h3 className="font-display font-bold text-foreground text-lg mb-4">
              More Articles
            </h3>
            <div className="space-y-3">
              {blogArticles
                .filter((a) => a.slug !== slug)
                .slice(0, 3)
                .map((related) => (
                  <button
                    type="button"
                    key={related.slug}
                    onClick={() => onNavigate(`/blog/${related.slug}`)}
                    className="w-full text-left bg-card border border-border rounded-lg p-4 hover:border-gold/50 transition-colors"
                  >
                    <p className="font-semibold text-foreground text-sm">
                      {related.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {related.readTime} · {related.date}
                    </p>
                  </button>
                ))}
            </div>
          </div>
        </div>
      </article>

      <MarketingFooter onNavigate={onNavigate} />
    </div>
  );
}
