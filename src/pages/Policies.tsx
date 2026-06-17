import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Shield, FileText, Lock, RefreshCw, ShoppingBag, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const sections = [
  { id: "terms", title: "1. TERMS OF SERVICE", icon: FileText },
  { id: "payment", title: "2. PAYMENT, ESCROW & BUYER PROTECTION POLICY", icon: Shield },
  { id: "merchant", title: "3. MERCHANT HUB & SELLER POLICY", icon: ShoppingBag },
  { id: "refund", title: "4. REFUND & DISPUTE RESOLUTION POLICY", icon: RefreshCw },
  { id: "privacy", title: "5. PRIVACY & DATA SECURITY POLICY", icon: Lock },
];

const Policies = () => {
  const { hash } = useLocation();
  const [activeSection, setActiveSection] = useState("terms");

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        setActiveSection(id);
      }
    }
  }, [hash]);

  useEffect(() => {
    const handleScroll = () => {
      let current = sections[0].id;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) {
            current = section.id;
          }
        }
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-4">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-display text-xl tracking-wider text-gold">CHEINLY POLICIES</h1>
        </div>
      </header>

      <div className="mx-auto mt-10 max-w-7xl px-6 lg:flex lg:gap-12">
        <aside className="hidden lg:block lg:w-1/4">
          <div className="sticky top-24 space-y-2">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contents</h2>
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  activeSection === s.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <s.icon className="h-4 w-4" />
                {s.title}
              </a>
            ))}
          </div>
        </aside>

        <main className="flex-1 space-y-16 prose prose-gray dark:prose-invert max-w-3xl">
          <div>
            <h1 className="font-display text-4xl mb-2">Cheinly Public Website Policies & Trust Architecture</h1>
            <p className="text-muted-foreground text-sm uppercase tracking-widest">Effective Date: June 17, 2026</p>
          </div>

          <section id="terms" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold flex items-center gap-2"><FileText className="h-6 w-6 text-gold"/> 1. TERMS OF SERVICE</h2>
            <p><strong>Welcome to Cheinly.</strong></p>
            <p>
              Cheinly is a secure commerce platform that connects verified sellers, buyers, and independent delivery riders through a protected transaction, escrow, and fulfillment system. By creating an account, accessing, or using Cheinly, you agree to comply with and be bound by these Terms of Service.
            </p>

            <h3>Platform Usage & Account Security</h3>
            <p>By using Cheinly, you agree to:</p>
            <ul>
              <li>Provide accurate, current, and complete account information during registration.</li>
              <li>Maintain the absolute security of your login credentials and wallet access. You are solely responsible for all activities, transactions, and liabilities that occur under your account.</li>
              <li>Use the platform exclusively for lawful activities and genuine commercial transactions.</li>
              <li>Complete all transactions, communications, and settlements exclusively through official Cheinly communication and payment channels.</li>
              <li>Treat all buyers, merchants, delivery riders, and platform representatives with professional respect.</li>
            </ul>

            <h3>Logistics & The Delivery Loop</h3>
            <ul>
              <li><strong>Independent Relationship:</strong> Delivery riders operate as independent logistics providers. Cheinly provides the coordination software but does not directly employ riders or own delivery vehicles.</li>
              <li><strong>Transfer of Risk:</strong> Risk of loss or damage transfers to the rider upon collection from the merchant, and transfers to the buyer only upon formal transaction confirmation and verification at the delivery point.</li>
              <li><strong>Fulfillment Compliance:</strong> All platform users agree to accurately update fulfillment milestones (e.g., "Package Picked Up", "Arrived at Destination") within the app to ensure system accuracy and timely escrow release.</li>
            </ul>

            <h3>Prohibited Activities & Anti-Circumvention</h3>
            <p>Users strictly agree they will not:</p>
            <ul>
              <li>Attempt, facilitate, or orchestrate fraudulent transactions or false dispute claims.</li>
              <li>Use false identities, spoofed accounts, or unverified business details.</li>
              <li><strong>Off-Platform Solicitation:</strong> Solicit, invite, or encourage other Cheinly users to transact outside the platform to avoid transaction fees or verification loops.</li>
              <li>Misrepresent products, alter delivery coordinates maliciously, or manipulate the platform rating system.</li>
              <li>Attempt unauthorized access, reverse-engineer, or disrupt Cheinly’s backend infrastructure or security frameworks.</li>
            </ul>

            <h3>Enforcement & Balances</h3>
            <p>
              Cheinly reserves the right, in its sole discretion, to suspend or permanently terminate accounts violating these terms. Any attempt to circumvent the platform’s escrow system will result in immediate termination, loss of platform privileges, and the absolute forfeiture of any pending or unwithdrawn balances.
            </p>
          </section>

          <hr className="border-border/50" />

          <section id="payment" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold flex items-center gap-2"><Shield className="h-6 w-6 text-gold"/> 2. PAYMENT, ESCROW & BUYER PROTECTION POLICY</h2>
            <p>
              At Cheinly, every transaction is structurally protected. We eliminate marketplace fraud by acting as a trusted intermediary between buyers and sellers.
            </p>

            <h3>How the Payment Protection Cycle Works</h3>
            <ol>
              <li><strong>Secure Deposit:</strong> When a buyer makes a purchase, the payment is securely processed and received by Cheinly.</li>
              <li><strong>Escrow Hold:</strong> Funds are securely held in a centralized, protected Cheinly account. They are never sent directly to the seller at the point of purchase.</li>
              <li><strong>Fulfillment Dispatch:</strong> The seller prepares the order, and an integrated rider coordinates the secure transport.</li>
              <li><strong>Verification & Delivery:</strong> The package arrives at the buyer's destination, and fulfillment is verified.</li>
              <li><strong>Escrow Release:</strong> Upon formal verification and transaction confirmation, funds are automatically unlocked and credited to the seller’s balance.</li>
            </ol>

            <h3>Mandatory Protection Rules</h3>
            <ul>
              <li><strong>No Direct Settlements:</strong> Buyers must never pay sellers or riders directly via cash, private bank transfers, or external digital wallets. Payments made outside of Cheinly are strictly unprotected, violate platform terms, and remove all transaction insurance.</li>
              <li><strong>Fraud Mitigation Pauses:</strong> Cheinly retains the explicit right to pause, freeze, or reverse the release of escrowed funds if suspicious patterns, delivery anomalies, or potential fraud are detected.</li>
            </ul>
          </section>

          <hr className="border-border/50" />

          <section id="merchant" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold flex items-center gap-2"><ShoppingBag className="h-6 w-6 text-gold"/> 3. MERCHANT HUB & SELLER POLICY</h2>
            <p>
              Cheinly allows verified merchants to market, sell, and fulfill products through our managed marketplace ecosystem.
            </p>

            <h3>Merchant Verification Requirements</h3>
            <p>To list products and accept payments on Cheinly, you must provide:</p>
            <ul>
              <li>Valid, government-issued identification.</li>
              <li>A verified operational phone number.</li>
              <li>A verified, matching bank account or financial settlement routing details.</li>
              <li>Completely accurate product descriptions, specifications, and pricing.</li>
              <li>Genuine, unedited images representing the actual state of the inventory.</li>
            </ul>

            <h3>Deferred Onboarding Compliance</h3>
            <p>To streamline platform engagement, Cheinly permits buyers to invite unregistered sellers to fulfill orders.</p>
            <ul>
              <li>Unboarded sellers may accept orders and view pending escrow balances accumulated from sales.</li>
              <li><strong>The Payout Threshold:</strong> However, sellers must fully complete identity verification, bank account routing, and compliance screening prior to executing their first fund withdrawal or payout. No funds will leave the Cheinly ecosystem to unverified entities.</li>
            </ul>

            <h3>Seller Responsibilities</h3>
            <p>Sellers must:</p>
            <ul>
              <li>Prepare and hand over products to delivery riders within agreed, platform-tracked timelines.</li>
              <li>Maintain rigorous quality control standards—counterfeit, defective, or highly misrepresented goods are strictly banned.</li>
              <li>Keep digital inventory counts and availability accurate to avoid cancellation penalties.</li>
              <li>Respond to customer support and fulfillment verification requests promptly.</li>
            </ul>
          </section>

          <hr className="border-border/50" />

          <section id="refund" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold flex items-center gap-2"><RefreshCw className="h-6 w-6 text-gold"/> 4. REFUND & DISPUTE RESOLUTION POLICY</h2>
            <p>
              We are fully committed to ensuring fair, data-backed resolutions for every participant in the marketplace ecosystem.
            </p>

            <h3>Refund Eligibility Criteria</h3>
            <p>A buyer is eligible to initiate a dispute or request a refund under the following conditions:</p>
            <ul>
              <li>The wrong product altogether was delivered.</li>
              <li>The product differs significantly from the online listing description, dimensions, or specifications.</li>
              <li>The product arrives broken, structurally damaged, or materially degraded.</li>
              <li>The seller or rider fails to fulfill a confirmed order entirely.</li>
            </ul>

            <h3>The 48-Hour Dispute Window</h3>
            <ul>
              <li><strong>Strict Timeline:</strong> To protect against post-delivery damage or merchant exploitation, complaints and refund requests must be submitted through official platform channels within <strong>48 hours of recorded delivery</strong>.</li>
              <li>If no dispute is lodged within this 48-hour window, the transaction is legally deemed accepted, escrow funds are permanently released to the seller, and no further refund claims can be processed by the platform.</li>
            </ul>

            <h3>Investigation & Binding Arbitration</h3>
            <p>When a dispute is raised, Cheinly opens an internal investigation, assessing:</p>
            <ul>
              <li>Platform payment records and metadata.</li>
              <li>Rider tracking, location flags, and delivery confirmation logs.</li>
              <li>Original product listings, image metadata, and chat history.</li>
              <li>Physical evidence or photo documentation submitted by the buyer.</li>
            </ul>
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 my-6">
              <strong className="text-primary font-display block mb-2">Final Decision Clause:</strong>
              Cheinly acts as the final, binding arbitrator in all platform disputes. By participating in the marketplace, both buyers and sellers explicitly agree to waive external claims and accept Cheinly’s internal dispute resolution and escrow distribution decisions as final.
            </div>
          </section>

          <hr className="border-border/50" />

          <section id="privacy" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold flex items-center gap-2"><Lock className="h-6 w-6 text-gold"/> 5. PRIVACY & DATA SECURITY POLICY</h2>
            <p>
              Your privacy is fundamental to maintaining a trusted ecosystem. Cheinly collects and processes data strictly required to guarantee secure marketplace operations.
            </p>

            <h3>Data We Collect</h3>
            <ul>
              <li><strong>Profile Data:</strong> Name, email address, phone numbers, and delivery/physical coordinates.</li>
              <li><strong>Financial Data:</strong> Encrypted payment processing details, transactional records, and wallet history.</li>
              <li><strong>Verification Data:</strong> Government IDs, corporate registry files, and banking verification documents required for seller onboarding and fraud prevention.</li>
            </ul>

            <h3>How We Utilize Data</h3>
            <p>We use information strictly for:</p>
            <ul>
              <li>Secure payment processing and escrow tracking.</li>
              <li>Seamless order routing and real-time rider logistics.</li>
              <li>Rigorous fraud prevention, anti-money laundering compliance, and system monitoring.</li>
              <li>Providing responsive, data-backed customer support.</li>
            </ul>

            <h3>Institutional Data Protection</h3>
            <ul>
              <li><strong>End-to-End Encryption:</strong> Sensitive payment and personal verification data are heavily encrypted both in transit and at rest.</li>
              <li><strong>Access Control:</strong> Access to verification documents is strictly compartmentalized and restricted to authorized security and compliance personnel.</li>
              <li><strong>Zero Monetization:</strong> Cheinly does not sell, lease, trade, or share your personal data with third-party advertising networks or external data brokers under any circumstances.</li>
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Policies;
