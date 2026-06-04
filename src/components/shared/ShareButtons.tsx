import { useState } from "react";
import { Copy, Check, Share2, MessageCircle, Send, Instagram, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

type Props = {
  url: string;
  title?: string;
  channels?: Array<"whatsapp" | "telegram" | "instagram" | "tiktok" | "copy" | "native">;
  compact?: boolean;
};

const defaultChannels: Props["channels"] = ["copy", "whatsapp", "telegram", "instagram", "tiktok"];

export function ShareButtons({ url, title = "Check this out on Cheinly", channels = defaultChannels, compact }: Props) {
  const [copied, setCopied] = useState(false);
  const text = `${title}\n${url}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({ title: "Link copied", description: url });
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast({ title: "Copy failed", description: "Please copy manually." });
    }
  };

  const native = async () => {
    if (navigator.share) {
      try { await navigator.share({ title, text: title, url }); } catch {}
    } else copy();
  };

  const Btn = ({ children, onClick, label, href }: any) =>
    href ? (
      <Button asChild variant="outline" size={compact ? "sm" : "default"} className="gap-2">
        <a href={href} target="_blank" rel="noreferrer" aria-label={label}>{children}</a>
      </Button>
    ) : (
      <Button variant="outline" size={compact ? "sm" : "default"} onClick={onClick} className="gap-2" aria-label={label}>
        {children}
      </Button>
    );

  return (
    <div className="flex flex-wrap gap-2">
      {channels?.includes("copy") && (
        <Btn onClick={copy} label="Copy link">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}<span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span></Btn>
      )}
      {channels?.includes("whatsapp") && (
        <Btn label="Share on WhatsApp" href={`https://wa.me/?text=${encodeURIComponent(text)}`}><MessageCircle className="h-4 w-4 text-emerald-600" /><span className="hidden sm:inline">WhatsApp</span></Btn>
      )}
      {channels?.includes("telegram") && (
        <Btn label="Share on Telegram" href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}><Send className="h-4 w-4 text-sky-600" /><span className="hidden sm:inline">Telegram</span></Btn>
      )}
      {channels?.includes("instagram") && (
        <Btn label="Copy link for Instagram" onClick={copy}><Instagram className="h-4 w-4" /><span className="hidden sm:inline">Instagram</span></Btn>
      )}
      {channels?.includes("tiktok") && (
        <Btn label="Copy link for TikTok" onClick={copy}><Music2 className="h-4 w-4" /><span className="hidden sm:inline">TikTok</span></Btn>
      )}
      {channels?.includes("native") && (
        <Btn onClick={native} label="Share"><Share2 className="h-4 w-4" /><span className="hidden sm:inline">Share</span></Btn>
      )}
    </div>
  );
}