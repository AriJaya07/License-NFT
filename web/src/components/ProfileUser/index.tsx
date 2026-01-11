"use client";

import {
  Sparkles,
} from "lucide-react";
import UserNFT from "@/src/components/ProfileUser/UserNFT";
import TransactionModal from "./TransactionModal";
import { StepIndicator, Toast } from "./common";
import { useProfileUser } from "@/src/hooks/useProfileUser";


// Main Component
const ProfileUser: React.FC = () => {
  // Wallet state
  const {
    currentStep,
    toast,
    modal,
    setModal,
    setToast,
  } = useProfileUser();
  

  return (
    <div className="relative inline-block">
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-indigo-500" />
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                NFT Marketplace
              </h1>
              <Sparkles className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-muted-foreground max-w-md mx-auto">
              List your NFTs for sale in just a few simple steps. Connect your
              wallet, verify ownership, and start selling.
            </p>
          </div>

          {/* Step Indicator */}
          <StepIndicator currentStep={currentStep} />

         <UserNFT />
        </div>

        {/* Toast Notification */}
        <Toast
          show={toast.show}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast({ ...toast, show: false })}
        />

        {/* Transaction Modal */}
        <TransactionModal
          show={modal.show}
          status={modal.status}
          title={modal.title}
          message={modal.message}
          txHash={modal.txHash}
          onClose={() => setModal({ ...modal, show: false })}
        />
      </div>
    </div>
  );
};

export default ProfileUser;
