import { useNFTMetadata } from "@/src/hooks/useNFTMetadata";

export default function NFTCard({ tokenId, uri }: any) {
  const meta = useNFTMetadata(uri);

  return (
    <div className="rounded-xl border p-3">
      {meta?.image && (
        <img src={meta.image} className="h-48 w-full rounded object-cover" />
      )}
      <div className="mt-2 text-sm font-medium">Token #{tokenId}</div>
      <div className="text-xs text-gray-500">{meta?.name}</div>
    </div>
  );
}
