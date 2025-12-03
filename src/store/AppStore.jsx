import React, { createContext, useContext, useMemo, useState } from "react";

const Ctx = createContext(null);

export function AppStoreProvider({ children }) {
  const [bots, setBots] = useState([]);                // [{id, name, ...}]
  const [hasSubscription, setHasSubscription] = useState(false);
  const [everCreated, setEverCreated] = useState(false); // 👈 было ли создано хоть раз

  const randomHex = (len = 42) =>
    "0x" + Array.from({ length: len - 2 }, () => "abcdef0123456789"[Math.floor(Math.random() * 16)]).join("");
  const randomCode = (len = 10) =>
    Array.from({ length: len }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]).join("");

  const walletAddress = useMemo(() => randomHex(42), []);
  const verificationCode = useMemo(() => randomCode(10), []);

  const value = {
    bots, setBots,
    hasSubscription, setHasSubscription,
    everCreated, setEverCreated,                 // 👈 экспортируем
    walletAddress, verificationCode,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useApp = () => useContext(Ctx);
