import React, { ChangeEvent } from "react";

interface RateSectionProps {
  ratePerHour: string;
  secondRate: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const RateSection = ({
  ratePerHour,
  secondRate,
  handleInputChange,
}: RateSectionProps) => (
  <div className="mb-7.5 pb-7.5 border-b border-b-deepskyblue flex flex-wrap items-center gap-4">
    <div className="flex justify-between border border-boldblue rounded-lg w-full md:max-w-75 px-5 py-4 text-sm text-boldblue">
      <input
        type="text"
        name="ratePerHour"
        value={ratePerHour}
        onChange={handleInputChange}
        className="outline-none placeholder:font-semibold w-[80%]"
        placeholder="Rate per hour"
      />
      <span>Rate</span>
    </div>
    <div className="flex justify-between border border-boldblue rounded-lg w-full md:max-w-75 px-5 py-4 text-sm text-boldblue">
      <input
        type="text"
        name="secondRate"
        value={secondRate}
        onChange={handleInputChange}
        className="outline-none placeholder:font-semibold w-[80%]"
        placeholder="Second Rate (optional)"
      />
      <span>Rate</span>
    </div>
  </div>
);