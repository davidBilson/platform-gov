import React from "react";
import { IoIosSearch } from "react-icons/io";
import { clearanceLevels } from "@/utils/govtAgencyAndClearanceIndex/departmentAgenciesClearances";

interface ClearanceSectionProps {
  clearance: string;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  showClearancesDropdown: boolean;
  setShowClearancesDropdown: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ClearanceSection: React.FC<ClearanceSectionProps> = ({
  clearance,
  setFormData,
  showClearancesDropdown,
  setShowClearancesDropdown,
}) => (
  <div className="relative w-full md:max-w-75 mb-7.5">
    <div className="flex justify-between border border-boldblue rounded-lg w-full px-5 py-4 text-sm text-boldblue">
      <input
        type="text"
        value={clearance || ""}
        onChange={(e) => setFormData((prev: any) => ({ ...prev, clearance: e.target.value }))}
        onFocus={() => setShowClearancesDropdown(true)}
        onBlur={() => setTimeout(() => setShowClearancesDropdown(false), 200)}
        className="outline-none placeholder:font-semibold w-[80%]"
        placeholder="Previously held clearances"
      />
      <IoIosSearch />
    </div>

    {showClearancesDropdown && (
      <div
        className="absolute z-20 w-full mt-1 bg-white border border-boldblue rounded-lg shadow-lg max-h-48 overflow-y-scroll dropdown-scrollbar"
        onMouseDown={(e) => e.preventDefault()}
      >
        {clearanceLevels
          .filter((clearanceLevel) =>
            clearance
              ? clearanceLevel.toLowerCase().includes(clearance.toLowerCase())
              : true
          )
          .map((clearanceLevel, idx) => (
            <div
              key={`clearance-option-${idx}`}
              className="px-4 py-2 hover:bg-deepskyblue hover:text-white cursor-pointer text-sm"
              onMouseDown={(e) => {
                e.preventDefault();
                setFormData((prev: any) => ({
                  ...prev,
                  clearance: clearanceLevel,
                }));
                setShowClearancesDropdown(false);
              }}
            >
              {clearanceLevel}
            </div>
          ))}
      </div>
    )}
  </div>
);