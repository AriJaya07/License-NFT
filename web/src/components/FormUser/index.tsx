"use client";

import { Toaster } from "react-hot-toast";

import { useUserSubmit } from "@/src/hooks/useUserSubmit";
import { AdminTabs, PageHeader, StatsCards, SuccessHint, WalletGate } from "./common";
import { MintOrSubmitSection } from "./MintOrSubmitSection";
import { SubmissionsTab } from "./SubmissionsTab";
import { TermsModal } from "./TermsModal";

export default function FormUser() {
  const admin = useUserSubmit();

  if (!admin.isConnected) {
    return <WalletGate />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-12">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader isAdmin={admin.isAdmin} />

        <StatsCards
          isAdmin={admin.isAdmin}
          totalSupply={admin.totalSupply}
          marketplaceFee={admin.marketplaceFee}
          pendingCount={admin.pendingSubmissions.length}
        />

        {admin.isAdmin && (
          <AdminTabs
            activeTab={admin.activeTab}
            setActiveTab={admin.setActiveTab}
            pendingCount={admin.pendingSubmissions.length}
          />
        )}

        {admin.activeTab === "mint" || !admin.isAdmin ? (
          <MintOrSubmitSection
            // role
            isAdmin={admin.isAdmin}
            // form state
            name={admin.name}
            setName={admin.setName}
            email={admin.email}
            setEmail={admin.setEmail}
            description={admin.description}
            setDescription={admin.setDescription}
            imagePreview={admin.imagePreview}
            attributes={admin.attributes}
            currentAttribute={admin.currentAttribute}
            setCurrentAttribute={admin.setCurrentAttribute}
            termsAccepted={admin.termsAccepted}
            setTermsAccepted={admin.setTermsAccepted}
            copyrightAccepted={admin.copyrightAccepted}
            setCopyrightAccepted={admin.setCopyrightAccepted}
            showTermsModal={admin.showTermsModal}
            setShowTermsModal={admin.setShowTermsModal}
            // flags
            uploading={admin.uploading}
            isConfirming={admin.isConfirming}
            // handlers (same names)
            handleImageChange={admin.handleImageChange}
            addAttribute={admin.addAttribute}
            removeAttribute={admin.removeAttribute}
            handleMintNFT={admin.handleMintNFT}
            handleSubmitRequest={admin.handleSubmitRequest}
          />
        ) : (
          <SubmissionsTab
            pendingSubmissions={admin.pendingSubmissions}
            setPendingSubmissions={admin.setPendingSubmissions}
            setActiveTab={admin.setActiveTab}
            setDescription={admin.setDescription}
            setAttributes={admin.setAttributes}
            setImagePreview={admin.setImagePreview}
          />
        )}
      </div>

      {admin.showTermsModal && (
        <TermsModal
          setShowTermsModal={admin.setShowTermsModal}
          setTermsAccepted={admin.setTermsAccepted}
        />
      )}

      {admin.isAdmin && admin.isSuccess && <SuccessHint />}
    </div>
  );
}