// src/components/TermsModal.tsx
'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, FileText, Shield, AlertTriangle, CheckCircle, Scale } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export default function TermsModal({ isOpen, onClose, onAccept }: TermsModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-purple-600 px-8 py-6">
                  <div className="flex items-center justify-between">
                    <Dialog.Title className="text-2xl font-bold text-white flex items-center gap-3">
                      <Scale size={28} />
                      Terms of Service & Copyright Policy
                    </Dialog.Title>
                    <button
                      onClick={onClose}
                      className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <p className="text-primary-100 mt-2">
                    Please read carefully before submitting your NFT
                  </p>
                </div>

                {/* Content */}
                <div className="max-h-[60vh] overflow-y-auto px-8 py-6">
                  {/* Terms of Service */}
                  <section className="mb-8">
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-primary-200">
                      <div className="bg-primary-100 p-2 rounded-lg">
                        <FileText className="text-primary-600" size={24} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Terms of Service</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                        <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                          <CheckCircle size={18} />
                          1. Acceptance of Terms
                        </h4>
                        <p className="text-blue-800 text-sm">
                          By submitting content to this NFT marketplace, you acknowledge that you have read, 
                          understood, and agree to be bound by these Terms of Service. If you do not agree 
                          to these terms, please do not submit any content.
                        </p>
                      </div>

                      <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
                        <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                          <CheckCircle size={18} />
                          2. Submission Review Process
                        </h4>
                        <p className="text-purple-800 text-sm mb-2">
                          All submissions undergo a review process:
                        </p>
                        <ul className="list-disc list-inside text-purple-800 text-sm space-y-1 ml-4">
                          <li>Review typically takes 24-48 hours</li>
                          <li>We reserve the right to approve or reject any submission</li>
                          <li>You will be notified via email of our decision</li>
                          <li>Rejected submissions can be resubmitted after addressing concerns</li>
                        </ul>
                      </div>

                      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                        <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                          <CheckCircle size={18} />
                          3. Marketplace Fees
                        </h4>
                        <p className="text-green-800 text-sm">
                          A marketplace fee of <strong>2.5%</strong> applies to all NFT sales. This fee is 
                          automatically deducted from the sale price. Gas fees for blockchain transactions 
                          are paid separately by the buyer or seller as applicable.
                        </p>
                      </div>

                      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                        <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                          <CheckCircle size={18} />
                          4. Content Standards
                        </h4>
                        <p className="text-amber-800 text-sm mb-2">
                          All submitted content must:
                        </p>
                        <ul className="list-disc list-inside text-amber-800 text-sm space-y-1 ml-4">
                          <li>Be appropriate for a general audience</li>
                          <li>Not contain illegal content</li>
                          <li>Not promote hate, violence, or discrimination</li>
                          <li>Not infringe on intellectual property rights</li>
                          <li>Meet minimum quality standards</li>
                        </ul>
                      </div>

                      <div className="bg-pink-50 border-l-4 border-pink-500 p-4 rounded-r-lg">
                        <h4 className="font-bold text-pink-900 mb-2 flex items-center gap-2">
                          <CheckCircle size={18} />
                          5. User Responsibilities
                        </h4>
                        <p className="text-pink-800 text-sm">
                          You are responsible for maintaining the security of your wallet, keeping your 
                          private keys secure, and all activity that occurs under your account. We are 
                          not liable for any losses resulting from unauthorized access to your account.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Copyright Policy */}
                  <section className="mb-8">
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-amber-200">
                      <div className="bg-amber-100 p-2 rounded-lg">
                        <Shield className="text-amber-600" size={24} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Copyright & Intellectual Property</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                        <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                          <AlertTriangle size={18} />
                          Ownership Requirements
                        </h4>
                        <p className="text-red-800 text-sm mb-2">
                          You MUST own all rights to the content you submit, or have explicit written 
                          permission from the copyright holder. This includes:
                        </p>
                        <ul className="list-disc list-inside text-red-800 text-sm space-y-1 ml-4">
                          <li>Images, artwork, and graphics</li>
                          <li>Text, descriptions, and written content</li>
                          <li>Music, audio, or video elements</li>
                          <li>Trademarks, logos, and brand elements</li>
                          <li>Character likenesses and designs</li>
                        </ul>
                      </div>

                      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
                        <h4 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
                          <AlertTriangle size={18} />
                          Prohibited Content
                        </h4>
                        <p className="text-orange-800 text-sm mb-2">
                          You may NOT submit content that:
                        </p>
                        <ul className="list-disc list-inside text-orange-800 text-sm space-y-1 ml-4">
                          <li>Copies or derives from existing copyrighted works without permission</li>
                          <li>Uses celebrity likenesses or real people without consent</li>
                          <li>Incorporates copyrighted characters, brands, or franchises</li>
                          <li>Contains stolen or plagiarized artwork</li>
                          <li>Uses AI-generated content trained on copyrighted material without proper licensing</li>
                        </ul>
                      </div>

                      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                        <h4 className="font-bold text-yellow-900 mb-2 flex items-center gap-2">
                          <Scale size={18} />
                          License Grant
                        </h4>
                        <p className="text-yellow-800 text-sm">
                          By minting an NFT on our platform, you grant the marketplace a non-exclusive, 
                          worldwide, royalty-free license to display, promote, and market your NFT. 
                          You retain all ownership rights to your content.
                        </p>
                      </div>

                      <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg">
                        <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                          <Shield size={18} />
                          Verification Rights
                        </h4>
                        <p className="text-indigo-800 text-sm">
                          We reserve the right to request proof of ownership or licensing for any 
                          submitted content. This may include original files, purchase receipts, 
                          licensing agreements, or other documentation.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Consequences */}
                  <section className="mb-6">
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-red-200">
                      <div className="bg-red-100 p-2 rounded-lg">
                        <AlertTriangle className="text-red-600" size={24} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Violations & Consequences</h3>
                    </div>

                    <div className="bg-red-100 border-2 border-red-300 rounded-xl p-6">
                      <h4 className="font-bold text-red-900 mb-3 text-lg">
                        Submitting fraudulent, stolen, or infringing content will result in:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-red-200">
                          <p className="font-semibold text-red-800 mb-1">⚠️ Immediate Rejection</p>
                          <p className="text-sm text-red-700">Your submission will be denied without review</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-red-200">
                          <p className="font-semibold text-red-800 mb-1">🚫 Account Suspension</p>
                          <p className="text-sm text-red-700">Your account may be permanently banned</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-red-200">
                          <p className="font-semibold text-red-800 mb-1">⚖️ Legal Action</p>
                          <p className="text-sm text-red-700">Copyright holders may pursue legal remedies</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-red-200">
                          <p className="font-semibold text-red-800 mb-1">💰 Financial Liability</p>
                          <p className="text-sm text-red-700">You may be liable for damages and legal fees</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* DMCA Notice */}
                  <section className="mb-6">
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl p-6 shadow-lg">
                      <h4 className="font-bold text-xl mb-3 flex items-center gap-2">
                        <Scale size={24} />
                        DMCA Compliance & Reporting
                      </h4>
                      <p className="text-white text-sm mb-3">
                        We respect intellectual property rights and comply with the Digital Millennium 
                        Copyright Act (DMCA). If you believe your work has been infringed:
                      </p>
                      <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                        <p className="font-semibold mb-2">Contact our DMCA Agent:</p>
                        <p className="text-sm">📧 Email: <strong>dmca@nftmarketplace.com</strong></p>
                        <p className="text-sm mt-2">
                          Include: Your contact info, description of copyrighted work, location of 
                          infringing content, and a statement of good faith belief.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Summary */}
                  <section>
                    <div className="bg-gradient-to-br from-primary-50 to-purple-50 border-2 border-primary-200 rounded-xl p-6">
                      <h4 className="font-bold text-primary-900 text-lg mb-3 flex items-center gap-2">
                        <CheckCircle size={20} />
                        By Accepting These Terms, You Certify That:
                      </h4>
                      <ul className="space-y-2 text-sm text-primary-800">
                        <li className="flex items-start gap-2">
                          <CheckCircle size={16} className="mt-0.5 flex-shrink-0 text-primary-600" />
                          <span>You are at least 18 years old or have parental consent</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle size={16} className="mt-0.5 flex-shrink-0 text-primary-600" />
                          <span>You own all rights to the content you are submitting</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle size={16} className="mt-0.5 flex-shrink-0 text-primary-600" />
                          <span>Your content does not infringe on any third-party rights</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle size={16} className="mt-0.5 flex-shrink-0 text-primary-600" />
                          <span>You accept responsibility for any violations of these terms</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle size={16} className="mt-0.5 flex-shrink-0 text-primary-600" />
                          <span>You agree to the marketplace fee structure</span>
                        </li>
                      </ul>
                    </div>
                  </section>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm text-gray-600">
                      Last updated: {new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={onClose}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          onAccept();
                          onClose();
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-medium rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                      >
                        <CheckCircle size={20} />
                        I Accept These Terms
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}