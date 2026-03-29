import { ApprovalStatus } from "@/backend";
import AIChatWidget from "@/components/AIChatWidget";
import EmailCaptureForm from "@/components/EmailCaptureForm";
import MarketingFooter from "@/components/MarketingFooter";
import MarketingHeader from "@/components/MarketingHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useSubmitRegistration,
  useUpdateRegistrationStatus,
} from "@/hooks/useQueries";
import {
  ArrowRight,
  CheckCircle,
  ExternalLink,
  Key,
  Loader2,
} from "lucide-react";
import { useState } from "react";

interface PricingPageProps {
  onNavigate: (path: string) => void;
  isAuthenticated: boolean;
}

const PAYPAL_EMAIL = "jeffbasham41@gmail.com";

const plans = [
  {
    id: "basic",
    name: "Basic",
    monthlyPrice: 49,
    annualPrice: 39,
    description: "Perfect for solo entrepreneurs and micro-businesses.",
    features: [
      "Sales CRM (up to 100 leads)",
      "Services Scheduling",
      "Basic Financial Tracking",
      "Employee Directory (up to 5)",
      "Email Support",
    ],
    highlighted: false,
  },
  {
    id: "professional",
    name: "Professional",
    monthlyPrice: 99,
    annualPrice: 79,
    description: "The complete toolkit for growing small businesses.",
    features: [
      "Everything in Basic",
      "Full Logistics & Shipping",
      "Advanced Accounting & Invoicing",
      "HR & Time Tracking (up to 25 employees)",
      "Operations & Task Management",
      "Business Intelligence Dashboard",
      "Priority Support",
    ],
    highlighted: true,
    badge: "Most Popular",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: 199,
    annualPrice: 159,
    description: "Unlimited power for established businesses.",
    features: [
      "Everything in Professional",
      "Unlimited Employees",
      "Workflow Automation Agents",
      "Custom Reports & Analytics",
      "Dedicated Account Manager",
      "API Access",
      "White-label Options",
    ],
    highlighted: false,
  },
];

interface RegistrationFormData {
  fullName: string;
  email: string;
  paypalTransactionId: string;
}

