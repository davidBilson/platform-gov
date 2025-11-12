import React from "react";
import { IoIosSearch } from "react-icons/io";

interface FirmAffiliationSectionProps {
  firmAffiliation: string;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  showFirmDropdown: boolean;
  setShowFirmDropdown: React.Dispatch<React.SetStateAction<boolean>>;
}

const firmOptions = ["Janus Global Advisors"];

export const FirmAffiliationSection = ({
  firmAffiliation,
  setFormData,
  showFirmDropdown,
  setShowFirmDropdown,
}: FirmAffiliationSectionProps) => (
  
  <div className="mb-7.5">
    <div className="flex items-center gap-2.5 text-boldblue text-sm">

      <div className="flex items-center gap-2.5 mb-2.5">
        <input
          type="radio"
          id="independent"
          name="firmAffiliation"
          value="independent"
          checked={firmAffiliation === "independent"}
          onChange={() => setFormData((prev: any) => ({ ...prev, firmAffiliation: "independent" }))}
        />
        <label htmlFor="independent">Independent</label>
      </div>

      <div className="flex items-center gap-2.5 mb-2.5">
        <input
          type="radio"
          id="firm"
          name="firmAffiliation"
          value="firm"
          checked={firmAffiliation !== "independent"}
          onChange={() => setFormData((prev: any) => ({ ...prev, firmAffiliation: "" }))}
        />
        <label htmlFor="firm">Firm Affiliation</label>
      </div>

    </div>

    {firmAffiliation !== "independent" && (
      <div className="relative w-full md:max-w-75">
        <div className="flex justify-between border border-boldblue rounded-lg w-full px-5 py-4 text-sm text-boldblue">
          <input
            type="text"
            value={firmAffiliation}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, firmAffiliation: e.target.value }))}
            onFocus={() => setShowFirmDropdown(true)}
            onBlur={() => setTimeout(() => setShowFirmDropdown(false), 200)}
            className="outline-none placeholder:font-semibold w-[80%]"
            placeholder="Firm name"
          />
          <IoIosSearch />
        </div>

        {showFirmDropdown && (
          <div
            className="absolute z-20 w-full mt-1 bg-white border border-boldblue rounded-lg shadow-lg max-h-48 overflow-y-scroll dropdown-scrollbar"
            onMouseDown={(e) => e.preventDefault()}
          >
            {firmOptions
              .filter((firm) =>
                firmAffiliation
                  ? firm.toLowerCase().includes(firmAffiliation.toLowerCase())
                  : true
              )
              .map((firm, idx) => (
                <div
                  key={`firm-option-${idx}`}
                  className="px-4 py-2 hover:bg-deepskyblue hover:text-white cursor-pointer text-sm"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setFormData((prev: any) => ({
                      ...prev,
                      firmAffiliation: firm,
                    }));
                    setShowFirmDropdown(false);
                  }}
                >
                  {firm}
                </div>
              ))}
          </div>
        )}
      </div>
    )}
  </div>
);