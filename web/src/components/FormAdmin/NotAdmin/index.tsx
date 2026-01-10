import { AlertTriangle, Home, X } from "lucide-react";
import { Button } from "../../UI/Button";
import { useRouter } from "next/navigation";

export default function NotAdmin({
  showBlocked,
  address,
  setShowBlocked,
  adminWallet,
}: any) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {showBlocked && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Admin Access Required"
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-50 to-red-50 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-amber-100 p-2 rounded-xl">
                  <AlertTriangle className="text-amber-700" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Access denied</h3>
                  <p className="text-xs text-gray-600">
                    This page is for admin wallet only.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowBlocked(false)}
                className="p-2 rounded-lg hover:bg-white/60 transition"
                aria-label="Close"
              >
                <X size={18} className="text-gray-700" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm text-gray-700">
                  Connected wallet:
                  <span className="block font-semibold text-gray-900 break-all mt-1">
                    {address?.toLowerCase()}
                  </span>
                </p>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm text-amber-900">
                  Required admin wallet:
                  <span className="block font-semibold break-all mt-1">
                    {adminWallet}
                  </span>
                </p>
              </div>

              <p className="text-sm text-gray-600">
                Switch to the admin wallet, or go back to the homepage.
              </p>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-white flex flex-col sm:flex-row gap-3 sm:justify-end">
              <Button
                variant="secondary"
                onClick={() => router.push("/")}
                className="w-full sm:w-auto"
              >
                <Home size={18} />
                Go Home
              </Button>
              <Button
                onClick={() => router.push("/")}
                className="w-full sm:w-auto"
              >
                Back to /
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
