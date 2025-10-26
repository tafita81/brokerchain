import { useQuery } from "@tanstack/react-query";

export interface PlatformStats {
  suppliers: {
    total: number;
    pfas: number;
    buyamerica: number;
    eudr: number;
  };
  buyers: {
    total: number;
    pfas: number;
    buyamerica: number;
    eudr: number;
  };
  rfqs: {
    total: number;
    sent: number;
    negotiating: number;
    closed: number;
  };
  countries: number;
  lastUpdated: string;
}

export function useStats() {
  return useQuery<PlatformStats>({
    queryKey: ["/api/stats"],
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 20000,
  });
}

export function formatCount(count: number): string {
  if (count >= 10000) {
    return `${Math.floor(count / 1000)}K+`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K+`;
  }
  if (count >= 500) {
    return `${Math.floor(count / 100) * 100}+`;
  }
  if (count >= 100) {
    return `${Math.floor(count / 50) * 50}+`;
  }
  return `${count}+`;
}
