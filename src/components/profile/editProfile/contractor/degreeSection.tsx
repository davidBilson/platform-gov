import { Degree } from "@/types/profile";
import React from "react";



interface DegreeSectionProps {
  degrees: Degree[];
  addDegree: () => void;
  updateDegree: (id: string, field: keyof Degree, value: string) => void;
  removeDegree: (id: string) => void;
  handleDegreeYearInput: (e: React.ChangeEvent<HTMLInputElement>, degreeId: string) => void;
}

export const DegreeSection = ({
  degrees,
  addDegree,
  updateDegree,
  removeDegree,
  handleDegreeYearInput,
}: DegreeSectionProps) => (
  <div className="mb-7.5">
    <h3 className="mb-7.5 font-semibold text-black text-lg">Degrees</h3>

    {degrees.map((degree) => (
      <div key={degree.id} className="flex flex-wrap items-start justify-start gap-7.5 mb-5">
        <input
          type="text"
          value={degree.degree}
          onChange={(e) => updateDegree(degree.id, 'degree', e.target.value)}
          className="placeholder:font-semibold text-sm text-boldblue border border-boldblue rounded-lg w-full md:max-w-75 px-5 py-4 focus:outline focus:outline-boldblue"
          placeholder="Degree"
          required
        />
        <input
          type="text"
          value={degree.institution}
          onChange={(e) => updateDegree(degree.id, 'institution', e.target.value)}
          className="placeholder:font-semibold text-sm text-boldblue border border-boldblue rounded-lg w-full md:max-w-75 px-5 py-4 focus:outline focus:outline-boldblue"
          placeholder="Institution"
        />
        <input
          type="text"
          value={degree.yearCompleted}
          onChange={(e) => handleDegreeYearInput(e, degree.id)}
          className="placeholder:font-semibold text-sm text-boldblue border border-boldblue rounded-lg w-full md:max-w-75 px-5 py-4 focus:outline focus:outline-boldblue"
          placeholder="Year Completed"
          maxLength={4}
          required
        />
        <input
          type="text"
          value={degree.gpa || ""}
          onChange={(e) => updateDegree(degree.id, 'gpa', e.target.value)}
          className="placeholder:font-semibold text-sm text-boldblue border border-boldblue rounded-lg w-full md:max-w-75 px-5 py-4 focus:outline focus:outline-boldblue"
          placeholder="GPA (Optional)"
          maxLength={4}
        />
        {degrees.length > 1 && (
          <button
            type="button"
            onClick={() => removeDegree(degree.id)}
            className="text-red-500 px-2 transition transform active:scale-95 hover:opacity-70 cursor-pointer"
          >
            Remove
          </button>
        )}
      </div>
    ))}

    <button
      type="button"
      onClick={addDegree}
      className="text-sm px-4 py-[11px] bg-boldblue rounded-lg text-white font-semibold transition transform active:scale-95 hover:opacity-70 cursor-pointer"
    >
      Add More
    </button>
  </div>
);