import React, { ChangeEvent } from "react";


interface BioSectionProps {
  bio: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  handleTextAreaInput: () => void;
}

export const BioSection: React.FC<BioSectionProps> = ({
  bio,
  handleInputChange,
  textareaRef,
  handleTextAreaInput,
}) => (
  <div className="mb-7.5 pb-7.5 border-b border-b-deepskyblue">
    <textarea
      ref={textareaRef}
      name="bio"
      value={bio}
      onChange={handleInputChange}
      onInput={handleTextAreaInput}
      maxLength={1500}
      rows={1}
      className="block text-sm text-boldblue border border-boldblue rounded-lg min-h-fit w-full max-w-275 px-5 py-4 focus:outline focus:outline-boldblue resize-none overflow-hidden scrollbar-hide"
      placeholder="About Me/Bio"
    ></textarea>
    <div className="text-right text-xs text-gray-500 mt-1">
      {bio.length}/1500
    </div>
  </div>
);