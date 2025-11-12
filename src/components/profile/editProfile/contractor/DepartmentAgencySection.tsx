import React from "react";
import { IoIosSearch } from "react-icons/io";
import { GovernmentDepartmentsAndAgenciesByCountry } from "@/utils/feedFilter/GovernmentDepartmentsAndAgenciesByCountry";
import { IoCloseOutline } from "react-icons/io5";

interface DepartmentAgencySectionProps {
  departments: string[];
  departmentInput: string;
  setDepartmentInput: React.Dispatch<React.SetStateAction<string>>;
  showDepartmentDropdown: boolean;
  setShowDepartmentDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  addDepartment: (value: string) => void;
  removeDepartment: (index: number) => void;
}

export const DepartmentAgencySection = ({
  departments,
  departmentInput,
  setDepartmentInput,
  showDepartmentDropdown,
  setShowDepartmentDropdown,
  addDepartment,
  removeDepartment,
}: DepartmentAgencySectionProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && departmentInput.trim()) {
      e.preventDefault();
      addDepartment(departmentInput.trim());
    }
  };

  const filteredDepartments = GovernmentDepartmentsAndAgenciesByCountry.filter(
    (dept) =>
      !departments.includes(dept) &&
      (departmentInput ? dept.toLowerCase().includes(departmentInput.toLowerCase()) : true)
  );

  return (
    <div className="mb-7.5">
      <h3 className="mb-5 font-semibold text-black text-lg">
        Department/Agency Expertise
      </h3>
      <p className="text-sm text-gray-600 mb-4">(Optional)</p>

      <div className="relative w-full md:max-w-[500px] mb-5">
        <div className="relative flex justify-between border border-boldblue rounded-lg w-full px-5 py-4 text-sm text-boldblue">
          <input
            type="text"
            value={departmentInput}
            onChange={(e) => setDepartmentInput(e.target.value)}
            onFocus={() => setShowDepartmentDropdown(true)}
            onBlur={() => setTimeout(() => setShowDepartmentDropdown(false), 200)}
            onKeyDown={handleKeyDown}
            className="outline-none placeholder:font-semibold w-[90%]"
            placeholder="Select from dropdown or type your own"
          />
          <IoIosSearch />
        </div>

        {showDepartmentDropdown && filteredDepartments.length > 0 && (
          <div
            className="absolute z-20 w-full mt-1 bg-white border border-boldblue rounded-lg shadow-lg max-h-48 overflow-y-scroll dropdown-scrollbar"
            onMouseDown={(e) => e.preventDefault()}
          >
            {filteredDepartments.map((dept, idx) => (
              <div
                key={`dept-option-${idx}`}
                className="px-4 py-2 hover:bg-deepskyblue hover:text-white cursor-pointer text-sm"
                onMouseDown={(e) => {
                  e.preventDefault();
                  addDepartment(dept);
                  setShowDepartmentDropdown(false);
                }}
              >
                {dept}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2.5">
        {departments.map((dept, index) => (
          <div
            key={`dept-tag-${index}`}
            className={`flex flex-row justify-between items-center px-2.5 py-1.25 gap-2.5 bg-deepskyblue rounded-[37px] text-xs text-white`}
          >
            <span>{dept}</span>
            <button
              type="button"
              onClick={() => removeDepartment(index)}
              className="font-semibold text-sm ml-1 focus:outline-none cursor-pointer transition transform active:scale-95 hover:text-red-500"
            >
              <IoCloseOutline size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};