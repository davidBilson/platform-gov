import React from "react";
import { IoIosSearch } from "react-icons/io";
import { usaStates, canadaStates, ukStates, australiaStates } from '@/utils/countryAndStates/index';

const statesByCountry = { USA: usaStates, UK: ukStates, Canada: canadaStates, Australia: australiaStates };

interface LocationSectionProps {
  location: {
    country: string;
    state: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  showStatesDropdown: boolean;
  setShowStatesDropdown: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LocationSection: React.FC<LocationSectionProps> = ({
  location,
  setFormData,
  showStatesDropdown,
  setShowStatesDropdown,
}) => (
  <div className="mb-7.5">
    <div className="flex gap-7.5 mb-2.5">
      <select
        value={location.country}
        onChange={(e) =>
          setFormData((prev: any) => ({
            ...prev,
            location: { ...prev.location, country: e.target.value, state: "" },
          }))
        }
        className="outline-none appearance-none border border-boldblue text-boldblue rounded-lg px-5 py-4 text-sm cursor-pointer"
      >
        <option className="cursor-pointer" value="">
          Select Country
        </option>
        <option className="cursor-pointer" value="USA">
          USA
        </option>
        <option className="cursor-pointer" value="UK">
          UK
        </option>
        <option className="cursor-pointer" value="Canada">
          Canada
        </option>
        <option className="cursor-pointer" value="Australia">
          Australia
        </option>
      </select>

      {/* {location.country && (
        <div className="relative w-full max-w-75">
          <div className="flex justify-between border border-boldblue rounded-lg w-full px-5 py-4 text-sm text-boldblue">
            <input
              type="text"
              value={location.state}
              onChange={(e) =>
                setFormData((prev: any) => ({
                  ...prev,
                  location: { ...prev.location, state: e.target.value },
                }))
              }
              onFocus={() => setShowStatesDropdown(true)}
              onBlur={() => setTimeout(() => setShowStatesDropdown(false), 200)}
              className="outline-none placeholder:font-semibold w-[80%]"
              placeholder={`Search ${location.country} states`}
            />
            <IoIosSearch />
          </div>

          {showStatesDropdown && (
            <div
              className="absolute z-20 w-full mt-1 bg-white border border-boldblue rounded-lg shadow-lg max-h-48 overflow-y-scroll dropdown-scrollbar"
              onMouseDown={(e) => e.preventDefault()}
            >
              {statesByCountry[location.country as keyof typeof statesByCountry]
                .filter((state) =>
                  location.state
                    ? state.toLowerCase().includes(location.state.toLowerCase())
                    : true
                )
                .map((state, idx) => (
                  <div
                    key={`state-option-${idx}`}
                    className="px-4 py-2 hover:bg-deepskyblue hover:text-white cursor-pointer text-sm"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setFormData((prev: any) => ({
                        ...prev,
                        location: { ...prev.location, state: state },
                      }));
                      setShowStatesDropdown(false);
                    }}
                  >
                    {state}
                  </div>
                ))}
            </div>
          )}
        </div>
      )} */}
    </div>
  </div>
);