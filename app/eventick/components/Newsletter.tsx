import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Newsletter: React.FC = () => {
  return (
    <form 
      className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 
        bg-white rounded-full border-2 border-zinc-100 
        p-3 sm:p-2 sm:pl-6 mt-5 w-full
        shadow-lg transition-shadow hover:shadow-xl"
      onSubmit={(e) => e.preventDefault()}
    >
      <Input
        type="email"
        id="newsletter-email"
        name="email"
        required
        aria-label="Email address for newsletter"
        placeholder="Enter your email address..."
        className="border-none bg-transparent flex-1 focus:ring-0"
      />
      <Button
        type="submit"
        className="w-full sm:w-auto px-8 font-medium
          bg-pink-600 hover:bg-pink-700 transition-colors"
      >
        Subscribe
      </Button>
    </form>
  );
};
