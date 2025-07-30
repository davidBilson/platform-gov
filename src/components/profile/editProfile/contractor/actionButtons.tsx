import React from "react";
import { useRouter } from 'next/router';

interface ActionButtonsProps {
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  handlePreview: () => void;
}

export const ActionButtons = ({
  isLoading,
  handleSubmit,
  handlePreview,
}: ActionButtonsProps) => {
  const router = useRouter();

  return (
    <section className="flex items-center justify-center gap-1.5 md:gap-2.5 py-7.5 px-2 md:px-6 fixed bottom-0 left-0 bg-skyblue w-full border-t border-t-boldblue">
      <button
        type="button"
        onClick={() => router.push('/')}
        className="cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out py-3 px-5 border bg-white border-boldblue text-boldblue text-xs md:text-sm font-semibold rounded-lg"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={handlePreview}
        className="cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out  py-3 px-5 border bg-white border-boldblue text-boldblue text-xs md:text-sm font-semibold rounded-lg"
      >
        Preview Public View
      </button>
      <button
        type="submit"
        disabled={isLoading}
        onClick={handleSubmit}
        className="cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out py-3 px-5 bg-boldblue text-white text-xs md:text-sm font-semibold rounded-lg border border-boldblue"
      >
        {isLoading ? "Saving..." : "Save"}
      </button>
    </section>
  );
};