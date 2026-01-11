import { Search, Filter, Tag } from "lucide-react";
import { Input } from "../../UI/Form";

export default function ToolbarMarket({
  query,
  setQuery,
  showActiveOnly,
  setShowActiveOnly,
  sort,
  setSort,
  total,
  filtered,
}: any) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow mb-6">
      <div className="grid md:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 w-full border rounded-xl p-3 text-black"
            placeholder="Search token or seller"
          />
        </div>

        <button
          onClick={() => setShowActiveOnly((v: boolean) => !v)}
          className="border rounded-xl p-3 flex items-center justify-center gap-2 text-black"
        >
          <Filter size={16} />
          {showActiveOnly ? "Active only" : "All"}
        </button>

        <div className="relative">
          <Tag className="absolute left-3 top-3 text-gray-400" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="pl-10 w-full border rounded-xl p-3 text-black"
          >
            <option value="new">Newest</option>
            <option value="price_low">Price low → high</option>
            <option value="price_high">Price high → low</option>
          </select>
        </div>
      </div>

      <p className="text-sm text-gray-600 mt-3">
        Showing {filtered} of {total}
      </p>
    </div>
  );
}
