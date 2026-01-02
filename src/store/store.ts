import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Token } from '@/types';

interface TradeState {
  tokens: Token[];
  watchlist: string[];
}

const initialState: TradeState = {
  tokens: [],
  watchlist: [],
};

const tradeSlice = createSlice({
  name: 'trade',
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<Token[]>) => {
      state.tokens = action.payload;
    },
    updateTokenPrice: (state, action: PayloadAction<{ id: string; price: number }>) => {
      const token = state.tokens.find(t => t.id === action.payload.id);
      if (token) {
        token.price = action.payload.price;
      }
    },
    toggleWatchlist: (state, action: PayloadAction<string>) => {
      const index = state.watchlist.indexOf(action.payload);
      if (index === -1) {
        state.watchlist.push(action.payload);
      } else {
        state.watchlist.splice(index, 1);
      }
    },
  },
});

export const { setTokens, updateTokenPrice, toggleWatchlist } = tradeSlice.actions;

export const store = configureStore({
  reducer: {
    trade: tradeSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
