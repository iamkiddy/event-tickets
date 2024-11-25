import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Newsletter: React.FC = () => {
  return (
    <form 
      className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 
        bg-white rounded-2xl sm:rounded-full border-2 border-zinc-100 
        p-4 sm:p-2 sm:pl-6 mt-5 w-full max-w-xl mx-auto
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
        className="border-none bg-transparent flex-1 focus:ring-0 shadow-none 
          text-sm sm:text-base w-full"
      />
      <Button
        type="submit"
        className="w-full sm:w-auto px-6 sm:px-8 py-2.5 font-medium
          bg-pink-600 hover:bg-pink-700 transition-colors rounded-xl sm:rounded-full"
      >
        Subscribe
      </Button>
    </form>
  );
};
