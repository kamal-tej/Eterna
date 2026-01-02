export interface Token {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  liquidity: number;
  holders: number;
  createdAt: string;
  status: 'new' | 'final' | 'migrated';
  type: string;
  image?: string;
  audit?: {
    isSafe: boolean;
    mintRevoked: boolean;
    lpBurned: boolean;
  };
}

export type TokenColumn = 'new' | 'final' | 'migrated';
