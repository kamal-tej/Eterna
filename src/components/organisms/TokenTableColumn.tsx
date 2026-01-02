"use client";

import { Token, TokenColumn } from "@/types";
import { TokenRow } from "../molecules/TokenRow";
import { cn } from "@/utils/utils";
import { ChevronDown, RefreshCcw } from "lucide-react";
import { memo } from "react";

interface TokenTableColumnProps {
  title: string;
  tokens: Token[];
  type: TokenColumn;
  isLoading?: boolean;
}

export const TokenTableColumn = memo(function TokenTableColumn({ title, tokens, type, isLoading }: TokenTableColumnProps) {
  return (
    <div className="flex flex-col h-full border-r border-zinc-900 last:border-r-0 min-w-[100%] md:min-w-[320px] flex-1 snap-center">
      <div className="flex items-center justify-between p-3 border-b border-zinc-900 bg-zinc-950/50 sticky top-0 z-10 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            type === 'new' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" :
            type === 'final' ? "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" :
            "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
          )} />
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">{title}</h3>
          <span className="text-[10px] bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-500 font-mono">
            {tokens.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <RefreshCcw size={14} />
          </button>
          <button className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 hover:text-zinc-200">
            SOL <ChevronDown size={12} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {isLoading ? (
          Array.from({ length: 10 }).map((_, i) => (
            <TokenRow key={i} token={{} as Token} isLoading={true} />
          ))
        ) : tokens.length > 0 ? (
          tokens.map((token) => (
            <TokenRow key={token.id} token={token} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-zinc-600 p-8 text-center">
            <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
              <RefreshCcw size={20} className="opacity-20" />
            </div>
            <p className="text-sm font-medium">No tokens found</p>
            <p className="text-xs opacity-60">Try adjusting your filters or search</p>
          </div>
        )}
      </div>
    </div>
  );
});
