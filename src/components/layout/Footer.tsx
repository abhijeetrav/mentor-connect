import { Link } from "react-router-dom";
import { Sparkles, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    Platform: [
      { name: "Find Mentors", href: "/mentors" },
      { name: "Categories", href: "/categories" },
      { name: "Pricing", href: "/pricing" },
      { name: "How it Works", href: "/how-it-works" },
    ],
    Company: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Blog", href: "/blog" },
      { name: "Press", href: "/press" },
    ],
    Resources: [
      { name: "Help Center", href: "/help" },
      { name: "Community", href: "/community" },
      { name: "Webinars", href: "/webinars" },
      { name: "Free Resources", href: "/resources" },
    ],
    Legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
    ],
  };

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand & Contact */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl gradient-warm flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-primary-foreground">
                MentorConnect
              </span>
            </Link>
            <p className="text-primary-foreground/70 mb-6 max-w-xs">
              Connecting learners with world-class mentors for personalized 1-on-1 guidance.
            </p>
            <div className="space-y-3">
              <a href="mailto:hello@mentorconnect.com" className="flex items-center gap-3 text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <Mail className="w-5 h-5" />
                hello@mentorconnect.com
              </a>
              <a href="tel:+1234567890" className="flex items-center gap-3 text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <Phone className="w-5 h-5" />
                +1 (234) 567-890
              </a>
              <p className="flex items-center gap-3 text-primary-foreground/70">
                <MapPin className="w-5 h-5" />
                San Francisco, CA
              </p>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-primary-foreground mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/50 text-sm">
            © 2024 MentorConnect. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-primary-foreground/50 hover:text-primary-foreground transition-colors text-sm">
              Twitter
            </a>
            <a href="#" className="text-primary-foreground/50 hover:text-primary-foreground transition-colors text-sm">
              LinkedIn
            </a>
            <a href="#" className="text-primary-foreground/50 hover:text-primary-foreground transition-colors text-sm">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
