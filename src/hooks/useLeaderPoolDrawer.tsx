import { LeaderPoolDrawerContext } from "@/collaboration/contexts/LeaderPoolDrawerContext";
import { useContext } from "react";

export const useLeaderPoolDrawer = () => {
  const context = useContext(LeaderPoolDrawerContext);
  if (context === undefined) {
    throw new Error(
      "useLeaderPoolDrawer must be used within a LeaderPoolDrawerProvider",
    );
  }
  return context;
};