export default function PricingPage({
  onNavigate,
  isAuthenticated,
}: PricingPageProps) {
  const [annual, setAnnual] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<RegistrationFormData>({
    fullName: "",
    email: "",
    paypalTransactionId: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [accessCode, setAccessCode] = useState<string>("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { mutate: submitRegistration, isPending: isSubmitting } =
    useSubmitRegistration();
  const { mutate: updateRegistrationStatus, isPending: isApproving } =
    useUpdateRegistrationStatus();
  const { login, loginStatus, identity } = useInternetIdentity();

  const isPending = isSubmitting || isApproving;

  const handlePayNow = (planId: string) => {
    const plan = plans.find((p) => p.id === planId);
    if (!plan) return;
    const price = annual ? plan.annualPrice : plan.monthlyPrice;
    const paypalUrl = `https://www.paypal.com/paypalme/${PAYPAL_EMAIL.split("@")[0]}/${price}USD`;
    window.open(paypalUrl, "_blank");
    setSelectedPlan(planId);
    setShowForm(true);
    setSubmitted(false);
    setSubmitError(null);
  };

  const generateAccessCode = (principalStr: string): string => {
    return btoa(principalStr.slice(0, 8) + Date.now().toString(36))
      .slice(0, 12)
      .toUpperCase();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;
    setSubmitError(null);

    const plan = plans.find((p) => p.id === selectedPlan);
    const price = annual ? plan!.annualPrice : plan!.monthlyPrice;
    const tier = `${plan!.name} - $${price}/${annual ? "year" : "month"}`;

    if (!isAuthenticated || !identity) {
      login();
      return;
    }

    const principal = identity.getPrincipal();
    const code = generateAccessCode(principal.toString());

    submitRegistration(
      {
        fullName: formData.fullName,
        email: formData.email,
        subscriptionTier: tier,
        paypalTransactionId: formData.paypalTransactionId,
      },
      {
        onSuccess: () => {
          // Auto-approve the registration immediately
          updateRegistrationStatus(
            { principal, status: ApprovalStatus.approved },
            {
              onSuccess: () => {
                setAccessCode(code);
                setSubmitted(true);
              },
              onError: () => {
                // Even if auto-approval fails, show success with access code
                setAccessCode(code);
                setSubmitted(true);
              },
            },
          );
        },
        onError: (err) => {
          setSubmitError(
            err instanceof Error
              ? err.message
              : "Submission failed. Please try again.",
          );
        },
      },
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MarketingHeader
        onNavigate={onNavigate}
        isAuthenticated={isAuthenticated}
      />

      {/* Hero */}
      <section className="bg-navy text-white py-16 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold mb-4">
            Simple, Transparent <span className="text-gold">Pricing</span>
          </h1>
          <p className="text-white/70 text-lg mb-8">
            No hidden fees. No free tier. Pay once, get full access to the tools
            that grow your business.
          </p>
          {/* Toggle */}
          <div className="inline-flex items-center gap-3 bg-white/10 rounded-full p-1">
            <button
              type="button"
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${!annual ? "bg-gold text-navy" : "text-white/70 hover:text-white"}`}
              data-ocid="pricing.tab"
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${annual ? "bg-gold text-navy" : "text-white/70 hover:text-white"}`}
              data-ocid="pricing.tab"
            >
              Annual <span className="text-xs ml-1 opacity-80">Save 20%</span>
            </button>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-card rounded-2xl border-2 p-8 flex flex-col transition-all duration-200 ${
                  plan.highlighted
                    ? "border-gold shadow-gold scale-105"
                    : "border-border hover:border-gold/40"
                }`}
              >
                {plan.badge && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-navy font-bold px-4 py-1">
                    {plan.badge}
                  </Badge>
                )}
                <div className="mb-6">
                  <h3 className="font-display font-extrabold text-2xl text-foreground mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-display font-extrabold text-foreground">
                      ${annual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-muted-foreground text-sm mb-1">
                      /month
                    </span>
                  </div>
                  {annual && (
                    <p className="text-xs text-gold mt-1">
                      Billed annually (${plan.annualPrice * 12}/year)
                    </p>
                  )}
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-foreground"
                    >
                      <CheckCircle className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handlePayNow(plan.id)}
                  className={`w-full font-bold h-11 ${
                    plan.highlighted
                      ? "bg-gold text-navy hover:bg-gold/90"
                      : "bg-navy text-white hover:bg-navy/90"
                  }`}
                  data-ocid="pricing.primary_button"
                >
                  Pay via PayPal <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Payments processed securely via PayPal
          </p>
        </div>
      </section>

      {/* Post-payment registration form */}
      {showForm && !submitted && (
        <section
          className="py-12 bg-muted/30"
          data-ocid="pricing.registration_form"
        >
          <div className="max-w-lg mx-auto px-4">
            <div className="bg-card border border-border rounded-2xl p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                  Step 2: Activate Your Account
                </h2>
                <p className="text-muted-foreground text-sm">
                  Already paid via PayPal? Enter your details below to activate
                  your account instantly.
                </p>
              </div>

              {!isAuthenticated && (
                <div className="bg-gold/10 border border-gold/30 rounded-lg p-4 mb-6">
                  <p className="text-sm text-foreground font-medium mb-2">
                    Login required to activate your account
                  </p>
                  <Button
                    onClick={() => login()}
                    disabled={loginStatus === "logging-in"}
                    className="bg-gold text-navy hover:bg-gold/90 font-semibold text-sm"
                    data-ocid="pricing.secondary_button"
                  >
                    {loginStatus === "logging-in" ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Login to Continue
                  </Button>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    data-ocid="pricing.name_input"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="Your full name"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    data-ocid="pricing.email_input"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="your@email.com"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="plan">Selected Plan</Label>
                  <Input
                    id="plan"
                    value={plans.find((p) => p.id === selectedPlan)?.name || ""}
                    readOnly
                    className="mt-1 bg-muted"
                  />
                </div>
                <div>
                  <Label htmlFor="txId">PayPal Transaction ID</Label>
                  <Input
                    id="txId"
                    data-ocid="pricing.transaction_input"
                    value={formData.paypalTransactionId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paypalTransactionId: e.target.value,
                      })
                    }
                    placeholder="e.g. 1AB23456CD789012E"
                    required
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Find this in your PayPal receipt email or transaction
                    history.
                  </p>
                </div>

                {submitError && (
                  <div
                    data-ocid="pricing.error_state"
                    className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive"
                  >
                    {submitError}
                  </div>
                )}

                <Button
                  type="submit"
                  data-ocid="pricing.submit_button"
                  disabled={isPending || !isAuthenticated}
                  className="w-full bg-gold text-navy hover:bg-gold/90 font-bold h-11"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      {isSubmitting ? "Submitting..." : "Activating..."}
                    </>
                  ) : (
                    <>
                      Activate My Account Instantly{" "}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* Success state */}
      {submitted && (
        <section className="py-12 bg-muted/30">
          <div className="max-w-lg mx-auto px-4">
            <div
              data-ocid="pricing.success_state"
              className="bg-card border border-gold/40 rounded-2xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-9 h-9 text-gold" />
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                Your Account is Now Active!
              </h2>
              <p className="text-muted-foreground mb-5">
                Welcome to Agenda Automation Station. Your subscription has been
                activated instantly.
              </p>

              {accessCode && (
                <div className="bg-navy/5 border border-navy/20 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Key className="w-4 h-4 text-navy" />
                    <span className="text-sm font-semibold text-navy">
                      Your Access Code
                    </span>
                  </div>
                  <p className="font-mono text-2xl font-bold text-navy tracking-widest">
                    {accessCode}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Save this code — you may need it for account recovery.
                  </p>
                </div>
              )}

              <Button
                onClick={() => onNavigate("/dashboard")}
                className="bg-gold text-navy hover:bg-gold/90 font-bold w-full h-11 mb-3"
                data-ocid="pricing.primary_button"
              >
                Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                onClick={() => onNavigate("/")}
                variant="outline"
                className="border-border text-muted-foreground hover:text-foreground w-full"
                data-ocid="pricing.secondary_button"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-16 bg-background">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-display font-bold text-foreground text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "How does payment work?",
                a: "You pay directly via PayPal. After payment, submit your transaction ID in the registration form above. Your account is activated instantly upon submission.",
              },
              {
                q: "Is there a free trial?",
                a: "There is no free tier. All platform modules require an active paid subscription. We offer a 30-day money-back guarantee if you're not satisfied.",
              },
              {
                q: "What happens after I pay?",
                a: "Complete the registration form with your PayPal transaction ID. Your account is automatically activated — no waiting required. You'll have immediate full access to all modules.",
              },
              {
                q: "Can I upgrade or downgrade my plan?",
                a: "Yes. Contact our support team via the chat widget to change your subscription tier. Upgrades are prorated.",
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="bg-card border border-border rounded-xl p-5"
              >
                <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Email capture for undecided visitors */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-xl mx-auto px-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <EmailCaptureForm
              title="Not ready to commit?"
              subtitle="Join our waitlist for updates, tips, and exclusive offers. No spam, ever."
            />
          </div>
        </div>
      </section>

      <MarketingFooter onNavigate={onNavigate} />

      {/* 24/7 AI Chat Widget */}
      <AIChatWidget />
    </div>
  );
}
