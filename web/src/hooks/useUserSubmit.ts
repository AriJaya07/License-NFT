"use client";

import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";
import emailjs from "@emailjs/browser";

import { useMarketplaceFee, useMyNFTRead } from "@/src/hooks/useReadContract";
import { useNFT } from "@/src/hooks/useNFT";
import { uploadImageToPinata, uploadMetadataToPinata } from "@/src/hooks/ipfs";

export interface Attribute {
  trait_type: string;
  value: string;
}

export interface PendingSubmission {
  id: string;
  name: string;
  email: string;
  nftName: string;
  description: string;
  imageUrl: string;
  attributes: Attribute[];
  status: "pending" | "approved" | "rejected";
  submittedAt: Date;
  termsAccepted: boolean;
}

// Add this to your environment variables
const ADMIN_ADDRESSES =
  process.env.NEXT_PUBLIC_ADMIN_ADDRESSES?.split(",") || [];

export function useUserSubmit() {
  const { address, isConnected } = useAccount();
  const { mint, isConfirming, isSuccess } = useNFT();
  const marketplaceFee = useMarketplaceFee();
  const { data: totalSupply } = useMyNFTRead();

  // Check if user is admin
  const isAdmin = useMemo(() => {
    return ADMIN_ADDRESSES.some(
      (admin) => admin.toLowerCase() === address?.toLowerCase()
    );
  }, [address]);

  // Form state
  const [activeTab, setActiveTab] = useState<"mint" | "submissions">("mint");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [currentAttribute, setCurrentAttribute] = useState({
    trait_type: "",
    value: "",
  });
  const [uploading, setUploading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [copyrightAccepted, setCopyrightAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Pending submissions (in production, this would come from a database)
  const [pendingSubmissions, setPendingSubmissions] = useState<
    PendingSubmission[]
  >([]);

  // EmailJS configuration
  const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
  const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "";
  const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";

  // Initialize EmailJS
  useEffect(() => {
    if (EMAILJS_PUBLIC_KEY) {
      emailjs.init(EMAILJS_PUBLIC_KEY);
    }
  }, [EMAILJS_PUBLIC_KEY]);

  // Handle image selection (SAME NAME)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size must be less than 10MB");
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

  // Add attribute (SAME NAME)
  const addAttribute = () => {
    if (currentAttribute.trait_type && currentAttribute.value) {
      setAttributes([...attributes, currentAttribute]);
      setCurrentAttribute({ trait_type: "", value: "" });
    }
  };

  // Remove attribute (SAME NAME)
  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  // Handle submission for non-admin users (SAME NAME)
  const handleSubmitRequest = async () => {
    if (!name || !email || !description || !image) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!termsAccepted || !copyrightAccepted) {
      toast.error("Please accept the terms and copyright policy");
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setUploading(true);
    const loadingToast = toast.loading("Submitting your NFT request...");

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;

        // Prepare submission data
        const submissionData = {
          from_name: name,
          from_email: email,
          nft_name: description.split("\n")[0] || "Untitled NFT",
          nft_description: description,
          attributes: JSON.stringify(attributes),
          submission_date: new Date().toLocaleString(),
          image_preview: base64Image.substring(0, 100) + "...",
        };

        // Send email using EmailJS
        const result = await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          submissionData
        );

        if (result.status === 200) {
          toast.success("Request submitted successfully!", {
            id: loadingToast,
          });
          toast.success(
            "Admin will review your submission and contact you via email",
            {
              duration: 5000,
            }
          );

          // OPTIONAL UI: store local pending submission (so admin can see it in Submissions tab)
          setPendingSubmissions((prev) => [
            {
              id: `${Date.now()}`,
              name,
              email,
              nftName: description.split("\n")[0] || "Untitled NFT",
              description,
              imageUrl: imagePreview || "",
              attributes,
              status: "pending",
              submittedAt: new Date(),
              termsAccepted,
            },
            ...prev,
          ]);

          // Reset form
          setName("");
          setEmail("");
          setDescription("");
          setImage(null);
          setImagePreview("");
          setAttributes([]);
          setTermsAccepted(false);
          setCopyrightAccepted(false);
        }
      };

      reader.readAsDataURL(image);
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error("Failed to submit request. Please try again.", {
        id: loadingToast,
      });
    } finally {
      setUploading(false);
    }
  };

  // Handle mint NFT (Admin only) (SAME NAME)
  const handleMintNFT = async () => {
    if (!address || !isConnected || !isAdmin) {
      toast.error("Only admin can mint NFTs");
      return;
    }

    if (!description || !image) {
      toast.error("Please fill all required fields");
      return;
    }

    setUploading(true);
    const loadingToast = toast.loading("Uploading to IPFS...");

    try {
      // 1. Upload image to IPFS
      const imageHash = await uploadImageToPinata(image);
      toast.success("Image uploaded to IPFS!");

      // 2. Create metadata
      const metadata = {
        name: description.split("\n")[0] || "NFT",
        description,
        image: `ipfs://${imageHash}`,
        attributes: attributes.length > 0 ? attributes : undefined,
      };

      // 3. Upload metadata to IPFS
      toast.loading("Uploading metadata...", { id: loadingToast });
      const metadataHash = await uploadMetadataToPinata(metadata);
      toast.success("Metadata uploaded!", { id: loadingToast });

      // 4. Mint NFT
      toast.loading("Minting NFT...", { id: loadingToast });
      await mint(address, metadataHash);

      toast.success("NFT minted successfully!", { id: loadingToast });

      // Reset form
      setDescription("");
      setImage(null);
      setImagePreview("");
      setAttributes([]);
    } catch (error: any) {
      console.error("Minting error:", error);
      toast.error(error.message || "Failed to mint NFT", { id: loadingToast });
    } finally {
      setUploading(false);
    }
  };

  return {
    // wagmi + role
    address,
    isConnected,
    isAdmin,

    // contract reads
    marketplaceFee,
    totalSupply,

    // mint hook flags
    isConfirming,
    isSuccess,

    // form state
    activeTab,
    setActiveTab,
    name,
    setName,
    email,
    setEmail,
    description,
    setDescription,
    image,
    setImage,
    imagePreview,
    setImagePreview,
    attributes,
    setAttributes,
    currentAttribute,
    setCurrentAttribute,
    uploading,
    setUploading,
    termsAccepted,
    setTermsAccepted,
    copyrightAccepted,
    setCopyrightAccepted,
    showTermsModal,
    setShowTermsModal,

    // submissions
    pendingSubmissions,
    setPendingSubmissions,

    // handlers (same names)
    handleImageChange,
    addAttribute,
    removeAttribute,
    handleSubmitRequest,
    handleMintNFT,
  };
}
