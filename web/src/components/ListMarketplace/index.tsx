"use client";

import { useListMarketplaceRead } from "@/src/hooks/useReadContract";
import { useListingsView } from "@/src/hooks/useListingMarketplace";
import {
  MarketplaceEmpty,
  MarketplaceError,
  MarketplaceHeader,
  MarketplaceLoading,
} from "./Common";
import ToolbarMarket from "./ToolbarMarket";
import GridMarket from "./GridMarket";

export default function ListMarketplace() {
  const { listings, isLoading, isError, refetch } = useListMarketplaceRead();

  const {
    listings: filtered,
    images,
    query,
    setQuery,
    showActiveOnly,
    setShowActiveOnly,
    sort,
    setSort,
  } = useListingsView(listings);

  if (isLoading) return <MarketplaceLoading />;
  if (isError) return <MarketplaceError onRetry={refetch} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MarketplaceHeader onRefresh={refetch} />

        <ToolbarMarket
          query={query}
          setQuery={setQuery}
          showActiveOnly={showActiveOnly}
          setShowActiveOnly={setShowActiveOnly}
          sort={sort}
          setSort={setSort}
          total={listings.length}
          filtered={filtered.length}
        />

        {filtered.length === 0 ? (
          <MarketplaceEmpty
            onRefresh={refetch}
            onReset={() => {
              setQuery("");
              setShowActiveOnly(true);
              setSort("new");
            }}
          />
        ) : (
          <GridMarket listings={filtered} images={images} />
        )}
      </div>
    </div>
  );
}
