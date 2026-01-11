import { Attribute } from "@/src/hooks/useUserSubmit";
import { Card } from "../../UI/Card";
import { ImagePlus, Plus, Send, Upload, X, Zap } from "lucide-react";
import { Input } from "../../UI/Form";
import Image from "next/image";
import { Button } from "../../UI/Button";
import { CopyrightNotice, GuidelinesCard, PreviewCard } from "../common";

export function MintOrSubmitSection(props: {
  isAdmin: boolean;

  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;

  description: string;
  setDescription: (v: string) => void;

  imagePreview: string;

  attributes: Attribute[];
  currentAttribute: { trait_type: string; value: string };
  setCurrentAttribute: (v: { trait_type: string; value: string }) => void;

  termsAccepted: boolean;
  setTermsAccepted: (v: boolean) => void;
  copyrightAccepted: boolean;
  setCopyrightAccepted: (v: boolean) => void;

  showTermsModal: boolean;
  setShowTermsModal: (v: boolean) => void;

  uploading: boolean;
  isConfirming: boolean;

  // handlers: MUST keep same names
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addAttribute: () => void;
  removeAttribute: (index: number) => void;
  handleMintNFT: () => Promise<void>;
  handleSubmitRequest: () => Promise<void>;
}) {
  const {
    isAdmin,
    name,
    setName,
    email,
    setEmail,
    description,
    setDescription,
    imagePreview,
    attributes,
    currentAttribute,
    setCurrentAttribute,
    termsAccepted,
    setTermsAccepted,
    copyrightAccepted,
    setCopyrightAccepted,
    setShowTermsModal,
    uploading,
    isConfirming,
    handleImageChange,
    addAttribute,
    removeAttribute,
    handleMintNFT,
    handleSubmitRequest,
  } = props;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Form */}
      <Card className="p-8 shadow-xl border-2 border-gray-100">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <div className="bg-gradient-to-br from-primary-500 to-purple-600 p-2 rounded-lg">
            <ImagePlus className="text-white" size={24} />
          </div>
          {isAdmin ? "Mint New NFT" : "Submit Your NFT"}
        </h2>

        <div className="space-y-6">
          {/* User Info (Non-admin only) */}
          {!isAdmin && (
            <>
              <Input
                label="Your Name *"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
              />

              <Input
                label="Email Address *"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
              />
            </>
          )}

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              NFT Image *{" "}
              <span className="text-gray-500 text-xs">(Max 10MB)</span>
            </label>
            <div className="border-3 border-dashed border-primary-300 rounded-2xl p-8 text-center hover:border-primary-500 hover:bg-primary-50 transition-all cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                {imagePreview ? (
                  <div className="relative w-full aspect-square max-w-xs mx-auto rounded-xl overflow-hidden shadow-lg">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity flex items-center justify-center">
                      <Upload
                        className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        size={32}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="py-12">
                    <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="text-primary-600" size={32} />
                    </div>
                    <p className="text-gray-700 font-medium mb-1">
                      Click to upload image
                    </p>
                    <p className="text-sm text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Description *
            </label>
            <textarea
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none transition-all"
              rows={5}
              placeholder="Describe your NFT in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Attributes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Attributes (Optional)
            </label>

            <div className="flex gap-2 mb-3">
              <Input
                placeholder="Trait (e.g., Rarity)"
                value={currentAttribute.trait_type}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCurrentAttribute({
                    ...currentAttribute,
                    trait_type: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Value (e.g., Legendary)"
                value={currentAttribute.value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCurrentAttribute({
                    ...currentAttribute,
                    value: e.target.value,
                  })
                }
              />
              <Button
                onClick={addAttribute}
                size="sm"
                className="flex-shrink-0"
              >
                <Plus size={20} />
              </Button>
            </div>

            {attributes.length > 0 && (
              <div className="space-y-2">
                {attributes.map((attr, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gradient-to-r from-primary-50 to-purple-50 p-4 rounded-xl border border-primary-200"
                  >
                    <span className="text-sm font-medium">
                      <strong className="text-primary-700">
                        {attr.trait_type}:
                      </strong>{" "}
                      <span className="text-gray-700">{attr.value}</span>
                    </span>
                    <button
                      onClick={() => removeAttribute(index)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-100 p-1 rounded transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Terms & Copyright (Non-admin only) */}
          {!isAdmin && (
            <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-primary-600 hover:text-primary-700 font-medium underline"
                  >
                    Terms of Service
                  </button>
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={copyrightAccepted}
                  onChange={(e) => setCopyrightAccepted(e.target.checked)}
                  className="mt-1 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  I certify that I own the copyright to this content and have
                  the right to mint it as an NFT
                </span>
              </label>
            </div>
          )}

          {/* Submit/Mint Button */}
          <Button
            onClick={isAdmin ? handleMintNFT : handleSubmitRequest}
            className="w-full"
            size="lg"
            loading={uploading || isConfirming}
            disabled={
              isAdmin
                ? !description
                : !name ||
                  !email ||
                  !description ||
                  !termsAccepted ||
                  !copyrightAccepted
            }
          >
            {uploading ? (
              "Processing..."
            ) : isConfirming ? (
              "Minting..."
            ) : isAdmin ? (
              <>
                <Zap size={20} />
                Mint NFT Now
              </>
            ) : (
              <>
                <Send size={20} />
                Submit for Review
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Right Column */}
      <div className="space-y-6">
        <PreviewCard
          imagePreview={imagePreview}
          description={description}
          attributes={attributes}
        />
        <GuidelinesCard isAdmin={isAdmin} />
        {!isAdmin && <CopyrightNotice />}
      </div>
    </div>
  );
}
