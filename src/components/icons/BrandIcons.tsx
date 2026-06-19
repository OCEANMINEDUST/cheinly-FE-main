import whatsappUrl from "@/assets/icons/whatsapp.svg";
import telegramUrl from "@/assets/icons/telegram.svg";
import { cn } from "@/lib/utils";

type IconProps = { className?: string; size?: number; title?: string };

export const WhatsAppIcon = ({ className, size = 18, title = "WhatsApp" }: IconProps) => (
  <img src={whatsappUrl} alt={title} width={size} height={size} className={cn("inline-block", className)} loading="lazy" />
);

export const TelegramIcon = ({ className, size = 18, title = "Telegram" }: IconProps) => (
  <img src={telegramUrl} alt={title} width={size} height={size} className={cn("inline-block", className)} loading="lazy" />
);