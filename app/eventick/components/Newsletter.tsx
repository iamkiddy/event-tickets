import * as React from "react";

export const Newsletter: React.FC = () => {
  return (
    <form className="flex flex-col sm:flex-row gap-4 sm:gap-10 p-4 sm:py-2 sm:pr-2 sm:pl-7 
      mt-5 w-full text-sm sm:text-base bg-white border-2 border-solid border-zinc-100 
      rounded-[46px] shadow-[8px_15px_38px_rgba(0,0,0,0.15)]">
      <input
        type="email"
        id="email"
        placeholder="Enter your email address.."
        className="grow shrink my-auto text-neutral-400 w-full border-none bg-transparent"
      />
      <button
        type="submit"
        className="w-full sm:w-auto gap-2 px-6 sm:px-8 py-3 sm:py-4 tracking-wider 
          text-white bg-pink-600 border-white rounded-[50px] 
          shadow-[0px_10px_50px_rgba(61,55,241,0.25)] hover:bg-pink-700 
          transition-colors"
      >
        Subscribe Now
      </button>
    </form>
  );
};
