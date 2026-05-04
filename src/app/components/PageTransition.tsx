import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <div className="h-full w-full animate-in fade-in duration-200">
      {children}
    </div>
  );
}