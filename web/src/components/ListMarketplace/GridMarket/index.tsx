import { MarketplaceCard } from "../Common";

export default function GridMarket({
  listings,
  images,
}: {
  listings: any[];
  images: Record<string, string>;
}) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <MarketplaceCard
          key={listing.tokenId.toString()}
          listing={listing}
          image={images[listing.tokenId.toString()]}
        />
      ))}
    </div>
  );
}
