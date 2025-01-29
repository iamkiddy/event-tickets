import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getNewsletterUtils } from "@/lib/actions/main";
import { NotificationDialog } from "@/components/custom/dialog";

export const Newsletter: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [dialog, setDialog] = React.useState({
    open: false,
    title: "",
    description: "",
    type: "info" as "success" | "error" | "info" | "warning"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setDialog({
        open: true,
        title: "Error",
        description: "Please enter your email address",
        type: "error"
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setDialog({
        open: true,
        title: "Error",
        description: "Please enter a valid email address",
        type: "error"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await getNewsletterUtils({
        email: email.trim()
      });
      
      setDialog({
        open: true,
        title: "Success",
        description: response.message || "Successfully subscribed to newsletter!",
        type: "success"
      });
      setEmail("");
    } catch (error) {
      setDialog({
        open: true,
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to subscribe to newsletter",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form 
        className="flex flex-col sm:flex-row items-center gap-2 xs:gap-3 sm:gap-6 
          bg-white rounded-xl xs:rounded-2xl sm:rounded-full border-2 border-zinc-100 
          p-3 xs:p-4 sm:p-2 sm:pl-6 mt-3 xs:mt-5 w-full max-w-xl mx-auto
          shadow-lg transition-shadow hover:shadow-xl"
        onSubmit={handleSubmit}
      >
        <Input
          type="email"
          id="newsletter-email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-label="Email address for newsletter"
          placeholder="Enter your email address..."
          className="border-none bg-transparent flex-1 focus:ring-0 shadow-none 
            text-xs xs:text-sm sm:text-base w-full placeholder:text-xs 
            placeholder:xs:text-sm placeholder:sm:text-base"
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto px-4 xs:px-6 sm:px-8 py-2 xs:py-2.5 text-sm xs:text-base
            bg-secondaryColor hover:bg-secondaryColor/90 text-white 
            transition-colors rounded-lg xs:rounded-xl sm:rounded-full"
        >
          {isLoading ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>
      <NotificationDialog
        open={dialog.open}
        onClose={() => setDialog(prev => ({ ...prev, open: false }))}
        title={dialog.title}
        description={dialog.description}
        type={dialog.type}
        duration={3000}
        position="center"
      />
    </>
  );
};
