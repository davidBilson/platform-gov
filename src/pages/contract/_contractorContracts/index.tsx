import { IoMdArrowDropdown } from 'react-icons/io';
import ActiveContracts from './_activeContracts';
import CompletedContracts from './_completedContracts';
import InactiveContracts from './_inactiveContracts';
import { TbAdjustmentsHorizontal } from "react-icons/tb";

const ContractorContracts = () => {
  return (
    
    <>
      <div className='flex items-center gap-7.5 mb-9.25'>
        <div className="flex flex-wrap items-center justify-between border border-boldblue rounded-lg w-full max-w-75 px-5 py-4 text-sm text-boldblue">
          <input 
            type="text"
            className="text-boldblue placeholder:text-boldblue font-semibold outline-none w-[80%]" 
            placeholder="Filter By" 
          />
          <button
            type="button" 
            className="focus:outline-none"
          >
            <IoMdArrowDropdown />
          {/* <IoMdArrowDropup /> */}
          </button>
        </div>
        <button
          type="button" 
          className="focus:outline-none bg-boldblue text-white rounded-lg w-fit px-4 py-3"
        >
          <TbAdjustmentsHorizontal size={25} />
        </button>
      </div>

      {/* mutually assured contracts */}
      <ActiveContracts />
      {/* client has sent contract, and contractor is yet to finalize or accept contract  */}
      <InactiveContracts />
      {/* finished contracts */}
      <CompletedContracts />
    </>

  );
};

export default ContractorContracts;