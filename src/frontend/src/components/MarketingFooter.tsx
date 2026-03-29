import { Heart, Zap } from "lucide-react";
import { SiFacebook, SiLinkedin, SiX } from "react-icons/si";

interface MarketingFooterProps {
  onNavigate: (path: string) => void;
}

export default function MarketingFooter({ onNavigate }: MarketingFooterProps) {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(
    window.location.hostname || "agenda-automation-station",
  );

  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gold rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-navy" />
              </div>
              <span className="font-display font-bold text-lg">
                Agenda<span className="text-gold">AS</span>
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              The all-in-one business automation platform for small and medium
              enterprises. Streamline operations, boost revenue, and scale with
              confidence.
            </p>
            <div className="flex gap-4 mt-5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-gold transition-colors"
              >
                <SiFacebook className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-gold transition-colors"
              >
                <SiLinkedin className="w-5 h-5" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-gold transition-colors"
              >
                <SiX className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-sm text-gold mb-4 uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Features", path: "/" },
                { label: "Pricing", path: "/pricing" },
                { label: "Blog", path: "/blog" },
              ].map((item) => (
                <li key={item.path}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.path)}
                    className="text-sm text-white/60 hover:text-gold transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm text-gold mb-4 uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <a
                  href="mailto:mntman8041@gmail.com"
                  className="hover:text-gold transition-colors"
                >
                  mntman8041@gmail.com
                </a>
              </li>
              <li className="mt-4">
                <span className="text-white/40 text-xs">PayPal Payments:</span>
                <br />
                <a
                  href="mailto:jeffbasham41@gmail.com"
                  className="hover:text-gold transition-colors text-xs"
                >
                  jeffbasham41@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs">
            © {year} Agenda Automation Station. All rights reserved.
          </p>
          <p className="text-white/40 text-xs flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-gold fill-gold" /> using{" "}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
