import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RiderShellProps {
  children: ReactNode;
  className?: string;
  bottomNav?: ReactNode;
  topBar?: ReactNode;
}

/**
 * Mobile-first wrapper. Locks content to a 480px column centered on the page,
 * with optional sticky top bar and bottom nav.
 */
export const RiderShell = ({ children, className, bottomNav, topBar }: RiderShellProps) => {
  return (
    <div className="min-h-screen w-full bg-muted/40">
      <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-background shadow-card">
        {topBar ? (
          <div className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
            {topBar}
          </div>
        ) : null}
        <main className={cn("flex-1", bottomNav && "pb-24", className)}>{children}</main>
        {bottomNav ? (
          <div className="sticky bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur">
            {bottomNav}
          </div>
        ) : null}
      </div>
    </div>
  );
};