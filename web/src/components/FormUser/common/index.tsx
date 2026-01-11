import {
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  ImagePlus,
  Mail,
  Package,
  Send,
  Shield,
  UserIcon,
  X,
  Zap,
} from "lucide-react";
import { Card } from "../../UI/Card";
import Image from "next/image";
import { Attribute } from "@/src/hooks/useUserSubmit";
import toast from "react-hot-toast";

export function WalletGate() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50">
      <Card className="p-12 text-center max-w-md shadow-2xl">
        <div className="bg-gradient-to-br from-primary-100 to-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Shield size={40} className="text-primary-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
        <p className="text-gray-600">
          Please connect your wallet to access the admin panel or submit your
          NFT.
        </p>
      </Card>
    </div>
  );
}

export function PageHeader({ isAdmin }: { isAdmin: boolean }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        {isAdmin ? (
          <>
            <div className="bg-gradient-to-br from-primary-500 to-purple-600 p-3 rounded-xl">
              <Shield className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Manage NFT minting and submissions
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-gradient-to-br from-primary-500 to-purple-600 p-3 rounded-xl">
              <Send className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                Submit Your NFT
              </h1>
              <p className="text-gray-600">
                Request to mint your digital creation
              </p>
            </div>
          </>
        )}
      </div>

      <div className="inline-flex items-center gap-2 bg-white border-2 border-primary-200 rounded-full px-4 py-2 shadow-sm">
        {isAdmin ? (
          <>
            <CheckCircle size={18} className="text-green-600" />
            <span className="text-sm font-medium text-gray-700">
              Admin Access
            </span>
          </>
        ) : (
          <>
            <UserIcon size={18} className="text-primary-600" />
            <span className="text-sm font-medium text-gray-700">
              Public Submission
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export function StatsCards({
  isAdmin,
  totalSupply,
  marketplaceFee,
  pendingCount,
}: {
  isAdmin: boolean;
  totalSupply: any;
  marketplaceFee: any;
  pendingCount: number;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="p-6 bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-primary-700 mb-1 font-medium">
              Total NFTs Minted
            </p>
            <p className="text-3xl font-bold text-primary-900">
              {totalSupply?.toString() || "0"}
            </p>
          </div>
          <div className="bg-primary-200 p-3 rounded-xl">
            <Package className="text-primary-700" size={28} />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-green-700 mb-1 font-medium">
              Marketplace Fee
            </p>
            <p className="text-3xl font-bold text-green-900">
              {marketplaceFee ? `${Number(marketplaceFee) / 100}%` : "0%"}
            </p>
          </div>
          <div className="bg-green-200 p-3 rounded-xl">
            <DollarSign className="text-green-700" size={28} />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-purple-700 mb-1 font-medium">
              {isAdmin ? "Pending Submissions" : "Your Status"}
            </p>
            <p className="text-3xl font-bold text-purple-900">
              {isAdmin ? `${pendingCount}` : "Active"}
            </p>
          </div>
          <div className="bg-purple-200 p-3 rounded-xl">
            <Activity className="text-purple-700" size={28} />
          </div>
        </div>
      </Card>
    </div>
  );
}

export function AdminTabs({
  activeTab,
  setActiveTab,
  pendingCount,
}: {
  activeTab: "mint" | "submissions";
  setActiveTab: (v: "mint" | "submissions") => void;
  pendingCount: number;
}) {
  return (
    <div className="flex gap-4 mb-8 bg-white rounded-xl p-2 shadow-md border border-gray-200">
      <button
        onClick={() => setActiveTab("mint")}
        className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
          activeTab === "mint"
            ? "bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-lg"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <Zap size={20} />
        Mint NFT
      </button>

      <button
        onClick={() => setActiveTab("submissions")}
        className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
          activeTab === "submissions"
            ? "bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-lg"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <Mail size={20} />
        Submissions
        {pendingCount > 0 && (
          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            {pendingCount}
          </span>
        )}
      </button>
    </div>
  );
}

export function PreviewCard({
  imagePreview,
  description,
  attributes,
}: {
  imagePreview: string;
  description: string;
  attributes: Attribute[];
}) {
  return (
    <Card className="p-6 shadow-xl border-2 border-gray-100">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <FileText size={20} />
        Preview
      </h3>
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl aspect-square mb-4 flex items-center justify-center overflow-hidden relative">
        {imagePreview ? (
          <Image
            src={imagePreview}
            alt="Preview"
            fill
            className="object-cover"
          />
        ) : (
          <ImagePlus className="text-gray-400" size={80} />
        )}
      </div>

      <h4 className="font-bold text-lg mb-2">
        {description.split("\n")[0] || "NFT Name"}
      </h4>
      <p className="text-gray-600 text-sm mb-3 line-clamp-3">
        {description || "NFT description will appear here..."}
      </p>

      {attributes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attributes.map((attr, index) => (
            <span
              key={index}
              className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-medium"
            >
              {attr.value}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
}

export function GuidelinesCard({ isAdmin }: { isAdmin: boolean }) {
  return (
    <Card className="p-6 bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 border-2 border-primary-200 shadow-xl">
      <h3 className="text-lg font-bold mb-4 text-primary-900 flex items-center gap-2">
        <AlertCircle size={20} />
        {isAdmin ? "Minting Guidelines" : "Submission Guidelines"}
      </h3>
      <ul className="space-y-3 text-sm text-gray-700">
        <li className="flex items-start gap-3">
          <CheckCircle
            size={18}
            className="text-primary-600 flex-shrink-0 mt-0.5"
          />
          <span>High quality images recommended (min 1000x1000px)</span>
        </li>
        <li className="flex items-start gap-3">
          <CheckCircle
            size={18}
            className="text-primary-600 flex-shrink-0 mt-0.5"
          />
          <span>Write a clear and compelling description</span>
        </li>
        <li className="flex items-start gap-3">
          <CheckCircle
            size={18}
            className="text-primary-600 flex-shrink-0 mt-0.5"
          />
          <span>Add relevant attributes for better discoverability</span>
        </li>

        {!isAdmin && (
          <>
            <li className="flex items-start gap-3">
              <Clock
                size={18}
                className="text-purple-600 flex-shrink-0 mt-0.5"
              />
              <span>Review typically takes 24-48 hours</span>
            </li>
            <li className="flex items-start gap-3">
              <Mail size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <span>You'll receive an email with the decision</span>
            </li>
          </>
        )}
      </ul>
    </Card>
  );
}

export function CopyrightNotice() {
  return (
    <Card className="p-6 bg-amber-50 border-2 border-amber-200">
      <div className="flex gap-3">
        <Shield size={24} className="text-amber-600 flex-shrink-0" />
        <div>
          <h4 className="font-bold text-amber-900 mb-2">Copyright Notice</h4>
          <p className="text-sm text-amber-800">
            By submitting, you confirm that you own all rights to this content
            or have permission to mint it as an NFT. Fraudulent submissions will
            be rejected and may result in account suspension.
          </p>
        </div>
      </div>
    </Card>
  );
}

export function SuccessHint() {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-4 w-full max-w-xl">
      <Card className="p-4 border-2 border-green-200 bg-green-50 shadow-xl">
        <div className="flex items-start gap-3">
          <CheckCircle className="text-green-600 mt-0.5" size={20} />
          <div className="flex-1">
            <p className="font-semibold text-green-900">Mint successful</p>
            <p className="text-sm text-green-800">
              Your NFT has been minted. You can mint another one or switch to
              the Submissions tab.
            </p>
          </div>
          <button
            className="p-2 rounded-lg hover:bg-green-100 transition-colors"
            onClick={() => toast.dismiss()}
            aria-label="Dismiss"
            type="button"
          >
            <X size={18} className="text-green-700" />
          </button>
        </div>
      </Card>
    </div>
  );
}
