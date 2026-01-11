import { AlertCircle, FileText, X } from "lucide-react";
import { Button } from "../../UI/Button";
import toast from "react-hot-toast";

export function TermsModal(props: {
  setShowTermsModal: (v: boolean) => void;
  setTermsAccepted: (v: boolean) => void;
}) {
  const { setShowTermsModal, setTermsAccepted } = props;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Terms of Service"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setShowTermsModal(false)}
      />
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-primary-50 to-purple-50 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary-500 to-purple-600 p-2 rounded-xl">
              <FileText className="text-white" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Terms of Service</h3>
              <p className="text-xs text-gray-600">Please read before submitting</p>
            </div>
          </div>

          <button
            onClick={() => setShowTermsModal(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close"
            type="button"
          >
            <X size={18} className="text-gray-600" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-6 space-y-4 text-sm text-gray-700">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <p className="font-medium text-gray-900 mb-2">1) Ownership & Rights</p>
            <p>
              You confirm you own the content or have permission to mint it as an NFT.
              Submissions that infringe IP/copyright will be rejected.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <p className="font-medium text-gray-900 mb-2">2) Review Process</p>
            <p>
              Submissions are reviewed by admins. Approval is not guaranteed.
              You may be contacted via email for clarifications.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <p className="font-medium text-gray-900 mb-2">3) Content Guidelines</p>
            <p>
              No illegal content, impersonation, stolen artwork, or hateful/harassing
              material. Admins may reject submissions that violate platform policies.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <p className="font-medium text-gray-900 mb-2">4) Fees & Marketplace</p>
            <p>
              Marketplace fees may apply. Fees shown on the dashboard are subject to
              change via contract settings.
            </p>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <AlertCircle className="text-amber-700 mt-0.5" size={18} />
            <p className="text-amber-900">
              This is a template Terms section for UI. Replace with your legal text
              before production.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-white flex flex-col sm:flex-row gap-3 sm:justify-end">
          <Button
            variant="secondary"
            onClick={() => setShowTermsModal(false)}
            className="w-full sm:w-auto"
          >
            Close
          </Button>˝
          <Button
            onClick={() => {
              setTermsAccepted(true);
              setShowTermsModal(false);
              toast.success("Terms accepted");
            }}
            className="w-full sm:w-auto"
          >
            Accept Terms
          </Button>
        </div>
      </div>
    </div>
  );
}