import React, { useEffect, useState } from 'react';
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X, CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  position?: 'center' | 'top';
}

const typeStyles = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-100',
    text: 'text-green-800',
    icon: CheckCircle2,
    iconColor: 'text-green-600'
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-100',
    text: 'text-red-800',
    icon: XCircle,
    iconColor: 'text-red-600'
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    text: 'text-amber-800',
    icon: AlertTriangle,
    iconColor: 'text-amber-600'
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    text: 'text-blue-800',
    icon: Info,
    iconColor: 'text-blue-600'
  }
};

export function NotificationDialog({
  open,
  onClose,
  title,
  description,
  type = 'info',
  duration,
  position = 'center'
}: NotificationDialogProps) {
  const [isVisible, setIsVisible] = useState(open);
  const styles = typeStyles[type];

  useEffect(() => {
    setIsVisible(open);
    if (duration && open) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration, onClose]);

  return (
    <AlertDialog open={isVisible}>
      <AlertDialogContent 
        className={cn(
          "w-full max-w-md",
          "p-4 rounded-lg",
          "border shadow-sm",
          styles.bg,
          styles.border,
          "dark:bg-gray-800 dark:border-gray-700",
          position === 'top' ? "fixed top-4 left-1/2 transform -translate-x-1/2" :
          "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        )}
      >
        <div className="flex gap-3">
          {React.createElement(styles.icon, {
            className: cn("w-5 h-5 mt-0.5", styles.iconColor)
          })}
          
          <div className="flex-1">
            {title && (
              <h2 className={cn(
                "text-base font-medium mb-1",
                styles.text,
                "dark:text-gray-100"
              )}>
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {description}
              </p>
            )}
          </div>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose} 
            className="h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-4 h-4 text-gray-500" />
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}