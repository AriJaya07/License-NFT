import { useEffect } from "react";
import { Alert } from "../../UI/Alert";
import { Wallet, Image, ShieldCheck, Tag } from "lucide-react";

// Toast Notification Component
interface ToastProps {
  show: boolean;
  type: "success" | "error" | "info" | "";
  title: string;
  message: string;
  onClose: () => void;
}

interface StepIndicatorProps {
  currentStep: number;
}

export const Toast = ({ show, type, title, message, onClose }: ToastProps) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300 ${
        !show ? "animate-out slide-out-to-top-2 fade-out" : ""
      }`}
    >
      <Alert type={type} title={title} message={message} className="my-4" />
    </div>
  );
};

export const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  const steps = [
    { id: 1, label: "Connect", icon: Wallet },
    { id: 2, label: "Select NFT", icon: Image },
    { id: 3, label: "Approve", icon: ShieldCheck },
    { id: 4, label: "List", icon: Tag },
  ];

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                currentStep >= step.id
                  ? "bg-gradient-to-br from-indigo-600 to-blue-500 text-white shadow-lg shadow-indigo-500/30"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <step.icon className="w-5 h-5" />
            </div>
            <span
              className={`mt-2 text-sm font-medium transition-colors ${
                currentStep >= step.id
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-16 md:w-24 h-1 mx-2 rounded-full transition-all duration-500 ${
                currentStep > step.id
                  ? "bg-gradient-to-r from-indigo-600 to-blue-500"
                  : "bg-muted"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};
