import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, Sparkles, Users, UserCircle, Bell, MapPin, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import logo from "@/assets/cheinly-logo.jpeg";
import { useEffect, useState } from "react";
import { getBuyerSession, buyerDashboardUrl, type BuyerSession } from "@/lib/buyerSession";


const Index = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<BuyerSession | null>(null);
  useEffect(() => { setSession(getBuyerSession()); }, []);
  return (
    <div className="min-h-screen bg-background">
      {session && (
        <div className="bg-primary text-primary-foreground text-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-6 py-2">
            <span>Welcome back, {session.name} — this device is remembered.</span>
            <Button size="sm" variant="secondary" className="bg-card text-foreground hover:bg-card/80" onClick={() => navigate(buyerDashboardUrl(session))}>
              Continue to dashboard <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Cheinly logo" className="h-9 w-9 rounded-lg object-cover ring-1 ring-gold/40" />
            <span className="font-display text-2xl tracking-wider text-gold">CHEINLY</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a href="#platform" className="transition-colors hover:text-foreground">Features</a>
            <a href="#platform" className="transition-colors hover:text-foreground">Platform</a>
            <a href="#cta" className="transition-colors hover:text-foreground">Get started</a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="hero" size="sm">
              <Link to="/auth/signup">
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-hero">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-8 flex w-fit items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-gold">
              <Sparkles className="h-3 w-3" /> Connected intelligence
            </div>
            <h1 className="font-display text-5xl leading-[1.05] text-foreground md:text-7xl">
              The secure backbone <br />
              for the <span className="text-gold">modern enterprise</span>.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
              Cheinly unifies access, identity, and intelligence into a single elegant network — so your business moves faster, safer, and smarter.
            </p>
            
            <div className="mx-auto mt-8 max-w-lg rounded-2xl border border-gold/20 bg-gold/5 p-4 text-sm font-medium text-gold shadow-glow">
              <ShieldCheck className="mx-auto mb-2 h-6 w-6" />
              “Every payment on Cheinly is protected. Funds are held securely in escrow and only released after delivery and transaction verification.”
            </div>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild variant="hero" size="lg">
                <Link to="/buyer/browse">
                  Browse products <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-gold/40 text-gold hover:bg-gold/10 hover:text-gold">
                <Link to={session ? buyerDashboardUrl(session) : "/buyer/login"}>
                  {session ? "Continue to dashboard" : "Sign in as buyer"}
                </Link>
              </Button>
            </div>
          </div>

          {/* Decorative orb */}
          <div className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" aria-hidden />
        </div>
      </section>


      {/* Value Propositions */}
      <section id="platform" className="border-t border-border/50 bg-card/30 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-gold">Why Cheinly</p>
            <h2 className="mt-3 font-display text-4xl text-foreground md:text-5xl">
              Built for buyers and sellers who <span className="text-gold">expect more</span>.
            </h2>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Trusted Shopping",
                description: "Shop with confidence from verified sellers and trusted brands. Every transaction is designed to create a safer buying and selling experience.",
              },
              {
                icon: Users,
                title: "Social Discovery",
                description: "Discover trending products, recommendations, and opportunities through a commerce ecosystem powered by real user interactions and marketplace activity.",
              },
              {
                icon: UserCircle,
                title: "Personalized Experience",
                description: "Get product suggestions, offers, and shopping experiences tailored to your interests, preferences, and purchasing behavior.",
              },
              {
                icon: Bell,
                title: "Real-Time Engagement",
                description: "Stay connected with instant order updates, delivery tracking, notifications, and seller interactions throughout your shopping journey.",
              },
              {
                icon: MapPin,
                title: "Nationwide Reach",
                description: "Buy and sell across cities and regions with access to a growing network of merchants, customers, and logistics partners.",
              },
              {
                icon: Wrench,
                title: "Smart Commerce Tools",
                description: "Powerful tools help buyers make informed decisions and help sellers manage products, orders, inventory, and customer relationships efficiently.",
              },
            ].map(({ icon: Icon, title, description }) => (
              <Card key={title} className="group border-border/60 bg-card/60 backdrop-blur transition-all hover:border-gold/40 hover:shadow-glow">
                <CardContent className="p-7">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-gold-gradient text-gold-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-2xl text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-border/50 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { k: "10,000+", v: "Products Available" },
            { k: "5,000+", v: "Verified Sellers" },
            { k: "24/7", v: "Marketplace Access" },
            { k: "Growing Daily", v: "Active Buyers & Sellers" },
          ].map(({ k, v }) => (
            <div key={v} className="text-center">
              <div className="font-display text-5xl text-gold md:text-6xl">{k}</div>
              <div className="mt-2 text-sm uppercase tracking-[0.2em] text-muted-foreground">{v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Primary CTA after value props */}
      <section className="border-t border-border/50 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-3xl text-foreground md:text-4xl">
            Ready to start shopping?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Jump into your dashboard to browse, track orders, and pay securely with Protected Balance.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild variant="hero" size="lg">
              <Link to={session ? buyerDashboardUrl(session) : "/buyer/login"}>
                {session ? "Continue to dashboard" : "Go to buyer dashboard"} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-gold/40 text-gold hover:bg-gold/10 hover:text-gold">
              <Link to="/buyer/browse">Browse products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="relative overflow-hidden border-t border-border/50 py-28">
        <div className="absolute inset-0 -z-10 bg-hero" aria-hidden />
        <div className="mx-auto max-w-3xl px-6 text-center">
          <img src={logo} alt="" className="mx-auto mb-8 h-16 w-16 rounded-2xl object-cover ring-1 ring-gold/40 shadow-glow animate-glow-pulse" />
          <h2 className="font-display text-4xl text-foreground md:text-6xl">
            Step into your <span className="text-gold">network</span>.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            Sign in to access your Cheinly portal and bring your organization's connected intelligence to life.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild variant="hero" size="lg">
              <Link to="/auth/login">
                Sign in to portal <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-gold/40 text-gold hover:bg-gold/10 hover:text-gold">
              <Link to="/auth/forgot-password">Recover access</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-16 bg-card/20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-6">
                <img src={logo} alt="" className="h-8 w-8 rounded-md object-cover ring-1 ring-gold/30" />
                <span className="font-display tracking-wider text-gold text-lg">CHEINLY</span>
              </Link>
              <p className="text-sm text-muted-foreground max-w-sm">
                Cheinly is a secure commerce platform connecting verified sellers, buyers, and independent delivery riders through a protected transaction, escrow, and fulfillment system.
              </p>
              <div className="mt-6 text-xs text-muted-foreground">
                © {new Date().getFullYear()} Cheinly. All rights reserved.
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Legal & Terms</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link to="/policies#terms" className="hover:text-gold transition-colors">Terms of Service</Link></li>
                <li><Link to="/policies#privacy" className="hover:text-gold transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Trust & Protection</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link to="/policies#payment" className="hover:text-gold transition-colors">Escrow & Buyer Protection</Link></li>
                <li><Link to="/policies#refund" className="hover:text-gold transition-colors">Refund & Dispute Policy</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Merchant Hub</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link to="/policies#merchant" className="hover:text-gold transition-colors">Seller Guidelines</Link></li>
                <li><Link to="/auth/signup" className="hover:text-gold transition-colors">Onboarding Portal</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <h3 className="font-semibold text-foreground">Support & Safety</h3>
            <div className="flex flex-wrap gap-4 text-muted-foreground">
              <Link to="/help/contact" className="hover:text-gold transition-colors">Contact Support</Link>
              <span className="hidden sm:inline">•</span>
              <Link to="/help/agent" className="hover:text-gold transition-colors">Report Fraud / Secure Escrow Check</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
