import React, { ChangeEvent } from "react";
import { IoIosSearch } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";

interface TagsSectionProps {
  type: 'skills' | 'expertise' | 'certifications';
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  tags: string[];
  addTag: (type: 'skills' | 'expertise' | 'certifications', value: string) => void;
  removeTag: (type: 'skills' | 'expertise' | 'certifications', index: number) => void;
  showDropdown: boolean;
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  filteredOptions: string[];
  placeholder: string;
  bgColor: string;
}

export const TagsSection: React.FC<TagsSectionProps> = ({
  type,
  inputValue,
  setInputValue,
  tags,
  addTag,
  removeTag,
  showDropdown,
  setShowDropdown,
  filteredOptions,
  placeholder,
  bgColor,
}) => (
  <div className="flex flex-wrap items-center gap-2.5">
    <div className="relative w-full max-w-75">
      <div className="flex justify-between border border-boldblue rounded-lg w-full px-5 py-4 text-sm text-boldblue">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => {
            setShowDropdown(true);
          }}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (inputValue) addTag(type, inputValue);
            }
          }}
          className="outline-none placeholder:font-semibold w-[80%]"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => {
            if (inputValue) addTag(type, inputValue);
          }}
          className="focus:outline-none"
        >
          <IoIosSearch />
        </button>
      </div>

      {showDropdown && (
        <div
          className="absolute z-20 w-full mt-1 bg-white border border-boldblue rounded-lg shadow-lg max-h-48 overflow-y-scroll dropdown-scrollbar"
          onMouseDown={(e) => e.preventDefault()}
        >
          {filteredOptions.map((option, idx) => (
            <div
              key={`${type}-option-${idx}`}
              className="px-4 py-2 hover:bg-deepskyblue hover:text-white cursor-pointer text-sm"
              onMouseDown={(e) => {
                e.preventDefault();
                addTag(type, option);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>

    {tags.map((tag, index) => (
      <div
        key={`${type}-${index}`}
        className={`flex flex-row justify-between items-center px-2.5 py-1.25 gap-2.5 ${bgColor} rounded-[37px] text-xs text-white`}
      >
        {tag}
        <button
          type="button"
          onClick={() => removeTag(type, index)}
          className="font-semibold text-sm ml-1 focus:outline-none cursor-pointer transition transform active:scale-95 hover:text-red-500"
        >
          <IoCloseOutline size={16} />
        </button>
      </div>
    ))}
  </div>
);