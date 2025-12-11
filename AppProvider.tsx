import React from "react";
import { UserProvider } from "./contexts/UserContext";

function AppProvider({ children }: { children: React.ReactNode }) {
  return <UserProvider>{children}</UserProvider>;
}

export default AppProvider;
