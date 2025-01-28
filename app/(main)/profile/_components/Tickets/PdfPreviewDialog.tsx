import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { viewTicketsPdf } from "@/lib/actions/orders";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PdfPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string | undefined;
  userId: string | undefined;
}

export function PdfPreviewDialog({ isOpen, onClose, orderId, userId }: PdfPreviewDialogProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPdf = async () => {
      if (isOpen && orderId && userId) {
        try {
          setLoading(true);
          const response = await viewTicketsPdf(orderId, userId);
          setPdfUrl(response.qrCode || null);
        } catch (error) {
          console.error('Error fetching PDF:', error);
          toast.error('Failed to load PDF. Please try again.');
          onClose();
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPdf();
  }, [isOpen, orderId, userId, onClose]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[90vw] h-[90vh] p-0">
        <div className="w-full h-full">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primaryColor" />
            </div>
          ) : pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="w-full h-full rounded-lg"
              title="PDF Preview"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              Failed to load PDF
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 