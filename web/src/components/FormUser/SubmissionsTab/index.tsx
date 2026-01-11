import { Attribute, PendingSubmission } from "@/src/hooks/useUserSubmit";
import { Card } from "../../UI/Card";
import { AlertCircle, CheckCircle, Clock, ImagePlus, Loader2, Mail, UserIcon, X, Zap } from "lucide-react";
import Image from "next/image";
import { Button } from "../../UI/Button";
import toast from "react-hot-toast";

export function SubmissionsTab(props: {
    pendingSubmissions: PendingSubmission[];
    setPendingSubmissions: React.Dispatch<React.SetStateAction<PendingSubmission[]>>;
    setActiveTab: (v: "mint" | "submissions") => void;
  
    // used by Prefill button
    setDescription: (v: string) => void;
    setAttributes: (v: Attribute[]) => void;
    setImagePreview: (v: string) => void;
  }) {
    const {
      pendingSubmissions,
      setPendingSubmissions,
      setActiveTab,
      setDescription,
      setAttributes,
      setImagePreview,
    } = props;
  
    return (
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
                            submission.status === "pending"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : submission.status === "approved"
                              ? "bg-green-50 text-green-800 border-green-200"
                              : "bg-red-50 text-red-800 border-red-200"
                          }`}
                        >
                          {submission.status === "pending" ? (
                            <>
                              <Loader2 className="animate-spin" size={14} />
                              Pending
                            </>
                          ) : submission.status === "approved" ? (
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
                                s.id === submission.id ? { ...s, status: "approved" } : s
                              )
                            );
                            toast.success("Submission approved");
                          }}
                          className="whitespace-nowrap"
                          disabled={submission.status !== "pending"}
                        >
                          <CheckCircle size={18} />
                          Approve
                        </Button>
  
                        <Button
                          variant="secondary"
                          onClick={async () => {
                            setPendingSubmissions((prev) =>
                              prev.map((s) =>
                                s.id === submission.id ? { ...s, status: "rejected" } : s
                              )
                            );
                            toast("Submission rejected", { icon: "🛑" });
                          }}
                          className="whitespace-nowrap"
                          disabled={submission.status !== "pending"}
                        >
                          <X size={18} />
                          Reject
                        </Button>
  
                        <Button
                          variant="secondary"
                          onClick={() => {
                            navigator.clipboard.writeText(submission.email);
                            toast.success("Email copied");
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
                        <p className="text-sm font-semibold text-gray-800 mb-2">
                          Attributes
                        </p>
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
                            setActiveTab("mint");
                            setDescription(submission.description || submission.nftName);
                            setAttributes(submission.attributes || []);
                            setImagePreview(submission.imageUrl || "");
                            toast.success("Prefilled mint form (image is preview only)");
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
    );
  }
  