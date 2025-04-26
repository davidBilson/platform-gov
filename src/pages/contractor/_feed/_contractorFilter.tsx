import React from 'react';
import { IoMdArrowDropdown, IoMdSearch } from 'react-icons/io';
import { TbAdjustmentsHorizontal } from "react-icons/tb";
import { MdOutlineRadioButtonChecked, MdOutlineRadioButtonUnchecked } from "react-icons/md";

const ContractorFilter = () => {
  return (
    <>
    <div className="flex flex-wrap items-center gap-8.25 mb-8">
        {/* Search input */}
        <div className="relative flex-grow">
          <input 
            type="text" 
            placeholder="Search Jobs" 
            className="h-12.5 border border-boldblue rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue placeholder:text-boldblue"
          />
          <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl text-boldblue">
            <IoMdSearch />
          </button>
        </div>

        {/* Filter button */}
        <button className="h-12.5 w-12.5 flex items-center justify-center bg-boldblue text-white rounded-lg p-2">
          <TbAdjustmentsHorizontal size={25} />
        </button>

        {/* Saved Searches dropdown */}
        <div className=" relative flex-grow">
          <select className="h-12.5 border border-boldblue rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue appearance-none text-boldblue">
            <option>Saved Searches</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <IoMdArrowDropdown size={20} className="text-boldblue" />
          </div>
        </div>

        {/* Save Search button */}
        <button className="h-12.5 bg-boldblue text-white px-6 py-3 rounded-lg text-sm font-semibold">
          Save Search
        </button>
      </div>

      {/* Filter by section */}
      <div className="mb-6">
        <h3 className="text-gray-700 mb-3">Filter by</h3>
        
        <div className="flex flex-wrap gap-3 mb-6">
          {/* Job Type filter */}
          <div className="relative w-full sm:w-64">
            <select className="border border-boldblue rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue appearance-none text-boldblue">
              <option>Job Type</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <IoMdArrowDropdown size={20} className="text-boldblue" />
            </div>
          </div>
          
          {/* Security Clearance filter */}
          <div className="relative w-full sm:w-64">
            <select className="border border-boldblue rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue appearance-none text-boldblue">
              <option>Security Clearance</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <IoMdArrowDropdown size={20} className="text-boldblue" />
            </div>
          </div>
          
          {/* Skills filter */}
          <div className="relative w-full sm:w-64">
            <select className="border border-boldblue rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue appearance-none text-boldblue">
              <option>Skills</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <IoMdArrowDropdown size={20} className="text-boldblue" />
            </div>
          </div>
          
          {/* Expertise filter */}
          <div className="relative w-full sm:w-64">
            <select className="border border-boldblue rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue appearance-none text-boldblue">
              <option>Expertise</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <IoMdArrowDropdown size={20} className="text-boldblue" />
            </div>
          </div>
          
          {/* Certifications filter */}
          <div className="relative w-full sm:w-64">
            <select className="border border-boldblue rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue appearance-none text-boldblue">
              <option>Certifications</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <IoMdArrowDropdown size={20} className="text-boldblue" />
            </div>
          </div>
        </div>
        
        {/* Previous government employment checkbox */}
        <div className="flex items-center mb-4">
            <MdOutlineRadioButtonChecked size={20} color='#0b5f94' />
            <MdOutlineRadioButtonUnchecked size={20} color='#0b5f94' />
          <label className="ml-2 text-gray-700 text-sm">Require previous government employment</label>
        </div>
      </div>
      
      {/* Department/Agency search section with blue background */}
      <div className="bg-skyblue p-5 rounded-lg mb-8">
        <h3 className="text-gray-700 mb-4">Search within departments and agencies only</h3>
        
        <div className="flex flex-wrap items-center gap-4">
          {/* Radio buttons */}
          <div className="flex items-center">
            <input type="radio" name="govt" id="state" className="h-4 w-4 text-deepskyblue border-gray-300 focus:ring-deepskyblue" />
            <label htmlFor="state" className="ml-2 text-gray-700 text-sm">State</label>
          </div>
          
          <div className="flex items-center">
            <input type="radio" name="govt" id="federal" className="h-4 w-4 text-deepskyblue border-gray-300 focus:ring-deepskyblue" />
            <label htmlFor="federal" className="ml-2 text-gray-700 text-sm">Federal</label>
          </div>
          
          {/* Department search input */}
          <div className="relative flex-grow w-full max-w-125">
            <input 
              type="text" 
              placeholder="Select departments or agencies" 
              className="border border-boldblue text-boldblue placeholder:text-boldblue bg-white rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue"
            />
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-boldblue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          
          {/* Apply button */}
          <button className="bg-boldblue text-white px-6 py-3 rounded-lg text-sm font-semibold">
            Apply
          </button>
        </div>
      </div>
    </>
  )
}

export default ContractorFilter