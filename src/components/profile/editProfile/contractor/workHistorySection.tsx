import React, { ChangeEvent } from "react";
import { IoIosSearch } from "react-icons/io";
import { GovernmentDepartmentsAndAgenciesByCountry } from "@/utils/feedFilter/GovernmentDepartmentsAndAgenciesByCountry";
import { WorkHistory } from "@/types/profile";

interface WorkHistorySectionProps {
  workHistory: WorkHistory[];
  addWorkHistory: () => void;
  updateWorkHistory: (id: string, field: keyof WorkHistory, value: string) => void;
  removeWorkHistory: (id: string) => void;
  handleYearInput: (e: ChangeEvent<HTMLInputElement>, workId: string, field: keyof WorkHistory) => void;
  handleCurrentRoleChange: (workId: string, isChecked: boolean) => void;
  showDepartmentDropdown: boolean;
  setShowDepartmentDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  showExperienceDropdown: boolean;
  setShowExperienceDropdown: React.Dispatch<React.SetStateAction<boolean>>;
}

export const WorkHistorySection = ({
  workHistory,
  addWorkHistory,
  updateWorkHistory,
  removeWorkHistory,
  handleYearInput,
  handleCurrentRoleChange,
  showDepartmentDropdown,
  setShowDepartmentDropdown,
  showExperienceDropdown,
  setShowExperienceDropdown,
}: WorkHistorySectionProps) => (
  <div className="mb-7.5">
    <h3 className="my-7.5 font-semibold text-black text-lg flex items-center gap-1">
      <span>Work History</span>
      <span className="text-crimson font-bold h-fit pt-1">*</span>
    </h3>

    {workHistory.map((work, index) => (
      <div key={work.id} className="mb-10">
        <div className="flex justify-between mb-5">
          <h4 className="text-gray-700">Work Experience {index + 1}</h4>
          {workHistory.length > 1 && (
            <button
              type="button"
              onClick={() => removeWorkHistory(work.id)}
              className="text-red-500 transition transform active:scale-95 hover:opacity-70 cursor-pointer"
            >
              Remove
            </button>
          )}
        </div>

        <input
          type="text"
          value={work.title}
          onChange={(e) => updateWorkHistory(work.id, 'title', e.target.value)}
          className="placeholder:font-semibold mb-7.5 block text-sm text-boldblue border border-boldblue rounded-lg w-full max-w-157.5 px-5 py-4 focus:outline focus:outline-boldblue"
          placeholder="Title"
        />

        <div className="flex flex-wrap items-start gap-7.5 mb-7.5">
          <div className="relative w-full md:max-w-[242px]">
            <div className="relative flex justify-between border border-boldblue rounded-lg w-full px-5 py-4 text-sm text-boldblue">
              <input
                type="text"
                value={work.department}
                onChange={(e) => updateWorkHistory(work.id, 'department', e.target.value)}
                onFocus={() => setShowDepartmentDropdown(true)}
                onBlur={() => setTimeout(() => setShowDepartmentDropdown(false), 200)}
                className="outline-none placeholder:font-semibold w-[80%]"
                placeholder="Department/Agency Expertise (Choose from drop-down or Type)"
              />
              <IoIosSearch />
            </div>

            {showDepartmentDropdown && (
              <div
                className="absolute z-20 w-full mt-1 bg-white border border-boldblue rounded-lg shadow-lg max-h-48 overflow-y-scroll dropdown-scrollbar"
                onMouseDown={(e) => e.preventDefault()}
              >
                {GovernmentDepartmentsAndAgenciesByCountry
                  .filter((dept) =>
                    work.department
                      ? dept.toLowerCase().includes(work.department.toLowerCase())
                      : true
                  )
                  .map((dept, idx) => (
                    <div
                      key={`dept-option-${idx}`}
                      className="px-4 py-2 hover:bg-deepskyblue hover:text-white cursor-pointer text-sm"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        updateWorkHistory(work.id, 'department', dept);
                        setShowDepartmentDropdown(false);
                      }}
                    >
                      {dept}
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1">
                <input
                  type="radio"
                  id={`state-${work.id}`}
                  name={`departmentType-${work.id}`}
                  checked={work.departmentType === "state"}
                  onChange={() => updateWorkHistory(work.id, 'departmentType', "state")}
                  className="form-radio h-4 w-4 text-boldblue transition duration-150 ease-in-out"
                />
                <label htmlFor={`state-${work.id}`}>State</label>
              </div>

              <div className="flex items-center gap-1">
                <input
                  type="radio"
                  id={`federal-${work.id}`}
                  name={`departmentType-${work.id}`}
                  checked={work.departmentType === "federal"}
                  onChange={() => updateWorkHistory(work.id, 'departmentType', "federal")}
                  className="form-radio h-4 w-4 text-boldblue transition duration-150 ease-in-out"
                />
                <label htmlFor={`federal-${work.id}`}>Federal</label>
              </div>
            </div>
          </div> */}

          {/* <div className="relative w-full md:max-w-[242px]">
            <div className="flex justify-between border border-boldblue rounded-lg w-full px-5 py-4 text-sm text-boldblue">
              <input
                type="text"
                value={work.experienceLevel}
                onChange={(e) => updateWorkHistory(work.id, 'experienceLevel', e.target.value)}
                onFocus={() => setShowExperienceDropdown(true)}
                onBlur={() => setTimeout(() => setShowExperienceDropdown(false), 200)}
                className="outline-none placeholder:font-semibold w-[80%]"
                placeholder="Level of Experience"
              />
              <IoIosSearch />
            </div>

            {showExperienceDropdown && (
              <div
                className="absolute z-20 w-full mt-1 bg-white border border-boldblue rounded-lg shadow-lg max-h-48 overflow-y-scroll dropdown-scrollbar"
                onMouseDown={(e) => e.preventDefault()}
              >
                {["Entry level (0-2 years)", "Intermediate/Mid-Level (2-5 years)", "Senior Level (5+ Years)"]
                  .filter((level) =>
                    work.experienceLevel
                      ? level.toLowerCase().includes(work.experienceLevel.toLowerCase())
                      : true
                  )
                  .map((level, idx) => (
                    <div
                      key={`level-option-${idx}`}
                      className="px-4 py-2 hover:bg-deepskyblue hover:text-white cursor-pointer text-sm"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        updateWorkHistory(work.id, 'experienceLevel', level);
                        setShowExperienceDropdown(false);
                      }}
                    >
                      {level}
                    </div>
                  ))}
              </div>
            )}
          </div> */}
        </div>

        {/* <div className="mb-7.5">
          <input
            type="text"
            value={work.location}
            onChange={(e) => updateWorkHistory(work.id, 'location', e.target.value)}
            className="placeholder:font-semibold block text-sm text-boldblue border border-boldblue rounded-lg w-full md:max-w-75 px-5 py-4 focus:outline focus:outline-boldblue"
            placeholder="Location"
          />
        </div> */}

        <div className="mb-2.5">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`currentRole-${work.id}`}
              checked={work.toDate === 'Present'}
              onChange={(e) => handleCurrentRoleChange(work.id, e.target.checked)}
              className="form-checkbox h-4 w-4 text-boldblue transition duration-150 ease-in-out"
            />
            <label htmlFor={`currentRole-${work.id}`} className="text-sm text-boldblue">
              I am currently working in this role
            </label>
          </div>
        </div>

        <div className="flex items-center gap-7.5 mb-7.5">
          <div className="relative w-full max-w-75">
            <input
              type="text"
              value={work.fromDate}
              onChange={(e) => handleYearInput(e, work.id, 'fromDate')}
              className="placeholder:font-semibold block text-sm text-boldblue border border-boldblue rounded-lg w-full px-5 py-4 focus:outline focus:outline-boldblue"
              placeholder="From (Year)"
              maxLength={4}
              required
            />
            <span className="text-crimson font-bold absolute top-4 -right-4">*</span>
          </div>
          <div className="relative w-full max-w-75">
            <input
              type="text"
              value={work.toDate}
              onChange={(e) => handleYearInput(e, work.id, 'toDate')}
              className="placeholder:font-semibold block text-sm text-boldblue border border-boldblue rounded-lg w-full px-5 py-4 focus:outline focus:outline-boldblue"
              placeholder="To (Year or Present)"
              maxLength={7}
              disabled={work.toDate === 'Present'}
            />
          </div>
        </div>
      </div>
    ))}

    <div>
      <button
        type="button"
        onClick={addWorkHistory}
        className="text-sm px-4 py-[11px] bg-boldblue rounded-lg text-white font-semibold transition transform active:scale-95 hover:opacity-70 cursor-pointer"
      >
        Add More
      </button>
    </div>
  </div>
);