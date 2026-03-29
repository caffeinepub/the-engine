import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSubmitWaitlistEmail } from "@/hooks/useQueries";
import { CheckCircle, Loader2, Mail } from "lucide-react";
import { useState } from "react";

interface EmailCaptureFormProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function EmailCaptureForm({
  title = "Stay in the Loop",
  subtitle = "Get notified when we launch new features and exclusive offers.",
  className = "",
}: EmailCaptureFormProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { mutate, isPending } = useSubmitWaitlistEmail();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    mutate(email.trim(), {
      onSuccess: () => {
        setSubmitted(true);
        setEmail("");
      },
    });
  };

  if (submitted) {
    return (
      <div className={`flex flex-col items-center gap-3 py-6 ${className}`}>
        <CheckCircle className="w-10 h-10 text-gold" />
        <p className="font-semibold text-foreground">You're on the list!</p>
        <p className="text-sm text-muted-foreground">
          We'll reach out with updates and exclusive offers.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-2">
        <Mail className="w-5 h-5 text-gold" />
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{subtitle}</p>
      <form onSubmit={handleSubmit} className="flex gap-2 flex-col sm:flex-row">
        <Input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={isPending}
          className="bg-gold text-navy hover:bg-gold/90 font-semibold whitespace-nowrap"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Join Waitlist"
          )}
        </Button>
      </form>
    </div>
  );
}
