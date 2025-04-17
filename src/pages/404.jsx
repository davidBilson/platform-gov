"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-[60vh] flex items-start justify-center px-4 py-8">
      <div className=" p-8 md:p-12 text-center max-w-md w-full">
        <div className="flex justify-center mb-6">
          <AlertTriangle
            size={80} 
            className="text-orange"
          />
        </div>
        <h1 className="text-3xl font-bold text-darkgreen mb-4">
          Page Not Found
        </h1>
        <p className="text-darkgreen mb-6">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <button 
          onClick={() => router.back()}
          className="
            w-full 
            bg-green 
            text-white 
            py-3 
            rounded-lg 
            hover:bg-darkgreen 
            transition-colors 
            duration-300
          "
        >
          Go Back
        </button>
      </div>
    </div>
  );
}