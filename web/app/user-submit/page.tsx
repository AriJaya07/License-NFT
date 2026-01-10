// src/app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import emailjs from '@emailjs/browser';
import { Button } from '@/src/components/UI/Button';
import Input from '@/src/components/UI/Input';
import { Card } from '@/src/components/UI/Card';

import {
  Upload,
  ImagePlus,
  Loader2,
  Plus,
  X,
  Package,
  DollarSign,
  Activity,
  Send,
  Shield,
  CheckCircle,
  AlertCircle,
  FileText,
  Mail,
  User as UserIcon,
  Clock,
  Zap,
} from 'lucide-react';

import { useMarketplaceFee, useMyNFTRead } from '@/src/hooks/useReadContract';
import { useNFT } from '@/src/hooks/useNFT';
import { uploadImageToPinata, uploadMetadataToPinata } from '@/src/hooks/ipfs';

interface Attribute {
  trait_type: string;
  value: string;
}

interface PendingSubmission {
  id: string;
  name: string;
  email: string;
  nftName: string;
  description: string;
  imageUrl: string;
  attributes: Attribute[];
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  termsAccepted: boolean;
}

// Add this to your environment variables
const ADMIN_ADDRESSES = process.env.NEXT_PUBLIC_ADMIN_ADDRESSES?.split(',') || [];

