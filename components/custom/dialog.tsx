import React, { useEffect, useState } from 'react';
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X, AlertCircle, CheckCircle2, Info, XCircle, AlertTriangle } from "lucide-react";
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
    bgColor: 'bg-green-100',
    textColor: 'text-green-600',
    bgAlert: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: CheckCircle2
  },
  error: {
    bgColor: 'bg-red-100',
    textColor: 'text-red-600',
    bgAlert: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: XCircle
  },
  warning: {
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-600',
    bgAlert: 'bg-orange-50',
    borderColor: 'border-orange-200',
    icon: AlertTriangle
  },
  info: {
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-600',
    bgAlert: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: Info
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
          "w-full max-w-md bg-white/90 backdrop-blur-sm shadow-lg border-0",
          "p-8 rounded-2xl transition-all duration-200 ease-out",
          "dark:bg-gray-900/90 dark:text-white",
          position === 'top' ? "fixed top-4 left-1/2 transform -translate-x-1/2" :
          "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        )}
      >
        <div className="flex justify-between items-start space-x-4">
          <div className="flex-1">
            {title && (
              <div className="flex items-center gap-2 mb-3">
                {React.createElement(styles.icon, {
                  className: cn("h-5 w-5", styles.textColor)
                })}
                <h2 className={cn("text-xl font-semibold tracking-tight", styles.textColor)}>
                  {title}
                </h2>
              </div>
            )}
            {description && (
              <div className={cn(
                "p-4 rounded-xl",
                "border border-opacity-50 backdrop-blur-sm",
                "transition-all duration-200",
                styles.bgAlert,
                styles.borderColor
              )}>
                <p className={cn("text-sm leading-relaxed", styles.textColor)}>
                  {description}
                </p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-full hover:bg-gray-100/50",
              "dark:hover:bg-gray-800/50",
              styles.textColor
            )}
            onClick={() => {
              setIsVisible(false);
              onClose();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}