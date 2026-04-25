import { Home, Clock, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const items = [
  { to: "/rider/dashboard", icon: Home, label: "Home" },
  { to: "/rider/history", icon: Clock, label: "History" },
  { to: "/rider/profile", icon: User, label: "Profile" },
];

export const RiderBottomNav = () => (
  <nav className="grid grid-cols-3 px-2 py-2">
    {items.map(({ to, icon: Icon, label }) => (
      <NavLink
        key={to}
        to={to}
        end
        className={({ isActive }) =>
          cn(
            "flex flex-col items-center gap-1 rounded-lg py-2 text-[11px] font-medium transition-colors",
            isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
          )
        }
      >
        {({ isActive }) => (
          <>
            <Icon className={cn("h-5 w-5", isActive && "stroke-[2.5]")} />
            <span>{label}</span>
          </>
        )}
      </NavLink>
    ))}
  </nav>
);