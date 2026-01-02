"use client";

import { useQuery } from "@tanstack/react-query";
import { generateMockTokens } from "@/utils/mockData";
import { TokenTableColumn } from "./TokenTableColumn";
import ErrorBoundary from "../error-boundaries/ErrorBoundary";
import { useWebSocketMock } from "@/hooks/useWebSocketMock";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { RootState, setTokens } from "@/store/store";
import { cn } from "@/utils/utils";
import { Search, LayoutGrid, List, Filter, ArrowUpDown, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../atoms/DropdownMenu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../atoms/Dialog";

export function TokenTradingTable() {
  const dispatch = useDispatch();
  const tokens = useSelector((state: RootState) => state.trade.tokens);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"marketCap" | "volume24h" | "price">("marketCap");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  // Advanced Filters State
  const [minMarketCap, setMinMarketCap] = useState(0);
  const [auditFilter, setAuditFilter] = useState<"all" | "safe" | "lpBurned">("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const lastUpdated = useMemo(() => {
    // Reference tokens to ensure useMemo updates when tokens update
    if (tokens.length > 0) return new Date().toLocaleTimeString();
    return "Initial";
  }, [tokens]);

  const { data: initialData, isLoading } = useQuery({
    queryKey: ['tokens'],
    queryFn: async () => {
      // Simulate API fetch
      await new Promise(resolve => setTimeout(resolve, 1500));
      return [
        ...generateMockTokens(20, 'new'),
        ...generateMockTokens(20, 'final'),
        ...generateMockTokens(20, 'migrated'),
      ];
    },
    staleTime: Infinity,
  });

  useEffect(() => {
    if (initialData) {
      dispatch(setTokens(initialData));
    }
  }, [initialData, dispatch]);

  useWebSocketMock(tokens);

  const filteredTokens = tokens
    .filter(t => {
      const matchesSearch = t.symbol.toLowerCase().includes(search.toLowerCase()) ||
                          t.name.toLowerCase().includes(search.toLowerCase());
      const matchesMCap = t.marketCap >= minMarketCap;
      const matchesAudit = auditFilter === "all" || 
                          (auditFilter === "safe" && t.audit?.isSafe) ||
                          (auditFilter === "lpBurned" && t.audit?.lpBurned);
      
      return matchesSearch && matchesMCap && matchesAudit;
    })
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      return sortOrder === "desc" ? bValue - aValue : aValue - bValue;
    });

  const newPairs = filteredTokens.filter(t => t.status === 'new');
  const finalStretch = filteredTokens.filter(t => t.status === 'final');
  const migrated = filteredTokens.filter(t => t.status === 'migrated');

  return (
    <div className="flex flex-col h-screen bg-black select-none">
      {/* Header / Toolbar */}
      <div className="flex flex-col gap-4 p-4 border-b border-zinc-900 bg-zinc-950 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between sm:justify-start sm:gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold italic">A</div>
            <div className="flex flex-col">
              <span className="font-bold text-sm leading-none">AXIOM</span>
              <span className="text-[10px] text-zinc-500 font-mono leading-none mt-1">
                {lastUpdated}
              </span>
            </div>
          </div>
          
          <div className="relative group hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-md py-1.5 pl-10 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-32 lg:w-64 focus:w-40 lg:focus:w-80 transition-all duration-300"
            />
            {search && (
              <button 
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          <div className="relative group sm:hidden flex-1 min-w-[120px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
            <input 
              type="text" 
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-md py-1.5 pl-9 pr-8 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors shrink-0">
                <ArrowUpDown size={14} />
                <span className="hidden xs:inline">Sort:</span> {sortBy === 'marketCap' ? 'MCAP' : sortBy === 'volume24h' ? 'Vol' : 'Price'}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortBy('marketCap')}>Market Cap</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('volume24h')}>Volume 24H</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('price')}>Price</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                Order: {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-md text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors">
                <Filter size={14} />
                Filters
                {(minMarketCap > 0 || auditFilter !== 'all') && (
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Discovery Filters</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Min Market Cap</label>
                    <span className="text-xs font-mono text-zinc-400">${(minMarketCap / 1000).toFixed(0)}k</span>
                  </div>
                  <input 
                    type="range" 
                    min="0"
                    max="1000000"
                    step="10000"
                    value={minMarketCap}
                    onChange={(e) => setMinMarketCap(Number(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Audit Status</label>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setAuditFilter('all')}
                      className={cn(
                        "px-3 py-1 rounded text-xs transition-colors",
                        auditFilter === 'all' ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                      )}
                    >
                      All
                    </button>
                    <button 
                      onClick={() => setAuditFilter('safe')}
                      className={cn(
                        "px-3 py-1 rounded text-xs transition-colors",
                        auditFilter === 'safe' ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                      )}
                    >
                      Safe Only
                    </button>
                    <button 
                      onClick={() => setAuditFilter('lpBurned')}
                      className={cn(
                        "px-3 py-1 rounded text-xs transition-colors",
                        auditFilter === 'lpBurned' ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                      )}
                    >
                      LP Burned
                    </button>
                  </div>
                </div>
                <div className="pt-4 flex justify-between gap-3">
                  <button 
                    onClick={() => {
                      setMinMarketCap(0);
                      setAuditFilter('all');
                    }}
                    className="text-zinc-500 hover:text-zinc-300 text-xs font-medium"
                  >
                    Reset All
                  </button>
                  <button 
                    onClick={() => setIsDialogOpen(false)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm font-bold transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <div className="flex items-center bg-zinc-900 rounded-md p-1 border border-zinc-800 shrink-0">
            <button className="p-1 sm:p-1.5 bg-zinc-800 rounded text-zinc-100"><LayoutGrid size={16} /></button>
            <button className="p-1 sm:p-1.5 text-zinc-500 hover:text-zinc-300"><List size={16} /></button>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex flex-col md:flex-row flex-1 overflow-x-auto overflow-y-hidden md:overflow-hidden snap-x snap-mandatory scroll-smooth">
        <ErrorBoundary>
          <TokenTableColumn 
            title="New Pairs" 
            tokens={newPairs} 
            type="new" 
            isLoading={isLoading} 
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <TokenTableColumn 
            title="Final Stretch" 
            tokens={finalStretch} 
            type="final" 
            isLoading={isLoading} 
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <TokenTableColumn 
            title="Migrated" 
            tokens={migrated} 
            type="migrated" 
            isLoading={isLoading} 
          />
        </ErrorBoundary>
      </div>
    </div>
  );
}
