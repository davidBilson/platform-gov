import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import ProfilePicture from '@/components/profile/profilePicture';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { IoMdCalendar, IoMdArrowDropdown } from 'react-icons/io';
import useAuthStore from '@/store/useAuth';
import { useHire } from '@/store/useHire';
import { fetchJob, updateJobStatus } from "@/api/job-api";
import { Jobs } from '@/types/jobs';
import { submitHireContract } from '@/api/hiring';
import { updateJobApplicationStatus } from '@/api/status-api';
import { FaLocationDot, FaRegHourglass } from 'react-icons/fa6';
import Legalagreement from '@/components/ui/legal-agreement';
import LoadingAnimation from '@/components/ui/loading';
import { toast } from 'react-toastify';

interface FormData {
    startDate: Date | null;
    rate: string;
    employmentType: string;
    paymentType?: string;
}

const HireContractor: NextPage = () => {

    const router = useRouter();

    const { userId } = useAuthStore();
    const { jobId, contractorId, applicationId, contractorName, contractorProfilePicture, clearHireData } = useHire();
    
    const [selectedEmploymentType, setSelectedEmploymentType] = useState<string>('');
    const [showEmploymentDropdown, setShowEmploymentDropdown] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [job, setJob] = useState<Jobs | null>(null);
    const [loading, setIsLoading] = useState(false);
    
    const [showLegalAgreement, setShowLegalAgreement] = useState<boolean>(false);
    const [acceptedLegalAgreement, setAcceptedLegalAgreement] = useState(false);
    
    const [formData, setFormData] = useState<FormData>({
        startDate: null,
        rate: '',
        employmentType: '',
        paymentType: '',
    });
    
    const employmentOptions = [
        'One Time',
        'Full Time',
        'Part Time'
    ];

    const employmentDropdownRef = useRef<HTMLDivElement>(null);
    const employmentInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const datePickerRef = useRef<DatePicker>(null);

    useEffect(() => {
        const loadJob = async () => {
            if (jobId) {
                try {
                    const jobData = await fetchJob(jobId as string);

                    setJob(jobData);

                    if (jobData) {
                        setFormData({
                            ...formData,
                            rate: JSON.stringify(jobData.price)
                        });
                    }
                } catch (error) {
                    console.error('Error loading job:', error);
                    setJob(null);
                }
            }
        };
        loadJob();
    }, [jobId]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (employmentDropdownRef.current && !employmentDropdownRef.current.contains(event.target as Node)) {
                setShowEmploymentDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const cancelHire = () => {
        clearHireData();
        router.back();
    };

    const getPaymentInfo = () => {
        if (job?.paymentType === 'hourly') {
          return `Hourly | $${job?.price}`;
        } else if (job?.paymentType === 'fixed-price') {
          return `Fixed Price | $${job?.price}`;
        } else if (job?.paymentType === 'retainer' && job?.retainerAmount && job?.retainerFrequency) {
          return `Retainer | $${job?.retainerAmount}/${job?.retainerFrequency.toLowerCase()}`;
        }
        return '';
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFiles([e.target.files[0]]);
        }
    };

    useEffect(() => {
        if (!acceptedLegalAgreement && showLegalAgreement) {
            return;
        }
        if (acceptedLegalAgreement && !showLegalAgreement) {
            handleSubmit()
        }
    }, [acceptedLegalAgreement, showLegalAgreement])

    const handleSubmit = async () => {
        
        if  (!formData.rate || !formData.paymentType || !formData.employmentType || !formData.startDate) {
            toast.error('Incomplete credentials!')
            return;
        }

        setIsLoading(true);
        
        try {
          const success = await submitHireContract({
            jobId,
            userId,
            contractorId,
            applicationId,
            rate: formData.rate,
            paymentType: formData.paymentType,
            employmentType: formData.employmentType,
            startDate: formData.startDate,
            selectedFiles
          });

          toast.success('Contract sent!')

          if (success) {
            await Promise.all([
              updateJobApplicationStatus({applicationId: applicationId, status: "active"}),
              updateJobStatus(userId, jobId, "active")
            ]);
            
            clearHireData();
            router.push('/job/manage');

          } else {
            toast.error("Contract submission not successful");
          }
        } catch (error) {
            console.log(error);
            toast.error("Error during submission:");
        } finally {
            setIsLoading(false);
        }
      };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleEmploymentTypeSelect = (option: string) => {
        let employmentType: 'one-time' | 'full-time' | 'part-time';
        
        if (option === 'One Time') {
            employmentType = 'one-time';
        } else if (option.startsWith('Full Time')) {
            employmentType = 'full-time';
        } else {
            employmentType = 'part-time';
        }

        setSelectedEmploymentType(option);
        setFormData({
            ...formData,
            employmentType
        });
        setShowEmploymentDropdown(false);
    };

    useEffect(() => {
        setFormData({
            ...formData,
            paymentType: job?.paymentType
        });
    }, [job])

    if (!router.isReady) {
        return <div className='h-screen w-full flex items-center justify-center'>
            <LoadingAnimation />
        </div>;
    }

    return (
    <>
        { 
            showLegalAgreement &&
            <Legalagreement
                setShowLegalAgreement={setShowLegalAgreement}
                acceptedLegalAgreement={acceptedLegalAgreement}
                setAcceptedLegalAgreement={setAcceptedLegalAgreement}
            />
        }
        <main className='w-full max-w-300 mx-auto p-6 pb-80'>
            <section>
                <h1 className='font-bold text-xl mb-5'>Hire Contractor</h1>
                <section className='w-full mx-auto bg-skyblue rounded-lg p-7.5 mb-7.5'>
                    <article className='flex flex-col gap-5 '>
                        <h1 className='font-bold text-xl'>{job?.jobTitle ?? ""}</h1>
                        <div className="flex flex-wrap items-center gap-10 text-sm font-semibold">
                            <div className="flex items-center gap-1.25">
                                <FaRegHourglass size={15} />
                                {getPaymentInfo()} | {job?.employmentType}
                            </div>
                            
                            <div className="flex items-center gap-1.25">
                                <FaLocationDot size={15} />
                                {job?.location}
                            </div>
                            </div>
                        <p className='bg-deepskyblue text-sm text-white w-fit h-fit rounded-full py-1.25 px-2.5'>{job?.jobCategory ?? ""}</p>
                    </article>
                </section>

                <h3 className='font-semibold text-sm mb-5'>Contractor</h3>

                <div className='flex items-center gap-5 pb-7.5 mb-5 border-b border-b-deepskyblue'>
                    <ProfilePicture source={contractorProfilePicture || ""} alt={""} dimension={50} />
                    <p className='font-semibold text-xl'>{contractorName}</p>
                </div>

                <div className='pb-7.5 mb-5 border-b border-b-deepskyblue'>
                    <p className='font-semibold text-sm mb-5'>Terms</p>

                    <div className='flex flex-col lg:grid lg:grid-rows-1  lg:grid-cols-3 gap-4'>
                        {/* Employment Type Dropdown */}
                        <div className="relative w-full max-w-75 lg:max-w-full lg:col-span-1 ">
                            <div 
                                className="flex items-center justify-between border border-boldblue rounded-lg px-5 py-4 text-sm text-boldblue cursor-pointer"
                                onClick={() => setShowEmploymentDropdown(!showEmploymentDropdown)}
                            >
                                <input
                                    type="text"
                                    ref={employmentInputRef}
                                    placeholder="Select employment type"
                                    className="outline-none w-full placeholder:font-semibold bg-transparent cursor-pointer"
                                    readOnly
                                    value={selectedEmploymentType}
                                />
                                <IoMdArrowDropdown size={20} className="text-boldblue" />
                            </div>

                            {showEmploymentDropdown && (
                                <div 
                                    ref={employmentDropdownRef}
                                    className="dropdown-scrollbar absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto border border-gray-200"
                                >
                                    {employmentOptions.map((option, index) => (
                                        <div
                                            key={`emp-${index}`}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                            onClick={() => handleEmploymentTypeSelect(option)}
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Rate Input */}
                        <div className="flex justify-between border border-boldblue rounded-lg w-full max-w-75 lg:max-w-full lg:col-span-1  px-5 py-4 text-sm text-boldblue">
                            <input 
                                type="text" 
                                name="rate"
                                value={formData.rate}
                                onChange={handleInputChange}
                                className="outline-none placeholder:font-semibold w-[80%]" 
                                placeholder="Rate" 
                            />
                            <span>$</span>
                        </div>
                        
                        {/* Date Picker */}
                        <div className="w-full max-w-75 lg:max-w-full lg:col-span-1  flex items-center justify-between border border-boldblue rounded-lg px-5 py-4 text-sm text-boldblue">
                            <DatePicker
                                selected={formData.startDate}
                                onChange={(date: Date | null) => setFormData({...formData, startDate: date})}
                                placeholderText="Start Date"
                                dateFormat="yyyy-MM-dd"
                                className="outline-none w-full placeholder:font-semibold bg-transparent"
                                ref={datePickerRef}
                                open={datePickerOpen}
                                onCalendarOpen={() => setDatePickerOpen(true)}
                                onCalendarClose={() => setDatePickerOpen(false)}
                            />
                            <button
                                type="button"
                                onClick={() => setDatePickerOpen(!datePickerOpen)}
                                className="-ml-6 text-boldblue focus:outline-none"
                            >
                                <IoMdCalendar size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                <div>
                    <p className='font-semibold text-sm mb-5'>Documents</p>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                        className="hidden"
                    />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className='flex items-center justify-center gap-2 p-2 rounded-lg border border-boldblue transition transform active:scale-95 hover:shadow-lg duration-300 ease-in-out cursor-pointer'
                    > 
                        <img src="/assets/documents_logo.svg" alt="document_logo" />
                        <span className='h-fit w-fit'>Attach Documents</span>
                    </button>

                    {selectedFiles.length > 0 && (
                        <div className="mt-3">
                            <p className="text-sm font-medium mb-2">Selected files:</p>
                            <ul className="space-y-1">
                                {selectedFiles.map((file, index) => (
                                    <li key={index} className="text-sm text-gray-600">
                                        {file.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </section>

            <div className="flex items-center justify-center gap-2.5 md:gap-7.5 py-7.5 px-6 fixed bottom-0 right-0 bg-skyblue w-full border-t border-t-boldblue">
              <button
                onClick={cancelHire}
                type="button"
                className="cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out py-2 md:py-2.75 px-3 md:px-5 border bg-white border-boldblue text-boldblue text-xs md:text-sm font-semibold rounded-lg"
              >
                Cancel
              </button>
              
              <button
                onClick={() => setShowLegalAgreement(true)}
                className="disabled:opacity-70 cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out py-2 md:py-2.75 px-3 md:px-5 bg-boldblue text-white text-xs md:text-sm font-semibold rounded-lg border border-boldblue"
                disabled={showLegalAgreement}
              >
                {loading ? "Processing..." : "Send Contract"}
              </button>

            </div>
        </main>
    </>
    );
};

export default HireContractor;