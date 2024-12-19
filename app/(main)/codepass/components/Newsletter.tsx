import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getNewsletterUtils } from "@/lib/actions/main";
import { toast } from "sonner";

export const Newsletter: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const response = await getNewsletterUtils({
        email: email.trim()
      });
      
      toast.success(response.message || "Successfully subscribed to newsletter!");
      setEmail("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to subscribe to newsletter");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
  );
};
