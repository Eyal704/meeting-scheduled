import Link from "next/link";

import { assetPath } from "@/lib/paths";
import { ArrowUpRight, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer id="contact" className="site-footer">
      <div className="container">
        <div className="contact-grid">
          <div>
            <span className="eyebrow">LET’S BUILD WHAT’S NEXT</span>
            <h2>
              Good technology.
              <br />
              <span className="muted">Real business value.</span>
            </h2>
            <p>
              Open to AI Deployment, Deployment Strategist, Forward Deployed AI,
              GTM Engineering, AI Solutions Engineering, AI Automation and
              technical GTM roles.
            </p>
          </div>
          <div className="contact-actions">
            <a
              className="button button-primary"
              href="mailto:eyal.growth@gmail.com"
            >
              <Mail size={17} /> Get in touch <ArrowUpRight size={18} />
            </a>
            <a className="contact-email" href="mailto:eyal.growth@gmail.com">
              eyal.growth@gmail.com
            </a>
            <a className="text-link contact-phone" href="tel:+4367762921189">
              <Phone size={16} aria-hidden="true" /> +43 677 62921189
            </a>
            <a
              className="text-link"
              href="https://www.linkedin.com/in/eyalshoval/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Connect on LinkedIn <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <Link href="/" className="footer-name">
            EYAL TAIEB<span>AI Deployment & GTM Builder</span>
          </Link>
          <p>Built around the work. Measured by the outcome.</p>
          <a
            href={assetPath("/documents/eyal-taieb-cv.pdf")}
            target="_blank"
            rel="noopener noreferrer"
          >
            View CV <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
