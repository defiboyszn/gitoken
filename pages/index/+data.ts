import type { PageContextServer } from "vike/types";

const CLANKER_API = "https://www.clanker.world/api/tokens";
const GITOKEN_SUPPLY_RAW = 100_000_000_000 * 1e18; // 100B with 18 decimals

function formatMcap(mcap: number): string {
  if (mcap >= 1_000_000) return "$" + (mcap / 1_000_000).toFixed(2) + "M";
  if (mcap >= 1_000) return "$" + (mcap / 1_000).toFixed(2) + "K";
  return "$" + mcap.toFixed(2);
}

function formatPrice(price: number): string {
  if (price >= 1) return "$" + price.toFixed(2);
  if (price >= 0.0001) return "$" + price.toFixed(4);
  // Very small: show as decimal, trim trailing zeros (e.g. 1.92e-7 → $0.000000192)
  const fixed = price.toFixed(12).replace(/0+$/, "");
  return "$" + fixed;
}

export type Data = Awaited<ReturnType<typeof data>>;

export async function data(_pageContext: PageContextServer) {
  let tokenStats: {
    contract_address: string;
    priceFormatted: string;
    mcapFormatted: string;
    priceChange24h: number | null;
  } | null = null;

  try {
    const res = await fetch(
      `${CLANKER_API}?q=gitoken&includeMarket=true&limit=5`
    );
    if (!res.ok) return { tokenStats: null };
    const json = await res.json();
    const list = json.data as Array<{
      symbol: string;
      contract_address: string;
      supply: string;
      related?: { market?: { marketCap?: number; priceChangePercent24h?: number } };
    }>;
    const t = list?.find((x) => x.symbol?.toLowerCase() === "gitoken");
    if (!t?.related?.market?.marketCap) return { tokenStats: null };
    const marketCap = t.related.market.marketCap;
    const supplyNum = Number(t.supply) || GITOKEN_SUPPLY_RAW;
    const price = supplyNum > 0 ? marketCap / (supplyNum / 1e18) : 0;
    tokenStats = {
      contract_address: t.contract_address,
      priceFormatted: formatPrice(price),
      mcapFormatted: formatMcap(marketCap),
      priceChange24h: t.related.market.priceChangePercent24h ?? null,
    };
  } catch {
    // ignore
  }

  return { tokenStats };
}