export default function AdminPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const { mint, isConfirming, isSuccess } = useNFT();
  const marketplaceFee = useMarketplaceFee();
  const { data: totalSupply } = useMyNFTRead();

  // Check if user is admin
  const isAdmin = ADMIN_ADDRESSES.some(
    (admin) => admin.toLowerCase() === address?.toLowerCase()
  );

  // Form state
  const [activeTab, setActiveTab] = useState<'mint' | 'submissions'>('mint');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [currentAttribute, setCurrentAttribute] = useState({
    trait_type: '',
    value: '',
  });
  const [uploading, setUploading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [copyrightAccepted, setCopyrightAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Pending submissions (in production, this would come from a database)
  const [pendingSubmissions, setPendingSubmissions] = useState<PendingSubmission[]>([]);

  // EmailJS configuration
  const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
  const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
  const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';

  // Initialize EmailJS
  useEffect(() => {
    if (EMAILJS_PUBLIC_KEY) {
      emailjs.init(EMAILJS_PUBLIC_KEY);
    }
  }, []);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size must be less than 10MB');
        return;
      }

      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add attribute
  const addAttribute = () => {
    if (currentAttribute.trait_type && currentAttribute.value) {
      setAttributes([...attributes, currentAttribute]);
      setCurrentAttribute({ trait_type: '', value: '' });
    }
  };

  // Remove attribute
  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  // Handle submission for non-admin users
  const handleSubmitRequest = async () => {
    if (!name || !email || !description || !image) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!termsAccepted || !copyrightAccepted) {
      toast.error('Please accept the terms and copyright policy');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setUploading(true);
    const loadingToast = toast.loading('Submitting your NFT request...');

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;

        // Prepare submission data
        const submissionData = {
          from_name: name,
          from_email: email,
          nft_name: description.split('\n')[0] || 'Untitled NFT',
          nft_description: description,
          attributes: JSON.stringify(attributes),
          submission_date: new Date().toLocaleString(),
          image_preview: base64Image.substring(0, 100) + '...',
        };

        // Send email using EmailJS
        const result = await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          submissionData
        );

        if (result.status === 200) {
          toast.success('Request submitted successfully!', { id: loadingToast });
          toast.success('Admin will review your submission and contact you via email', {
            duration: 5000,
          });

          // OPTIONAL UI: store local pending submission (so admin can see it in Submissions tab)
          setPendingSubmissions((prev) => [
            {
              id: `${Date.now()}`,
              name,
              email,
              nftName: description.split('\n')[0] || 'Untitled NFT',
              description,
              imageUrl: imagePreview || '',
              attributes,
              status: 'pending',
              submittedAt: new Date(),
              termsAccepted,
            },
            ...prev,
          ]);

          // Reset form
          setName('');
          setEmail('');
          setDescription('');
          setImage(null);
          setImagePreview('');
          setAttributes([]);
          setTermsAccepted(false);
          setCopyrightAccepted(false);
        }
      };

      reader.readAsDataURL(image);
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error('Failed to submit request. Please try again.', { id: loadingToast });
    } finally {
      setUploading(false);
    }
  };

  // Handle mint NFT (Admin only)
  const handleMintNFT = async () => {
    if (!address || !isConnected || !isAdmin) {
      toast.error('Only admin can mint NFTs');
      return;
    }

    if (!description || !image) {
      toast.error('Please fill all required fields');
      return;
    }

    setUploading(true);
    const loadingToast = toast.loading('Uploading to IPFS...');

    try {
      // 1. Upload image to IPFS
      const imageHash = await uploadImageToPinata(image);
      toast.success('Image uploaded to IPFS!');

      // 2. Create metadata
      const metadata = {
        name: description.split('\n')[0] || 'NFT',
        description,
        image: `ipfs://${imageHash}`,
        attributes: attributes.length > 0 ? attributes : undefined,
      };

      // 3. Upload metadata to IPFS
      toast.loading('Uploading metadata...', { id: loadingToast });
      const metadataHash = await uploadMetadataToPinata(metadata);
      toast.success('Metadata uploaded!', { id: loadingToast });

      // 4. Mint NFT
      toast.loading('Minting NFT...', { id: loadingToast });
      await mint(address, metadataHash);

      toast.success('NFT minted successfully!', { id: loadingToast });

      // Reset form
      setDescription('');
      setImage(null);
      setImagePreview('');
      setAttributes([]);
    } catch (error: any) {
      console.error('Minting error:', error);
      toast.error(error.message || 'Failed to mint NFT', { id: loadingToast });
    } finally {
      setUploading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50">
        <Card className="p-12 text-center max-w-md shadow-2xl">
          <div className="bg-gradient-to-br from-primary-100 to-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield size={40} className="text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600">
            Please connect your wallet to access the admin panel or submit your NFT.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-12">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
                  <p className="text-gray-600">Manage NFT minting and submissions</p>
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
                  <p className="text-gray-600">Request to mint your digital creation</p>
                </div>
              </>
            )}
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white border-2 border-primary-200 rounded-full px-4 py-2 shadow-sm">
            {isAdmin ? (
              <>
                <CheckCircle size={18} className="text-green-600" />
                <span className="text-sm font-medium text-gray-700">Admin Access</span>
              </>
            ) : (
              <>
                <UserIcon size={18} className="text-primary-600" />
                <span className="text-sm font-medium text-gray-700">Public Submission</span>
              </>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary-700 mb-1 font-medium">Total NFTs Minted</p>
                <p className="text-3xl font-bold text-primary-900">
                  {totalSupply?.toString() || '0'}
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
                <p className="text-sm text-green-700 mb-1 font-medium">Marketplace Fee</p>
                <p className="text-3xl font-bold text-green-900">
                  {marketplaceFee ? `${Number(marketplaceFee) / 100}%` : '0%'}
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
                  {isAdmin ? 'Pending Submissions' : 'Your Status'}
                </p>
                <p className="text-3xl font-bold text-purple-900">
                  {isAdmin ? `${pendingSubmissions.length}` : 'Active'}
                </p>
              </div>
              <div className="bg-purple-200 p-3 rounded-xl">
                <Activity className="text-purple-700" size={28} />
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs (Admin only) */}
        {isAdmin && (
          <div className="flex gap-4 mb-8 bg-white rounded-xl p-2 shadow-md border border-gray-200">
            <button
              onClick={() => setActiveTab('mint')}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === 'mint'
                  ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Zap size={20} />
              Mint NFT
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === 'submissions'
                  ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Mail size={20} />
              Submissions
              {pendingSubmissions.length > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {pendingSubmissions.length}
                </span>
              )}
            </button>
          </div>
        )}

        {/* Content */}
        {activeTab === 'mint' || !isAdmin ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <Card className="p-8 shadow-xl border-2 border-gray-100">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <div className="bg-gradient-to-br from-primary-500 to-purple-600 p-2 rounded-lg">
                  <ImagePlus className="text-white" size={24} />
                </div>
                {isAdmin ? 'Mint New NFT' : 'Submit Your NFT'}
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
                      onChange={(e) => setName(e.target.value)}
                    />

                    <Input
                      label="Email Address *"
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </>
                )}

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    NFT Image * <span className="text-gray-500 text-xs">(Max 10MB)</span>
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
                          <Image src={imagePreview} alt="Preview" fill className="object-cover" />
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
                          <p className="text-gray-700 font-medium mb-1">Click to upload image</p>
                          <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
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
                      onChange={(e) =>
                        setCurrentAttribute({ ...currentAttribute, trait_type: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Value (e.g., Legendary)"
                      value={currentAttribute.value}
                      onChange={(e) =>
                        setCurrentAttribute({ ...currentAttribute, value: e.target.value })
                      }
                    />
                    <Button onClick={addAttribute} size="sm" className="flex-shrink-0">
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
                            <strong className="text-primary-700">{attr.trait_type}:</strong>{' '}
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
                        I agree to the{' '}
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
                        I certify that I own the copyright to this content and have the right to mint
                        it as an NFT
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
                      ? !description || !image
                      : !name ||
                        !email ||
                        !description ||
                        !image ||
                        !termsAccepted ||
                        !copyrightAccepted
                  }
                >
                  {uploading ? (
                    'Processing...'
                  ) : isConfirming ? (
                    'Minting...'
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

            {/* Right Column - Preview & Info */}
            <div className="space-y-6">
              {/* NFT Preview */}
              <Card className="p-6 shadow-xl border-2 border-gray-100">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FileText size={20} />
                  Preview
                </h3>
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl aspect-square mb-4 flex items-center justify-center overflow-hidden relative">
                  {imagePreview ? (
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  ) : (
                    <ImagePlus className="text-gray-400" size={80} />
                  )}
                </div>
                <h4 className="font-bold text-lg mb-2">
                  {description.split('\n')[0] || 'NFT Name'}
                </h4>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {description || 'NFT description will appear here...'}
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

              {/* Guidelines */}
              <Card className="p-6 bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 border-2 border-primary-200 shadow-xl">
                <h3 className="text-lg font-bold mb-4 text-primary-900 flex items-center gap-2">
                  <AlertCircle size={20} />
                  {isAdmin ? 'Minting Guidelines' : 'Submission Guidelines'}
                </h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-primary-600 flex-shrink-0 mt-0.5" />
                    <span>High quality images recommended (min 1000x1000px)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-primary-600 flex-shrink-0 mt-0.5" />
                    <span>Write a clear and compelling description</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-primary-600 flex-shrink-0 mt-0.5" />
                    <span>Add relevant attributes for better discoverability</span>
                  </li>
                  {!isAdmin && (
                    <>
                      <li className="flex items-start gap-3">
                        <Clock size={18} className="text-purple-600 flex-shrink-0 mt-0.5" />
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

              {/* Copyright Notice */}
              {!isAdmin && (
                <Card className="p-6 bg-amber-50 border-2 border-amber-200">
                  <div className="flex gap-3">
                    <Shield size={24} className="text-amber-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-amber-900 mb-2">Copyright Notice</h4>
                      <p className="text-sm text-amber-800">
                        By submitting, you confirm that you own all rights to this content or have
                        permission to mint it as an NFT. Fraudulent submissions will be rejected and
                        may result in account suspension.
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        ) : (
          /* Submissions Tab (Admin only) */
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Pending Submissions</h2>

            {pendingSubmissions.length === 0 ? (
              <div className="text-center py-12">
                <Mail size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600">No pending submissions</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingSubmissions.map((submission) => (
                  <Card key={submission.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Left: Preview */}
                      <div className="w-full lg:w-64">
                        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                          {submission.imageUrl ? (
                            <Image
                              src={submission.imageUrl}
                              alt={submission.nftName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImagePlus className="text-gray-400" size={56} />
                            </div>
                          )}

                          <div className="absolute top-3 left-3">
                            <span
                              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${
                                submission.status === 'pending'
                                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                                  : submission.status === 'approved'
                                  ? 'bg-green-50 text-green-800 border-green-200'
                                  : 'bg-red-50 text-red-800 border-red-200'
                              }`}
                            >
                              {submission.status === 'pending' ? (
                                <>
                                  <Loader2 className="animate-spin" size={14} />
                                  Pending
                                </>
                              ) : submission.status === 'approved' ? (
                                <>
                                  <CheckCircle size={14} />
                                  Approved
                                </>
                              ) : (
                                <>
                                  <AlertCircle size={14} />
                                  Rejected
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Details */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              {submission.nftName}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {submission.description}
                            </p>

                            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                              <span className="inline-flex items-center gap-2 bg-gray-100 border border-gray-200 text-gray-700 px-3 py-1 rounded-full">
                                <UserIcon size={14} />
                                {submission.name}
                              </span>

                              <span className="inline-flex items-center gap-2 bg-gray-100 border border-gray-200 text-gray-700 px-3 py-1 rounded-full">
                                <Mail size={14} />
                                {submission.email}
                              </span>

                              <span className="inline-flex items-center gap-2 bg-gray-100 border border-gray-200 text-gray-700 px-3 py-1 rounded-full">
                                <Clock size={14} />
                                {submission.submittedAt instanceof Date
                                  ? submission.submittedAt.toLocaleString()
                                  : new Date(submission.submittedAt).toLocaleString()}
                              </span>

                              {!submission.termsAccepted && (
                                <span className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-1 rounded-full">
                                  <AlertCircle size={14} />
                                  Terms not accepted
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 sm:justify-end flex-wrap">
                            <Button
                              onClick={async () => {
                                setPendingSubmissions((prev) =>
                                  prev.map((s) =>
                                    s.id === submission.id ? { ...s, status: 'approved' } : s
                                  )
                                );
                                toast.success('Submission approved');
                              }}
                              className="whitespace-nowrap"
                              disabled={submission.status !== 'pending'}
                            >
                              <CheckCircle size={18} />
                              Approve
                            </Button>

                            <Button
                              variant="secondary"
                              onClick={async () => {
                                setPendingSubmissions((prev) =>
                                  prev.map((s) =>
                                    s.id === submission.id ? { ...s, status: 'rejected' } : s
                                  )
                                );
                                toast('Submission rejected', { icon: '🛑' });
                              }}
                              className="whitespace-nowrap"
                              disabled={submission.status !== 'pending'}
                            >
                              <X size={18} />
                              Reject
                            </Button>

                            <Button
                              variant="secondary"
                              onClick={() => {
                                navigator.clipboard.writeText(submission.email);
                                toast.success('Email copied');
                              }}
                              className="whitespace-nowrap"
                            >
                              <Mail size={18} />
                              Copy Email
                            </Button>
                          </div>
                        </div>

                        {/* Attributes */}
                        {submission.attributes?.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-semibold text-gray-800 mb-2">Attributes</p>
                            <div className="flex flex-wrap gap-2">
                              {submission.attributes.map((a, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-50 to-purple-50 border border-primary-200 px-3 py-1 text-xs font-medium text-gray-800"
                                >
                                  <span className="text-primary-700">{a.trait_type}:</span>
                                  <span>{a.value}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Quick Mint CTA */}
                        <div className="mt-5 rounded-2xl border border-gray-200 bg-gradient-to-r from-white to-gray-50 p-4">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <div className="bg-primary-100 p-2 rounded-xl">
                                <Zap className="text-primary-700" size={18} />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">
                                  Quick mint from this submission
                                </p>
                                <p className="text-sm text-gray-600">
                                  Prefills the Mint form (image is preview only).
                                </p>
                              </div>
                            </div>

                            <Button
                              variant="secondary"
                              onClick={() => {
                                setActiveTab('mint');
                                setDescription(submission.description || submission.nftName);
                                setAttributes(submission.attributes || []);
                                setImagePreview(submission.imageUrl || '');
                                toast.success('Prefilled mint form (image is preview only)');
                              }}
                              className="whitespace-nowrap"
                            >
                              <Zap size={18} />
                              Prefill Mint Form
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Terms Modal */}
      {showTermsModal && (
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
                  You confirm you own the content or have permission to mint it as an NFT. Submissions
                  that infringe IP/copyright will be rejected.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <p className="font-medium text-gray-900 mb-2">2) Review Process</p>
                <p>
                  Submissions are reviewed by admins. Approval is not guaranteed. You may be contacted
                  via email for clarifications.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <p className="font-medium text-gray-900 mb-2">3) Content Guidelines</p>
                <p>
                  No illegal content, impersonation, stolen artwork, or hateful/harassing material.
                  Admins may reject submissions that violate platform policies.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <p className="font-medium text-gray-900 mb-2">4) Fees & Marketplace</p>
                <p>
                  Marketplace fees may apply. Fees shown on the dashboard are subject to change via
                  contract settings.
                </p>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <AlertCircle className="text-amber-700 mt-0.5" size={18} />
                <p className="text-amber-900">
                  This is a template Terms section for UI. Replace with your legal text before
                  production.
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
              </Button>
              <Button
                onClick={() => {
                  setTermsAccepted(true);
                  setShowTermsModal(false);
                  toast.success('Terms accepted');
                }}
                className="w-full sm:w-auto"
              >
                Accept Terms
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success hint (admin mint) */}
      {isAdmin && isSuccess && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-4 w-full max-w-xl">
          <Card className="p-4 border-2 border-green-200 bg-green-50 shadow-xl">
            <div className="flex items-start gap-3">
              <CheckCircle className="text-green-600 mt-0.5" size={20} />
              <div className="flex-1">
                <p className="font-semibold text-green-900">Mint successful</p>
                <p className="text-sm text-green-800">
                  Your NFT has been minted. You can mint another one or switch to the Submissions tab.
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
      )}
    </div>
  );
}
