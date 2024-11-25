import * as React from "react";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface LoginAlertProps {
  open: boolean;
  onClose: () => void;
}

export const LoginAlert: React.FC<LoginAlertProps> = ({ open, onClose }) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
        w-full max-w-md bg-white shadow-2xl border-gray-200 p-6 rounded-xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <AlertDialogTitle className="text-2xl font-bold text-gray-900">
              Welcome back
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-1 text-sm text-gray-600">
              Sign in to access your account
            </AlertDialogDescription>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-400 hover:text-gray-500"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          <Button
            className="w-full bg-white text-gray-700 border hover:bg-gray-50 
              flex items-center justify-center gap-3"
            variant="outline"
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              className="w-full"
            />
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
              Continue with Email
            </Button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
