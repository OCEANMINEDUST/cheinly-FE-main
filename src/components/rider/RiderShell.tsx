import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RiderShellProps {
  children: ReactNode;
  className?: string;
  bottomNav?: ReactNode;
  topBar?: ReactNode;
}

/**
 * Webview wrapper for the rider area.
 * Contains optional sticky top bar and bottom nav.
 */
export const RiderShell = ({ children, className, bottomNav, topBar }: RiderShellProps) => {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full flex-col">
        {topBar ? (
          <div className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
            <div className="mx-auto w-full max-w-7xl">{topBar}</div>
          </div>
        ) : null}
        <main className={cn("mx-auto flex-1 w-full max-w-7xl", bottomNav && "pb-24", className)}>{children}</main>
        {bottomNav ? (
          <div className="sticky bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur">
            <div className="mx-auto w-full max-w-7xl">{bottomNav}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
};