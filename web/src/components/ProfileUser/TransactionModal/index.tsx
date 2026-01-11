import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Button } from "../../UI/Button";
import { Card } from "../../UI/Card";

interface TransactionModalProps {
  show: boolean;
  status: "loading" | "success" | "error" | "";
  title: string;
  message: string;
  txHash: string;
  onClose: () => void;
}
export default function TransactionModal({
  show,
  status,
  title,
  message,
  txHash,
  onClose,
}: TransactionModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-full max-w-md mx-4 shadow-2xl border-2 border-primary/20">
        <div className="pt-6 text-center">
          {status === "loading" && (
            <>
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center animate-pulse">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {title}
              </h3>
              <p className="text-muted-foreground mb-4">{message}</p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Waiting for confirmation...</span>
              </div>
            </>
          )}
          {status === "success" && (
            <>
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {title}
              </h3>
              <p className="text-muted-foreground mb-4">{message}</p>
              {txHash && (
                <div className="bg-muted/50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-muted-foreground mb-1">
                    Transaction Hash
                  </p>
                  <code className="text-xs text-foreground break-all">
                    {txHash}
                  </code>
                </div>
              )}
              <Button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-400 hover:from-emerald-600 hover:to-green-500"
              >
                Continue
              </Button>
            </>
          )}
          {status === "error" && (
            <>
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500 to-rose-400 flex items-center justify-center">
                <XCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {title}
              </h3>
              <p className="text-muted-foreground mb-4">{message}</p>
              <Button onClick={onClose} variant="primary" className="w-full">
                Try Again
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
