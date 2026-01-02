"use client";

import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { updateTokenPrice } from "@/store/store";
import { Token } from "@/types";

export function useWebSocketMock(tokens: Token[]) {
  const dispatch = useDispatch();
  const tokensRef = useRef(tokens);

  // Keep tokensRef up to date
  useEffect(() => {
    tokensRef.current = tokens;
  }, [tokens]);

  useEffect(() => {
    const hasTokens = tokens.length > 0;
    if (!hasTokens) return;

    const interval = setInterval(() => {
      const currentTokens = tokensRef.current;
      if (currentTokens.length === 0) return;

      // Update 3 random tokens every 500ms for more dynamic feel
      const updatesToMake = Math.min(3, currentTokens.length);
      
      for (let i = 0; i < updatesToMake; i++) {
        const randomIndex = Math.floor(Math.random() * currentTokens.length);
        const token = currentTokens[randomIndex];
        
        // Dynamic price change between -1.5% and +1.5%
        const changePercent = (Math.random() - 0.5) * 0.03;
        const priceChange = token.price * changePercent;
        const newPrice = Math.max(0.000001, token.price + priceChange);

        dispatch(updateTokenPrice({ id: token.id, price: newPrice }));
      }
    }, 500);

    return () => clearInterval(interval);
  }, [dispatch, tokens.length > 0]); // eslint-disable-line react-hooks/exhaustive-deps
}
