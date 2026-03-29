import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { CheckCheck, Copy, Share2 } from "lucide-react";
import { useState } from "react";
import { SiFacebook, SiLinkedin, SiX } from "react-icons/si";

export default function ReferralSection() {
  const { identity } = useInternetIdentity();
  const [copied, setCopied] = useState(false);

  const principalId = identity?.getPrincipal().toString() || "";
  const shortRef = principalId.slice(0, 8);
  const referralUrl = `${window.location.origin}/?ref=${shortRef}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareText = encodeURIComponent(
    "I use Agenda Automation Station to run my business smarter. Check it out:",
  );

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-2">
        <Share2 className="w-5 h-5 text-gold" />
        <h3 className="font-semibold text-foreground">Refer & Grow</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Share your unique referral link and help other businesses discover the
        power of automation.
      </p>
      <div className="flex gap-2 mb-4">
        <Input
          value={referralUrl}
          readOnly
          className="flex-1 text-xs font-mono"
        />
        <Button
          onClick={handleCopy}
          variant="outline"
          size="icon"
          className="shrink-0 border-gold text-gold hover:bg-gold/10"
        >
          {copied ? (
            <CheckCheck className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Share on:</span>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-md bg-muted hover:bg-muted/80 text-foreground transition-colors"
        >
          <SiFacebook className="w-4 h-4" />
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(referralUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-md bg-muted hover:bg-muted/80 text-foreground transition-colors"
        >
          <SiX className="w-4 h-4" />
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-md bg-muted hover:bg-muted/80 text-foreground transition-colors"
        >
          <SiLinkedin className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
