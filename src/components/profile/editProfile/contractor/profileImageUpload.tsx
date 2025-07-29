import React, { ChangeEvent } from "react";
import { IoMdImages } from "react-icons/io";
import { MdEdit } from "react-icons/md";

interface ProfileImageUploadProps {
  profileImageUrl: string;
  handleProfileImageClick: () => void;
  handleProfileImageChange: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  profileImageUrl,
  handleProfileImageClick,
  handleProfileImageChange,
  fileInputRef,
}) => (
  <div className="relative w-22 h-22 bg-gray-300 border border-boldblue rounded-full flex items-center justify-center mx-auto sm:mx-0">
    <div className="w-[88px] rounded-full h-[88px] overflow-hidden absolute flex items-center justify-center">
      {profileImageUrl ? (
        <img
          src={profileImageUrl}
          alt="Profile"
          className="w-full h-full object-cover object-center"
        />
      ) : (
        <IoMdImages size={40} className="text-white/70" />
      )}
    </div>
    <button
      type="button"
      onClick={handleProfileImageClick}
      className="absolute bottom-0 right-0 z-20 h-7 w-7 bg-white rounded-full flex items-center justify-center border border-boldblue"
    >
      <MdEdit size={14} className="text-boldblue" />
    </button>
    <input
      type="file"
      ref={fileInputRef}
      onChange={handleProfileImageChange}
      accept="image/*"
      className="hidden"
    />
  </div>
);