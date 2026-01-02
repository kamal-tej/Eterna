import { Token } from "@/types";

const symbols = ["SOL", "BTC", "ETH", "USDC", "PEPE", "DOGE", "SHIB", "BONK", "WIF", "POPCAT"];
const names = ["Solana", "Bitcoin", "Ethereum", "USD Coin", "Pepe", "Dogecoin", "Shiba Inu", "Bonk", "Dogwifhat", "Popcat"];

export const generateMockTokens = (count: number, status: Token['status']): Token[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `${status}-${i}`,
    symbol: symbols[i % symbols.length],
    name: names[i % names.length],
    price: Math.random() * 100,
    change24h: (Math.random() * 20) - 10,
    marketCap: Math.random() * 1000000000,
    volume24h: Math.random() * 100000000,
    liquidity: Math.random() * 5000000,
    holders: Math.floor(Math.random() * 10000),
    createdAt: new Date(Date.now() - Math.random() * 10000000).toISOString(),
    status,
    type: "Pump",
    audit: {
      isSafe: Math.random() > 0.2,
      mintRevoked: Math.random() > 0.1,
      lpBurned: Math.random() > 0.1,
    }
  }));
};
