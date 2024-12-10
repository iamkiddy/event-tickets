import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeletePromotionAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  promotionCode: string;
}

export function DeletePromotionAlert({
  isOpen,
  onClose,
  onConfirm,
  promotionCode
}: DeletePromotionAlertProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white">
        <div className="flex justify-between items-start">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the promotion "{promotionCode}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 rounded-md"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 