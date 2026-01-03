import { useEffect, useState } from "react";

export function useNFTMetadata(uri?: string) {
  const [data, setData] = useState<any>();

  useEffect(() => {
    if (!uri) return;
    fetch(uri)
      .then((r) => r.json())
      .then(setData);
  }, [uri]);

  return data;
}
