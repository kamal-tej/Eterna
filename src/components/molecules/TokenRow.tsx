"use client";

import { Token } from "@/types";
import { formatNumber, formatPrice, cn } from "@/utils/utils";
import { useEffect, useState, memo } from "react";
import { motion } from "framer-motion";
import { Badge } from "../atoms/Badge";
import { Skeleton } from "../atoms/Skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "../atoms/Tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "../atoms/Popover";
import { ShieldCheck, Zap, ExternalLink, TrendingUp, ShoppingCart, Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, toggleWatchlist } from "@/store/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../atoms/Dialog";

interface TokenRowProps {
  token: Token;
  isLoading?: boolean;
}

export const TokenRow = memo(function TokenRow({ token, isLoading }: TokenRowProps) {
  const dispatch = useDispatch();
  const watchlist = useSelector((state: RootState) => state.trade.watchlist);
  const isWatchlisted = watchlist.includes(token.id);

  const [priceColor, setPriceColor] = useState<string>("text-white");
  const [prevPrice, setPrevPrice] = useState(token.price);

  useEffect(() => {
    if (!isLoading && token.price !== prevPrice) {
      setPriceColor(token.price > prevPrice ? "text-green-400" : "text-red-400");
      setPrevPrice(token.price);
    }
  }, [token.price, prevPrice, isLoading]);

  useEffect(() => {
    if (priceColor !== "text-white") {
      const timeout = setTimeout(() => setPriceColor("text-white"), 1000);
      return () => clearTimeout(timeout);
    }
  }, [priceColor]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-[1fr_auto_auto] md:grid-cols-[2fr_1fr_1fr_1fr] items-center gap-4 p-2.5 border-b border-zinc-900/50">
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-4 rounded-sm" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-3 w-8" />
          </div>
        </div>
        <div className="flex flex-col items-end md:items-start gap-1">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-3 w-10" />
        </div>
        <div className="hidden md:flex flex-col items-end gap-1">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-3 w-8" />
        </div>
        <div className="hidden md:flex flex-col items-end gap-1">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-3 w-8" />
        </div>
      </div>
    );
  }

  const handleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleWatchlist(token.id));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-[1fr_auto_auto] md:grid-cols-[2fr_1fr_1fr_1fr] items-center gap-4 p-2.5 hover:bg-zinc-900/40 transition-colors cursor-pointer border-b border-zinc-900/50 group relative"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <button 
              onClick={handleWatchlist}
              className={cn(
                "flex-shrink-0 transition-colors hover:text-yellow-500",
                isWatchlisted ? "text-yellow-500" : "text-zinc-700"
              )}
            >
              <Star size={14} fill={isWatchlisted ? "currentColor" : "none"} />
            </button>
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold border border-zinc-700">
                {token.symbol[0]}
              </div>
              {token.audit?.isSafe && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 border border-black">
                  <ShieldCheck size={8} className="text-black" />
                </div>
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm truncate group-hover:text-blue-400 transition-colors">{token.symbol}</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      <Badge variant={token.audit?.isSafe ? 'success' : 'warning'}>{token.type}</Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <div className="space-y-1">
                      <p className="font-bold">Security Audit</p>
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", token.audit?.lpBurned ? "bg-green-500" : "bg-red-500")} />
                        <span>LP Burned</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", token.audit?.mintRevoked ? "bg-green-500" : "bg-red-500")} />
                        <span>Mint Revoked</span>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-zinc-500 truncate">{token.name}</span>
                <Zap size={10} className="text-yellow-500 fill-yellow-500" />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end md:items-start">
            <span className={cn("text-xs font-mono transition-colors duration-300", priceColor)}>
              {formatPrice(token.price)}
            </span>
            <span className={cn("text-[10px]", token.change24h >= 0 ? "text-green-500" : "text-red-500")}>
              {token.change24h >= 0 ? "+" : ""}{token.change24h.toFixed(2)}%
            </span>
          </div>

          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs text-zinc-300">{formatNumber(token.marketCap)}</span>
            <span className="text-[10px] text-zinc-500 font-mono tracking-tighter">MCAP</span>
          </div>

          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs text-zinc-300">{formatNumber(token.volume24h)}</span>
            <span className="text-[10px] text-zinc-500 font-mono tracking-tighter">VOL</span>
          </div>
        </motion.div>
      </PopoverTrigger>
      <PopoverContent side="right" className="w-80 p-0 overflow-hidden bg-zinc-950 border-zinc-800">
        <div className="p-4 border-b border-zinc-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold border border-zinc-700">
              {token.symbol[0]}
            </div>
            <div>
              <h4 className="font-bold text-sm">{token.name}</h4>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{token.symbol} / SOL</p>
            </div>
          </div>
          <a href="#" className="p-2 hover:bg-zinc-900 rounded-full transition-colors">
            <ExternalLink size={14} className="text-zinc-400" />
          </a>
        </div>
        <div className="p-4 grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-[10px] text-zinc-500 uppercase">Liquidity</p>
            <p className="text-sm font-mono">${formatNumber(token.liquidity)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-zinc-500 uppercase">Holders</p>
            <p className="text-sm font-mono">{token.holders}</p>
          </div>
          <div className="space-y-1 text-green-500">
            <p className="text-[10px] text-zinc-500 uppercase">24H Change</p>
            <div className="flex items-center gap-1">
              <TrendingUp size={14} />
              <p className="text-sm font-mono">+{token.change24h.toFixed(2)}%</p>
            </div>
          </div>
          <div className="space-y-1">
             <p className="text-[10px] text-zinc-500 uppercase">Status</p>
             <Badge variant="info">{token.status}</Badge>
          </div>
        </div>
        <div className="p-4 bg-zinc-900/30 border-t border-zinc-900 flex items-center justify-between">
           <Dialog>
             <DialogTrigger asChild>
               <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 rounded transition-colors flex items-center justify-center gap-2">
                 <ShoppingCart size={14} />
                 Trade Now
               </button>
             </DialogTrigger>
             <DialogContent>
               <DialogHeader>
                 <DialogTitle>Quick Trade: {token.symbol}</DialogTitle>
               </DialogHeader>
               <div className="space-y-4 py-4">
                 <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase">You Pay</p>
                      <input type="text" defaultValue="1.0" className="bg-transparent text-xl font-bold outline-none w-full" />
                    </div>
                    <span className="font-bold">SOL</span>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase">You Receive</p>
                      <input type="text" readOnly value={formatNumber(1 / token.price)} className="bg-transparent text-xl font-bold outline-none w-full" />
                    </div>
                    <span className="font-bold">{token.symbol}</span>
                 </div>
                 <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors">
                   Swap
                 </button>
               </div>
             </DialogContent>
           </Dialog>
        </div>
      </PopoverContent>
    </Popover>
  );
});
