"use client";

import { cn } from "@/utils/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-zinc-800 text-zinc-300',
    success: 'bg-green-500/10 text-green-500 border border-green-500/20 shadow-[0_0_8px_rgba(34,197,94,0.1)]',
    warning: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 shadow-[0_0_8px_rgba(234,179,8,0.1)]',
    danger: 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-[0_0_8px_rgba(239,68,68,0.1)]',
    info: 'bg-blue-500/10 text-blue-500 border border-blue-500/20 shadow-[0_0_8px_rgba(59,130,246,0.1)]',
    purple: 'bg-purple-500/10 text-purple-500 border border-purple-500/20 shadow-[0_0_8px_rgba(168,85,247,0.1)]',
  };

  return (
    <span className={cn(
      "px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
