import useAuthStore from "@/store/useAuth";
import React, { ChangeEvent } from "react";

interface BioSectionProps {
  bio: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  handleTextAreaInput: () => void;
}

export const BioSection = ({
  bio,
  handleInputChange,
  textareaRef,
  handleTextAreaInput,
}: BioSectionProps) => {
  
  const { isSubscribed } = useAuthStore();
  const maxLength = isSubscribed ? 1500 : 300;
  const showSubscriptionPrompt = !isSubscribed && bio.length >= 300;

  return (
    <div className="mb-7.5 pb-7.5 border-b border-b-deepskyblue">
      <textarea
        ref={textareaRef}
        name="bio"
        value={bio}
        onChange={handleInputChange}
        onInput={handleTextAreaInput}
        maxLength={maxLength}
        rows={1}
        className="block text-sm text-boldblue border border-boldblue rounded-lg min-h-fit w-full max-w-275 px-5 py-4 focus:outline focus:outline-boldblue resize-none overflow-hidden scrollbar-hide"
        placeholder="About Me/Bio"
      />
      <div className="flex justify-between items-center text-xs mt-1">
        <div className="text-left font-semibold">
          {showSubscriptionPrompt && (
            <span className="text-deepskyblue text-xs">
              Increase character count to 1500 with monthly premium membership
            </span>
          )}
        </div>
        <div className="text-gray-500">
          {bio.length}/{maxLength}
        </div>
      </div>
    </div>
  );
};