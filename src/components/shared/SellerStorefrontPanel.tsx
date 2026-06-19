import { Link2 } from "lucide-react";
import { WhatsAppIcon, TelegramIcon } from "@/components/icons/BrandIcons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShareButtons } from "@/components/shared/ShareButtons";
import { bioLink, getSellerByUsername } from "@/lib/storefront";

export function SellerStorefrontPanel({ username, telegramBot = "CheinlyBot" }: { username: string; telegramBot?: string }) {
  const seller = getSellerByUsername(username);
  const url = bioLink(username);
  const phone = seller?.phone || "2348000000000";

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-gold/5">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="font-display text-xl">Your storefront</CardTitle>
            <CardDescription>Post products via Telegram, get WhatsApp notifications, share your bio link.</CardDescription>
          </div>
          <Badge variant="outline" className="border-gold/40 text-gold">cheinly.com/u/{username}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <Button asChild className="h-auto justify-start gap-2 bg-sky-600 py-3 text-white hover:bg-sky-700">
            <a href={`https://t.me/${telegramBot}?start=post_${username}`} target="_blank" rel="noreferrer">
              <TelegramIcon size={18} /> Post Products via Telegram
            </a>
          </Button>
          <Button asChild className="h-auto justify-start gap-2 bg-emerald-600 py-3 text-white hover:bg-emerald-700">
            <a href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer">
              <WhatsAppIcon size={18} /> WhatsApp Notifications
            </a>
          </Button>
        </div>

        <div className="rounded-xl border bg-card/60 p-4">
          <p className="mb-2 flex items-center gap-2 text-sm font-medium"><Link2 className="h-4 w-4 text-primary" /> Your bio link</p>
          <div className="flex flex-wrap items-center gap-2">
            <Input readOnly value={url} className="flex-1 font-mono text-sm" />
          </div>
          <div className="mt-3">
            <ShareButtons url={url} title={`${seller?.name || "My Cheinly store"} — shop with escrow protection`} channels={["copy", "whatsapp", "telegram", "instagram"]} compact />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}