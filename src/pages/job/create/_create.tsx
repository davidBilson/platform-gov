import useAuthStore from '@/store/useAuth';
import { ReactLib, Data, Icons, UI } from '@/utils/jobs/_imports';
const { jobCategoryList, requiredCertificationsList, requiredSkillsList } = Data;
import type { JobFormData, Milestone } from '@/utils/jobs/_imports';
const { React, useState, useEffect, useRef } = ReactLib;
const { IoMdArrowDropdown, IoMdCalendar, IoIosSearch, IoCloseOutline, RiCheckboxBlankCircleFill, RiCheckboxBlankCircleLine, FiTrash, MdOutlineRadioButtonUnchecked, MdOutlineRadioButtonChecked } = Icons;
const { DatePicker, AddMilestoneModal } = UI;
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { FaCheckCircle } from "react-icons/fa";
import { getSpecificCountryStates  } from '@/utils/getLocations/getAllCountriesAndStates'

type StateWithCountry = [string, string]; // Tuple type for state/country pairs

  
const CreateJob: React.FC = () => {

    const { userId 
        // role 
    } = useAuthStore();
    // const router = useRouter();

    // data to be submitted to BE
    const [formData, setFormData] = useState<JobFormData>({
        userId: userId,
        location: "",
        jobCategory: "",
        jobTitle: "",
        description: "",
        requiredSkills: [],
        requiredCertifications: [],
        requiresRegisteredLobbyist: false,
        employmentType: 'Full Time',
        paymentType: 'hourly',
        price: 0,
        milestones: [],
        startDate: null,
        retainerAmount: 0,
        retainerFrequency: 'Week',
        retainerDuration: null,
    });

    const router = useRouter()

    const [isSubmitting, setIsSubmitting] = useState(false);

    // modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    // date
    const datePickerRef = useRef(null);
    const [datePickerOpen, setDatePickerOpen] = useState(false);

    // Form state management
    const [requiredSkillInput, setRequiredSkillInput] = useState<string>("");
    const [requiredCertificationInput, setRequiredCertificationInput] = useState<string>("");
    const [filteredRequiredSkills, setFilteredRequiredSkills] = useState<string[]>([]);
    const [filteredRequiredCertifications, setFilteredRequiredCertifications] = useState<string[]>([]);
  
    //   retainer
    const [showRetainerFrequencyDropdown, setShowRetainerFrequencyDropdown] = useState<boolean>(false);
    const [retainerFrequencyInput, setRetainerFrequencyInput] = useState<string>('Week');
    const retainerFrequencyOptions = ['Hour', 'Day', 'Week', 'Month'];

    // Dropdowns state
    const [showRequiredCertificationsDropdown, setShowRequiredCertificationsDropdown] = useState<boolean>(false);
    const [showRequiredSkillsDropdown, setShowRequiredSkillsDropdown] = useState<boolean>(false);
    const [showJobCategoryDropdown, setShowJobCategoryDropdown] = useState<boolean>(false);
    const [showLocationDropdown, setShowLocationDropdown] = useState<boolean>(false);
    
    // Input values
    const [locationInput, setLocationInput] = useState<string>("");
    const [jobCategoryInput, setJobCategoryInput] = useState<string>("");
    
    // Filtered options
    const [filteredLocation, setFilteredLocation] = useState<string[]>([]);
    const [filteredJobCategory, setFilteredJobCategory] = useState<string[]>([]);

    const [statesWithCountries, setStatesWithCountries] = useState<StateWithCountry[]>([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const [ statesData ] = await Promise.all([
            getSpecificCountryStates(),
          ]);
          setStatesWithCountries(statesData);
        } catch (err) {
          console.error('Error fetching data:', err);
        }
      };
      fetchData();
    }, []);

    useEffect(() => {
      console.log('statesWithCountries: ',statesWithCountries)
    }, [statesWithCountries])

    // Retainer Handlers
    const handleRetainerAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value) || 0;
        setFormData(prev => ({
        ...prev,
        retainerAmount: value
        }));
    };
  
    const handleRetainerDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value) || 1;
        setFormData(prev => ({
        ...prev,
        retainerDuration: value
        }));
    };
  
    const handleRetainerFrequencyChange = (frequency: string) => {
        setFormData(prev => ({
        ...prev,
        retainerFrequency: frequency
        }));
        setRetainerFrequencyInput(frequency);
        setShowRetainerFrequencyDropdown(false);
    };

    // Event Handlers
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

        const { name, value } = e.target;

        setFormData(prev => ({
        ...prev,
        [name]: value,
        }));

    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
        ...prev,
        [name]: checked
        }));
    };

    const handleEmploymentTypeChange = (type: 'Full Time' | 'part-time') => {
        setFormData(prev => ({
        ...prev,
        employmentType: type
        }));
    };

    const handlePaymentTypeChange = (type: 'hourly' | 'fixed-price' | 'retainer') => {
        setFormData(prev => ({
        ...prev,
        paymentType: type
        }));
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value) || 0;
        setFormData(prev => ({
        ...prev,
        price: value
        }));
        updateMilestonePrices(value);
    };

    const updateMilestonePrices = (price: number) => {
        if (formData.paymentType === 'fixed-price' && formData.milestones.length > 0) {
        const pricePerMilestone = price / formData.milestones.length;
        setFormData(prev => ({
            ...prev,
            milestones: prev.milestones.map(milestone => ({
            ...milestone,
            price: pricePerMilestone
            }))
        }));
        } else if (formData.paymentType === 'retainer' || formData.paymentType === 'hourly') {
        setFormData(prev => ({
            ...prev,
            milestones: prev.milestones.map(milestone => ({
            ...milestone,
            price: price
            }))
        }));
        }
    };

    //   milestone
    const addMilestone = () => {
        setIsModalOpen(true);
    };

  const handleMilestoneSubmit =  (milestoneData: {
    description: string;
    price: number;
    dueDate: Date | null;
  }) => {
    const newMilestoneId = formData.milestones.length > 0 
      ? Math.max(...formData.milestones.map(m => m.id)) + 1 
      : 1;
    
    const newMilestone: Milestone = {
      id: newMilestoneId,
      description: milestoneData.description,
      price: milestoneData.price,
      dueDate: milestoneData.dueDate ? milestoneData.dueDate.toISOString() : null
    };
    
    // If fixed-price, recalculate price per milestone
    if (formData.paymentType === 'fixed-price') {
      const updatedMilestones = [...formData.milestones, newMilestone];
      const pricePerMilestone = formData.price / updatedMilestones.length;
      const recalculatedMilestones = updatedMilestones.map(milestone => ({
        ...milestone,
        price: pricePerMilestone
      }));
      
      setFormData(prev => ({
        ...prev,
        milestones: recalculatedMilestones
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        milestones: [...prev.milestones, newMilestone]
      }));
    }
    
    setIsModalOpen(false);
  };

    const removeMilestone = (id: number) => {
        const updatedMilestones = formData.milestones.filter(milestone => milestone.id !== id);
        
        // If fixed-price and there are still milestones, recalculate price per milestone
        if (formData.paymentType === 'fixed-price' && updatedMilestones.length > 0) {
        const pricePerMilestone = formData.price / updatedMilestones.length;
        const recalculatedMilestones = updatedMilestones.map(milestone => ({
            ...milestone,
            price: pricePerMilestone
        }));
        
        setFormData(prev => ({
            ...prev,
            milestones: recalculatedMilestones
        }));
        } else {
        setFormData(prev => ({
            ...prev,
            milestones: updatedMilestones
        }));
        }
    };

    const updateMilestoneDescription = (id: number, description: string) => {
        setFormData(prev => ({
        ...prev,
        milestones: prev.milestones.map(milestone => 
            milestone.id === id ? { ...milestone, description } : milestone
        )
        }));
    };

    const updateMilestoneDueDate = (id: number, dueDate: Date | null) => {
        setFormData(prev => ({
        ...prev,
        milestones: prev.milestones.map(milestone => 
            milestone.id === id ? { ...milestone, dueDate: dueDate ? dueDate.toISOString() : null } : milestone
        )
        }));
    };

    // Tag Management
    const addTag = (type: 'requiredSkills' | 'requiredCertifications', value: string) => {
        if (!value.trim()) return;
        
        // Check if the tag already exists - if it does, remove it instead of adding
        if (formData[type].includes(value.trim())) {
        // Find index of the item
        const index = formData[type].indexOf(value.trim());
        // Remove the item
        removeTag(type, index);
        return;
        }
        
        // Otherwise add as before
        setFormData(prev => ({
        ...prev,
        [type]: [...prev[type], value.trim()]
        }));
        
        // Clear the input but DO NOT close the dropdown
        if (type === 'requiredSkills') {
        setRequiredSkillInput("");
        } else if (type === 'requiredCertifications') {
        setRequiredCertificationInput("");
        }
    };

    const removeTag = (type: 'requiredSkills' | 'requiredCertifications', index: number) => {
        setFormData(prev => ({
        ...prev,
        [type]: prev[type].filter((_, i) => i !== index)
        }));
    };

    // Dropdown effects
    useEffect(() => {
        if (showRequiredSkillsDropdown) {
        const availableSkills = requiredSkillsList.filter(skill => 
            !formData.requiredSkills.includes(skill)
        );
        
        if (requiredSkillInput.trim()) {
            const filtered = availableSkills.filter(skill => 
            skill.toLowerCase().includes(requiredSkillInput.toLowerCase())
            );
            setFilteredRequiredSkills(filtered);
        } else {
            setFilteredRequiredSkills(availableSkills);
        }
        } else {
        setFilteredRequiredSkills(requiredSkillsList.filter(skill => !formData.requiredSkills.includes(skill)));
        }
    }, [requiredSkillInput, formData.requiredSkills, showRequiredSkillsDropdown]);

  useEffect(() => {
    if (showRequiredCertificationsDropdown) {
      const availableCertifications = requiredCertificationsList.filter(certification => 
        !formData.requiredCertifications.includes(certification)
      );
      
      if (requiredCertificationInput.trim()) {
        const filtered = availableCertifications.filter(certification => 
          certification.toLowerCase().includes(requiredCertificationInput.toLowerCase())
        );
        setFilteredRequiredCertifications(filtered);
      } else {
        setFilteredRequiredCertifications(availableCertifications);
      }
    } else {
      setFilteredRequiredCertifications(requiredCertificationsList.filter(certification => !formData.requiredCertifications.includes(certification)));
    }
  }, [requiredCertificationInput, formData.requiredCertifications, showRequiredCertificationsDropdown]);

  useEffect(() => {
    if (showLocationDropdown) {
      const availableLocations = statesWithCountries.map(([state, country]) => `${state}, ${country}`);
      
      if (locationInput.trim()) {
        const filtered = availableLocations.filter(location => 
          location.toLowerCase().includes(locationInput.toLowerCase())
        );
        setFilteredLocation(filtered);
      } else {
        setFilteredLocation(availableLocations);
      }
    } else {
      setFilteredLocation(statesWithCountries.map(([state, country]) => `${state}, ${country}`));
    }
  }, [locationInput, formData.location, showLocationDropdown, statesWithCountries]);

  useEffect(() => {
    if (showJobCategoryDropdown) {
      const availableCategories = jobCategoryList.filter(category => 
        !formData.jobCategory?.includes(category)
      );
      
      if (jobCategoryInput.trim()) {
        const filtered = availableCategories.filter(category => 
          category.toLowerCase().includes(jobCategoryInput.toLowerCase())
        );
        setFilteredJobCategory(filtered);
      } else {
        setFilteredJobCategory(availableCategories);
      }
    } else {
      setFilteredJobCategory(jobCategoryList.filter(category => !formData.jobCategory?.includes(category)));
    }
  }, [jobCategoryInput, formData.jobCategory, showJobCategoryDropdown]);

  // Effect to update milestone prices when payment type changes
  useEffect(() => {
    updateMilestonePrices(formData.price);
  }, [formData.paymentType]);

  // Form submission
  const handleSubmit = async (e: React.FormEvent ) => {
      e.preventDefault();
      setIsSubmitting(true);
      
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
      const createJobEndpoint =process.env.NEXT_PUBLIC_CREATE_JOBS;
    try {
        console.log(baseURL);
        console.log(createJobEndpoint);
      // Prepare data for API submission
      const response = await axios.post(`${baseURL}${createJobEndpoint}`, formData);
      console.log('Job created successfully:', response.data);
      toast.success('Job created successfully');
      router.push('/')
      // Handle success (redirect, show message, etc.)
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error('Error creating job');
    } finally {
        setIsSubmitting(false);
    }
  };

  // Helper function to format price display
  const formatMilestonePrice = (milestone: Milestone) => {
    if (formData.paymentType === 'hourly') {
      return `$${milestone.price} / hr`;
    } else {
      return `$${milestone.price}`;
    }
  };

  return (
    <section className='p-6 pt-7.5'>
        <AddMilestoneModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleMilestoneSubmit}
            paymentType={formData.paymentType}
            defaultPrice={formData.price}
        />
      <section className='w-full max-w-275 m-auto pb-64'>
        <h1 className='pb-7.5 font-semibold text-xl'>Create Job</h1>
        {/* Create Job Form */}
        <form id="createJobForm" onSubmit={handleSubmit}>
          {/* Job Category */}
          <div className="relative w-full max-w-75 mb-7.5">
            <div className="w-full max-w-75 flex justify-between border border-boldblue rounded-lg px-5 py-4 text-sm text-boldblue">
                <input 
                  type="text"
                  value={jobCategoryInput}
                  onChange={(e) => setJobCategoryInput(e.target.value)}

                  onClick={() => {
                    setShowJobCategoryDropdown(true);
                    setFilteredJobCategory(jobCategoryList);
                  }}

                  onBlur={(e) => {
                    if (!e.relatedTarget || !e.relatedTarget.closest('.jobcategory-dropdown-item')) {
                      setTimeout(() => setShowJobCategoryDropdown(false), 200);
                    }
                  }}

                  placeholder="Job Category" 
                  className="outline-none placeholder:font-semibold w-[80%] cursor-pointer" 
                />
                <button 
                  type="button"
                  disabled
                  className="focus:outline-none"
                >
                  <IoMdArrowDropdown size={20} />
                </button>
            </div>
            {/* Job Category dropdown */}
            {showJobCategoryDropdown && (
              <div className="absolute z-20 w-full mt-1 bg-white  shadow-lg shadow-gray-400 rounded-lg shadow-lg max-h-48 overflow-y-scroll dropdown-scrollbar"
                onMouseDown={(e) => e.preventDefault()}
              >
                {filteredJobCategory.map((category, idx) => (
                  <div 
                    key={`category-option-${idx}`} 
                    className="jobcategory-dropdown-item px-4 py-2 hover:bg-deepskyblue hover:text-white cursor-pointer text-sm"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setFormData({...formData, jobCategory: category});
                      setJobCategoryInput(category);
                    }}
                  >
                    {category}
                  </div>
                ))}
              </div>
            )}
          </div> 
          
          {/* Job Title */}
          <div className="mb-7.5">
            <textarea
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              rows={1}
              className="block text-sm text-boldblue border border-boldblue rounded-lg w-full max-w-275 px-5 py-4 focus:outline focus:outline-boldblue resize-none overflow-hidden"
              placeholder="Job Title"
            ></textarea>
          </div>
          
          {/* Job Description */}
          <div className='mb-8 pb-7.5 border-b border-b-deepskyblue'>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description"
              className='w-full py-3.5 px-5 text-boldblue resize-none border border-boldblue focus:outline focus:outline-boldblue rounded-md min-h-[111px]'
            />
          </div>
          
          {/* Select Required Skills */}
          <div className="flex flex-wrap items-center mb-7.5 gap-2.5">
            <div className="relative w-full max-w-75">
              <div className="flex justify-between border border-boldblue rounded-lg w-full px-5 py-4 text-sm text-boldblue">
                <input 
                  type="text" 
                  value={requiredSkillInput}
                  onChange={(e) => setRequiredSkillInput(e.target.value)}
                  onFocus={() => {
                    setShowRequiredSkillsDropdown(true)
                    setFilteredRequiredSkills(requiredSkillsList);}}
                  onBlur={() => setTimeout(() => setShowRequiredSkillsDropdown(false), 200)}
                  className="outline-none  placeholder:font-semibold w-[80%]" 
                  placeholder="Select Required Skills" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowRequiredSkillsDropdown(!showRequiredSkillsDropdown)}
                  className="focus:outline-none"
                >
                  <IoIosSearch />
                </button>
              </div>
              {/* Skills dropdown */}
              {showRequiredSkillsDropdown && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-boldblue rounded-lg shadow-lg max-h-48 overflow-y-scroll dropdown-scrollbar"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {filteredRequiredSkills.map((skill, idx) => (
                    <div 
                      key={`skill-option-${idx}`} 
                      className="px-4 py-2 hover:bg-deepskyblue hover:text-white cursor-pointer text-sm"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        addTag('requiredSkills', skill);
                      }}
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* tags */}
            {formData.requiredSkills.map((skill, index) => (
              <div 
                key={`skill-${index}`} 
                className="flex flex-row justify-between items-center px-2.5 py-1.25 gap-2.5 bg-deepskyblue rounded-[37px] text-xs text-white"
              >
                {skill}
                <button 
                  type="button"
                  onClick={() => removeTag('requiredSkills', index)}
                  className="font-semibold text-sm ml-1 focus:outline-none hover:text-red-500 transition transform active:scale-95 cursor-pointer"
                >
                  <IoCloseOutline size={16} />
                </button>
              </div>
            ))}
          </div>
          
          {/* Select Required Certifications */}
          <div className="flex flex-wrap items-center pb-7.5 gap-2.5">
            <div className="relative w-full max-w-75">
              <div className="flex justify-between border border-boldblue rounded-lg w-full px-5 py-4 text-sm text-boldblue">
                <input 
                  type="text" 
                  value={requiredCertificationInput}
                  onChange={(e) => setRequiredCertificationInput(e.target.value)}
                  onFocus={() => {
                    setShowRequiredCertificationsDropdown(true)
                    setFilteredRequiredCertifications(requiredCertificationsList);}}
                  onBlur={() => setTimeout(() => setShowRequiredCertificationsDropdown(false), 200)}
                  className="outline-none placeholder:font-semibold w-[80%]" 
                  placeholder="Select Required Certifications" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowRequiredCertificationsDropdown(!showRequiredCertificationsDropdown)}
                  className="focus:outline-none"
                >
                  <IoIosSearch />
                </button>
              </div>
              {/* Certifications dropdown */}
              {showRequiredCertificationsDropdown && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-boldblue rounded-lg shadow-lg max-h-48 overflow-y-scroll dropdown-scrollbar"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {filteredRequiredCertifications.map((certification, idx) => (
                    <div 
                      key={`certification-option-${idx}`} 
                      className="px-4 py-2 hover:bg-deepskyblue hover:text-white cursor-pointer text-sm"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        addTag('requiredCertifications', certification);
                      }}
                    >
                      {certification}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* tags */}
            {formData.requiredCertifications.map((certification, index) => (
              <div 
                key={`certification-${index}`} 
                className="flex flex-row justify-between items-center px-2.5 py-1.25 gap-2.5 bg-aquagreen rounded-[37px] text-xs text-white"
              >
                {certification}
                <button 
                  type="button"
                  onClick={() => removeTag('requiredCertifications', index)}
                  className="font-semibold text-sm ml-1 focus:outline-none hover:text-red-500 transition transform active:scale-95 cursor-pointer"
                >
                  <IoCloseOutline size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Requires Registered Lobbyist */}
          <div aria-label='requires_registered_lobbyist' className='flex items-center gap-2.5 border-b border-b-deepskyblue pb-7.5 mb-7.5'>
            <input 
              type="checkbox" 
              name="requiresRegisteredLobbyist"
              checked={formData.requiresRegisteredLobbyist}
              onChange={handleCheckboxChange}
              className="hidden" 
            />
            {formData.requiresRegisteredLobbyist ? (
              <FaCheckCircle 
                color='#0B5F94' 
                size={20}
                onClick={() => setFormData(prev => ({ ...prev, requiresRegisteredLobbyist: false }))}
                className="cursor-pointer"
              />
            ) : (
              <RiCheckboxBlankCircleLine 
                color='#0B5F94' 
                size={20}
                onClick={() => setFormData(prev => ({ ...prev, requiresRegisteredLobbyist: true }))}
                className="cursor-pointer"
              />
            )}
            <span className='text-sm'>
              Requires Registered Lobbyist
            </span>
          </div>

          {/* Fulltime or parttime */} {/* Hourly | Fixed Price | Retainer */}
          <div>
            {/* Employment Type Toggle */}
            <div className='flex items-center text-sm gap-2.25 mb-7.5'>
              Full-time
              <span className='w-full flex items-center border border-deepskyblue max-w-14.5 rounded-full'>
                {formData.employmentType === 'Full Time' ? (
                  <RiCheckboxBlankCircleFill 
                    color='#0B5F94' 
                    size={25} 
                    className="cursor-pointer"
                    onClick={() => handleEmploymentTypeChange('part-time')}
                  />
                ) : (
                  <RiCheckboxBlankCircleFill 
                    color='#0B5F94' 
                    size={25} 
                    className="cursor-pointer ml-auto"
                    onClick={() => handleEmploymentTypeChange('Full Time')}
                  />
                )}
              </span>
              Part-time 
            </div>
            {/* Payment Type Selection */}
            <div className='flex items-center gap-15 mb-7.5 text-sm text-darkgray'>
              <div className='flex items-center gap-1.25'>
                {formData.paymentType === 'hourly' ? (
                  <MdOutlineRadioButtonChecked 
                    size={21} 
                    color='#0B5F94' 
                    onClick={() => handlePaymentTypeChange('hourly')}
                    className="cursor-pointer"
                  />
                ) : (
                  <MdOutlineRadioButtonUnchecked 
                    size={20} 
                    color='#0B5F94' 
                    onClick={() => handlePaymentTypeChange('hourly')}
                    className="cursor-pointer"
                  />
                )}
                Hourly
              </div>
              <div className='flex items-center gap-1.25'>
                {formData.paymentType === 'fixed-price' ? (
                  <MdOutlineRadioButtonChecked 
                    size={21} 
                    color='#0B5F94' 
                    onClick={() => handlePaymentTypeChange('fixed-price')}
                    className="cursor-pointer"
                  />
                ) : (
                  <MdOutlineRadioButtonUnchecked 
                    size={20} 
                    color='#0B5F94' 
                    onClick={() => handlePaymentTypeChange('fixed-price')}
                    className="cursor-pointer"
                  />
                )}
                Fixed Price
              </div>
              <div className='flex items-center gap-1.25'>
                {formData.paymentType === 'retainer' ? (
                  <MdOutlineRadioButtonChecked 
                    size={21} 
                    color='#0B5F94' 
                    onClick={() => handlePaymentTypeChange('retainer')}
                    className="cursor-pointer"
                  />
                ) : (
                  <MdOutlineRadioButtonUnchecked 
                    size={20} 
                    color='#0B5F94' 
                    onClick={() => handlePaymentTypeChange('retainer')}
                    className="cursor-pointer"
                  />
                )}
                Retainer
              </div>
            </div>
          </div>

            {/* Retainer UI */}
{/* Conditional rendering based on payment type */}
{formData.paymentType === 'retainer' ? (
  /* Retainer UI */
  <div className='flex flex-col lg:flex-row items-start lg:items-center gap-4 w-full mb-7.5'>
    {/* Amount */}
    <div className="w-full lg:w-auto flex-1">
      <fieldset className="w-full border border-boldblue rounded-lg px-5 py-4 text-sm text-boldblue">
        <legend className="px-2 text-boldblue text-[10px]">Amount</legend>
        <div className="flex justify-between items-center gap-2">
          <button type="button" className="focus:outline-none">
            {"$"}
          </button>
          <input
            type="text"
            placeholder='500'
            value={formData.retainerAmount || ''}
            onChange={handleRetainerAmountChange}
            className="outline-none placeholder:font-semibold w-full"
          />
          <span className="focus:outline-none">
            Amount
          </span>
        </div>
      </fieldset>
    </div>

    {/* To be paid */}
    <span className='text-sm whitespace-nowrap'>To be paid</span>

    {/* Every */}
    <div className="w-full lg:w-auto flex-1 relative">
      <fieldset className="w-full border border-boldblue rounded-lg px-5 py-4 text-sm text-boldblue">
        <legend className="px-2 text-boldblue text-[10px]">Every</legend>
        <div className="flex justify-between items-center gap-2">
          <span className="focus:outline-none">{""}</span>
          <input
            type="text"
            placeholder='Week'
            value={retainerFrequencyInput}
            onChange={(e) => setRetainerFrequencyInput(e.target.value)}
            onClick={() => {
              setShowRetainerFrequencyDropdown(true);
            }}
            onFocus={() => setShowRetainerFrequencyDropdown(true)}
            onBlur={(e) => {
              // Only close if the related dropdown item wasn't clicked
              if (!e.relatedTarget || !e.relatedTarget.closest('.frequency-dropdown-item')) {
                setTimeout(() => setShowRetainerFrequencyDropdown(false), 200);
              }
            }}
            // onBlur={() => setTimeout(() => setShowRetainerFrequencyDropdown(false), 200)}
            className="outline-none placeholder:font-semibold w-full"
          />
          <button 
            type="button"
            disabled
            // onClick={() => setShowRetainerFrequencyDropdown(!showRetainerFrequencyDropdown)}
            className="focus:outline-none"
          >
            <IoMdArrowDropdown size={20} />
          </button>
        </div>
      </fieldset>
      
      {/* Frequency dropdown */}
      {showRetainerFrequencyDropdown && (
        <div className="absolute z-20 w-full mt-1 bg-white border border-boldblue rounded-lg shadow-lg max-h-48 overflow-y-scroll dropdown-scrollbar"
          onMouseDown={(e) => e.preventDefault()}
        >
          {retainerFrequencyOptions.map((frequency, idx) => (
            <div 
              key={`frequency-option-${idx}`} 
              className="frequency-dropdown-item px-4 py-2 hover:bg-deepskyblue hover:text-white cursor-pointer text-sm"
              onMouseDown={(e) => {
                e.preventDefault();
                handleRetainerFrequencyChange(frequency);
              }}
            >
              {frequency}
            </div>
          ))}
        </div>
      )}
    </div>

    {/* For the duration of */}
    <span className='text-sm whitespace-nowrap'>For the duration of</span>

    {/* Duration */}
    <div className="w-full lg:w-auto flex-1">
      <fieldset className="w-full border border-boldblue rounded-lg px-5 py-4 text-sm text-boldblue">
        <legend className="px-2 text-boldblue text-[10px]">Duration</legend>
        <div className="flex justify-between items-center gap-2">
          <span className="focus:outline-none">{""}</span>
          <input
            type="text"
            placeholder='1'
            value={formData.retainerDuration || ''}
            onChange={handleRetainerDurationChange}
            className="outline-none placeholder:font-semibold w-full"
          />
          <span className="focus:outline-none">
            {formData.retainerFrequency}s
          </span>
        </div>
      </fieldset>
    </div>
  </div>
) : (
  /* Price and Milestone UI for hourly and fixed-price */
  <>
    {/* Enter Price */}
    <div className="w-full max-w-75 mb-7.5 flex justify-between border border-boldblue rounded-lg px-5 py-4 text-sm text-boldblue">
      <input 
        type="text"
        value={formData.price || ''}
        onChange={handlePriceChange}
        placeholder={formData.paymentType === 'hourly' ? "Enter Hourly Rate" : "Enter Fixed Price"}
        className="outline-none placeholder:font-semibold w-[80%]" 
      />
      <button 
        type="button" 
        className="focus:outline-none"
      >
        $
      </button>
    </div>
    
    <div className='pb-7.5 mb-7.5'>
      {formData.milestones.map((milestone, index) => (
        <div key={milestone.id} className="mb-5">
          <div className='flex items-center justify-between border-b border-b-deepskyblue pb-2.5 mb-2.5'>
            <h3 className='font-semibold'>Milestone {index + 1}</h3>
            <button 
              type='button'
              className='w-fit border-none outline-none background-none'
              onClick={() => removeMilestone(milestone.id)}
            >
              <FiTrash size={20} />
            </button>
          </div>
          <textarea
            value={milestone.description}
            placeholder='Enter Milestone Description'
            onChange={(e) => updateMilestoneDescription(milestone.id, e.target.value)}
            className="text-sm w-full pt-2 border-none rounded-md outline-none resize-none"
            rows={2}
          />
          <p aria-label='price' className="mb-2.5">{formatMilestonePrice(milestone)}</p>
          <div className="flex items-center mb-5 gap-2">
            <p aria-label="due_date" className='font-semibold text-sm'>Due</p>
            <DatePicker
              selected={milestone.dueDate ? new Date(milestone.dueDate) : null}
              onChange={(date) => updateMilestoneDueDate(milestone.id, date)}
              dateFormat="MM/dd/yyyy"
              className="outline-none rounded-md p-1 text-sm"
            />
          </div>
          {index !== formData.milestones.length - 1 && <hr className="my-4 border-t border-gray-200" />}
        </div>
      ))}
      <button
        type="button"
        onClick={addMilestone}
        className="cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out py-3 px-5 bg-boldblue text-white text-sm font-semibold rounded-lg border border-boldblue"
      >
        Add Milestone
      </button>
    </div>
  </>
)}

          {/* Start date */}
            <div className='flex items-center gap-9.25 border-t border-t-deepskyblue pt-7.5'>
                <div className="w-full max-w-75 flex items-center justify-between border border-boldblue rounded-lg px-5 py-4 text-sm text-boldblue">
                    <DatePicker
                        selected={formData.startDate}
                        onChange={(date) => setFormData({...formData, startDate: date})}
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

                {/* Location */}
                <div className="relative w-full max-w-75">
                  <div className="w-full max-w-75 flex justify-between border border-boldblue rounded-lg px-5 py-4 text-sm text-boldblue">
                    <input 
                      type="text"
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      onClick={() => {
                        setShowLocationDropdown(true);
                        setFilteredLocation(statesWithCountries.map(([state, country]) => `${state}, ${country}`));
                      }}
                      onFocus={() => {
                        setShowLocationDropdown(true);
                        setFilteredLocation(statesWithCountries.map(([state, country]) => `${state}, ${country}`));
                      }}
                      onBlur={(e) => {
                        // Only close if the related dropdown item wasn't clicked
                        if (!e.relatedTarget || !e.relatedTarget.closest('.location-dropdown-item')) {
                          setTimeout(() => setShowLocationDropdown(false), 200);
                        }
                      }}
                      placeholder="Location" 
                      className="outline-none placeholder:font-semibold w-[80%] cursor-pointer" 
                    />
                    <button 
                      type="button" 
                      disabled
                      className="focus:outline-none"
                    >
                      <IoMdArrowDropdown size={20} />
                    </button>
                  </div>

                  {/* Location dropdown */}
                  {showLocationDropdown && (
                    <div className="absolute z-20 w-full mt-1 bg-white rounded-lg shadow-lg shadow-gray-400 max-h-48 overflow-y-scroll dropdown-scrollbar"
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {filteredLocation.map((location, idx) => (
                        <div 
                          key={`location-option-${idx}`} 
                          className="location-dropdown-item px-4 py-2 hover:bg-deepskyblue hover:text-white cursor-pointer text-sm"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setFormData({...formData, location: location});
                            setLocationInput(location);
                          }}
                        >
                          {location}
                        </div>
                      ))}
                    </div>
                  )}

                </div>
            </div>
        </form>
        
        {/* Sticky Bottom */}
        <section className="flex items-center justify-center gap-2.5 py-7.5 px-6 fixed bottom-0 left-0 bg-skyblue w-full border-t border-t-boldblue">
          <button 
            type="button"
            className="cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out py-3 px-5 border bg-white border-boldblue text-boldblue text-sm font-semibold rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit" form="createJobForm"
            disabled={isSubmitting}
            className="w-22.5 cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out py-3 px-5 bg-boldblue text-white text-sm font-semibold rounded-lg border border-boldblue"
        >
            {isSubmitting ? (
                <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                </div>
            ) : (
                "Submit"
            )}
        </button>
        </section>
        </section>
    </section>
  )
}

export default CreateJob;