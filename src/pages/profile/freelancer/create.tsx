
"use client"
import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import { IoMdImages, IoIosSearch } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { IoCloseOutline } from "react-icons/io5";
import { ProfileFormData, WorkHistory, Degree } from "@/types/profile";
import { generateId } from "@/utils/profile-utils";
import { fetchProfile, saveProfile, skillsList, expertiseList, certificationsList } from "@/api/profile-api";
import useAuthStore from '@/store/authStore';
import axios, { AxiosError } from "axios";
import Legalagreement from "@/components/ui/legal-agreement";
import { useRouter } from 'next/router';
import { toast } from "react-toastify";

interface AuthStoreState {
  userId: string;
  name: string;
}

const CreateFreelancerProfile = () => {
  const router = useRouter();
  const { userId, name } = useAuthStore() as AuthStoreState;

  const [formData, setFormData] = useState<ProfileFormData>({
    bio: "",
    ratePerHour: "",
    primaryPosition: "",
    skills: [],
    expertise: [],
    certifications: [],
    workHistory: [
      {
        id: generateId(),
        title: "",
        department: "",
        departmentType: "",
        experienceLevel: "",
        location: "",
        fromDate: "",
        toDate: ""
      }
    ],
    degrees: [
      {
        id: generateId(),
        degree: "",
        institution: "",
        yearCompleted: ""
      }
    ],
    profileImage: null,
    profileImageUrl: "",
  });

  const [skillInput, setSkillInput] = useState<string>("");
  const [expertiseInput, setExpertiseInput] = useState<string>("");
  const [certificationInput, setCertificationInput] = useState<string>("");
  const [filteredSkills, setFilteredSkills] = useState<string[]>([]);
  const [filteredExpertise, setFilteredExpertise] = useState<string[]>([]);
  const [filteredCertifications, setFilteredCertifications] = useState<string[]>([]);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProfileExists, setIsProfileExists] = useState<boolean>(false);
  const [showSkillsDropdown, setShowSkillsDropdown] = useState<boolean>(false);
  const [showExpertiseDropdown, setShowExpertiseDropdown] = useState<boolean>(false);
  const [showCertificationsDropdown, setShowCertificationsDropdown] = useState<boolean>(false);
  
  const [pendingSubmission, setPendingSubmission] = useState<boolean>(false);
  const [showLegalAgreement, setShowLegalAgreement] = useState<boolean>(false);
  const [acceptedLegalAgreement, setAcceptedLegalAgreement] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {

    if (showSkillsDropdown) {
      if (skillInput.trim()) {
        const filtered = skillsList.filter(skill => 
          skill.toLowerCase().includes(skillInput.toLowerCase())
        );
        setFilteredSkills(filtered);
      }
    } else {
      setFilteredSkills(skillsList);
    }
  }, [skillInput]);

  useEffect(() => {
    if (showExpertiseDropdown) {
      if (expertiseInput.trim()) {
        // Filter the list when there's input
        const filtered = expertiseList.filter(exp => 
          exp.toLowerCase().includes(expertiseInput.toLowerCase())
        );
        setFilteredExpertise(filtered);
      }
    } else {
      setFilteredExpertise(expertiseList);
    }
  }, [expertiseInput]);

  useEffect(() => {
    if (showCertificationsDropdown) {
      if (certificationInput.trim()) {
        const filtered = certificationsList.filter(cert => 
          cert.toLowerCase().includes(certificationInput.toLowerCase())
        );
        setFilteredCertifications(filtered);
      } else {
        setFilteredCertifications(certificationsList);
      }
    }
  }, [certificationInput, showCertificationsDropdown]);


  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetchProfile(userId);
      
      if (response.success && response.data) {
        const profileData = response.data;
        setIsProfileExists(true);
        
        setFormData({
          bio: profileData.bio || "",
          ratePerHour: profileData.ratePerHour?.toString() || "",
          primaryPosition: profileData.primaryPosition || "",
          skills: profileData.skills || [],
          expertise: profileData.expertise || [],
          certifications: profileData.certifications || [],
          workHistory: profileData.workHistory?.length > 0 ? profileData.workHistory : [{
            id: generateId(),
            title: "",
            department: "",
            departmentType: "",
            experienceLevel: "",
            location: "",
            fromDate: "",
            toDate: ""
          }],
          degrees: profileData.degrees?.length > 0 ? profileData.degrees : [{
            id: generateId(),
            degree: "",
            institution: "",
            yearCompleted: ""
          }],
          profileImageUrl: profileData.profileImage?.startsWith('/uploads') 
            ? `${process.env.NEXT_PUBLIC_BASE_URL}${profileData.profileImage}`
            : profileData.profileImage || "",
          profileImage: profileData.profileImage || ""
        });
      } else {
        setIsProfileExists(false);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  // Handle auto-resize of textarea
  const handleTextareaInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Handle basic input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    
    // Create a preview for the UI using blob URL (this is temporary, just for display)
    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      profileImageUrl: previewUrl // For preview only
    }));
    
    // Upload the file
    try {
      const formData = new FormData();
      formData.append('profileImage', file);
      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_POST_PROFILE_PIC}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      const result = response.data;
      
      if (result.success) {
        setFormData(prev => ({
          ...prev,
          profileImage: result.data.imagePath 
        }));
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      toast.error('Error uploading image');
      console.error('Error uploading image:', error);
    }
  }
};

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

// Updated addTag function
const addTag = (type: 'skills' | 'expertise' | 'certifications', value: string) => {
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
  if (type === 'skills') {
    setSkillInput("");
  } else if (type === 'expertise') {
    setExpertiseInput("");
  } else if (type === 'certifications') {
    setCertificationInput("");
  }
};

  // Remove tag
  const removeTag = (type: 'skills' | 'expertise' | 'certifications', index: number) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  // Add work history entry
  const addWorkHistory = () => {
    const newWorkHistory: WorkHistory = {
      id: generateId(),
      title: "",
      department: "",
      departmentType: "",
      experienceLevel: "",
      location: "",
      fromDate: "",
      toDate: ""
    };
    
    setFormData(prev => ({
      ...prev,
      workHistory: [...prev.workHistory, newWorkHistory]
    }));
  };

  // Update work history entry
  const updateWorkHistory = (id: string, field: keyof WorkHistory, value: string) => {
    setFormData(prev => ({
      ...prev,
      workHistory: prev.workHistory.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  // Remove work history entry
  const removeWorkHistory = (id: string) => {
    if (formData.workHistory.length <= 1) return; // Keep at least one entry
    
    setFormData(prev => ({
      ...prev,
      workHistory: prev.workHistory.filter(item => item.id !== id)
    }));
  };

  // Add degree entry
  const addDegree = () => {
    const newDegree: Degree = {
      id: generateId(),
      degree: "",
      institution: "",
      yearCompleted: ""
    };
    
    setFormData(prev => ({
      ...prev,
      degrees: [...prev.degrees, newDegree]
    }));
  };

  // Update degree entry
  const updateDegree = (id: string, field: keyof Degree, value: string) => {
    setFormData(prev => ({
      ...prev,
      degrees: prev.degrees.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  // Remove degree entry
  const removeDegree = (id: string) => {
    if (formData.degrees.length <= 1) return; // Keep at least one entry
    
    setFormData(prev => ({
      ...prev,
      degrees: prev.degrees.filter(item => item.id !== id)
    }));
  };

  let called = false;

  function legalSetterOnce() {
    if (called) return;
    called = true;
    setShowLegalAgreement(true);
  }


  // This effect monitors for when legal agreement is accepted while a submission is pending
  useEffect(() => {
    // If we have a pending submission AND the user has accepted the agreement, proceed with submission
    if (pendingSubmission && acceptedLegalAgreement && showLegalAgreement === false) {
      // Reset the pending flag
      setPendingSubmission(false);
      // Proceed with actual submission
      submitProfileData();
    }
  }, [pendingSubmission, acceptedLegalAgreement, showLegalAgreement]);

// The function that handles the actual API call and data processing
const submitProfileData = async (): Promise<void> => {
  try {
    setIsLoading(true);
    
    if (!userId) {
      toast.error("User ID is required to save profile");
      return;
    }
    
    if (!formData) {
      toast.error("Form data is missing");
      return;
    }
    if (formData.profileImageUrl?.startsWith('blob:') && formData.profileImage) {
      formData.profileImageUrl = formData.profileImage as unknown as string;
    }
    const response = await saveProfile(
      formData, 
      userId, 
      isProfileExists && typeof userId === 'string' ? userId : null
    );
    
    if (response?.data?.success) {
      // If creating a new profile, save the profileId
      if (!isProfileExists && response.data.data?._id) {
        setIsProfileExists(true);
      }
      
      toast.success(isProfileExists ? "Profile updated successfully" : "Profile created successfully");
      
      try {
        // Refetch user profile to ensure we have the latest data
        await fetchUserProfile();
        // router.push("/profile");
      } catch (fetchError) {
        console.error("Error fetching updated profile:", fetchError);
        router.push("/profile/freelancer");
      }
    } else {
      const errorMessage = response?.data?.message || "Unknown error in response";
      toast.error(errorMessage);
    }
  } catch (error) {
    // Error handling
    if (error instanceof AxiosError) {
      const statusCode = error.response?.status;
      const errorMessage = error.response?.data?.message || "An error occurred while saving";
      
      if (statusCode === 401) {
        toast.error("Authentication required. Please login again.");
      } else if (statusCode === 403) {
        toast.error("You don't have permission to perform this action");
      } else {
        toast.error(errorMessage);
      }
      
      console.error(`Axios error (${statusCode}) saving profile:`, error);
    } else if (error instanceof Error) {
      toast.error(`Error: ${error.message}`);
      console.error("Error saving profile:", error);
    } else {
      toast.error("An unexpected error occurred");
      console.error("Unknown error:", error);
    }
  } finally {
    setIsLoading(false);
  }
};
  // Handle form submission
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    
    // If legal agreement is already accepted, proceed immediately
    if (acceptedLegalAgreement) {
      submitProfileData();
      return;
    }
    
    // Legal agreement not yet accepted - show the modal and mark as pending
    setPendingSubmission(true);
    legalSetterOnce();
    // Now wait for the useEffect to trigger when acceptedLegalAgreement becomes true
  };

  // Handle form cancellation
  const handleCancel = () => {
    // Reload the original profile data or reset to defaults
    if (isProfileExists) {
      fetchUserProfile();
    } else {
      // Reset to defaults
      setFormData({
        bio: "",
        ratePerHour: "",
        primaryPosition: "",
        skills: [],
        expertise: [],
        certifications: [],
        workHistory: [
          {
            id: generateId(),
            title: "",
            department: "",
            departmentType: "",
            experienceLevel: "",
            location: "",
            fromDate: "",
            toDate: ""
          }
        ],
        degrees: [
          {
            id: generateId(),
            degree: "",
            institution: "",
            yearCompleted: ""
          }
        ],
        profileImage: null,
        profileImageUrl: "",
      });
    }
    
    toast.success("Changes discarded");
  };

  // Handle preview - could be expanded in future
  const handlePreview = () => {
    router.push('/profile/freelancer')
  };

  // Initialize textarea height on mount
  useEffect(() => {
    if (formData.bio && textareaRef.current) {
      handleTextareaInput();
    }
  }, [formData.bio]);

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
    <main className="p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-275 m-auto pb-32">
        {/* Bio */}
        <div className="mb-7.5 pb-7.5 border-b border-b-boldblue flex flex-col sm:flex-row sm:items-center gap-5">
          {/* Profile picture && Name */}
          <div className="relative w-22 h-22 bg-gray-300 border border-boldblue rounded-full flex items-center justify-center mx-auto sm:mx-0">
            <div className="absolute flex items-center justify-center w-full h-full">
              {formData?.profileImageUrl ? (
                <img 
                  src={formData.profileImageUrl}
                  alt="Profile"
                  width={88}
                  height={88}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <IoMdImages size={40} className="text-white/70" />
              )}
            </div>
            <button 
              type="button"
              onClick={handleProfileImageClick}
              className="absolute bottom-0 right-0 z-20 h-7 w-7 bg-white rounded-full flex items-center justify-center border border-boldblue"
            >
              <MdEdit size={14} className="text-boldblue" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleProfileImageChange}
              accept="image/*"
              className="hidden" 
            />
          </div>
          <p className="text-black font-semibold text-xl">{name}</p>
        </div>
  
        {/* About Me / Bio */}
        <div className="mb-7.5 pb-7.5 border-b border-b-boldblue">
          <textarea
            ref={textareaRef}
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            onInput={handleTextareaInput}
            rows={1}
            className="block text-sm text-boldblue border border-boldblue rounded-lg w-full max-w-275 px-5 py-4 focus:outline focus:outline-boldblue resize-none overflow-hidden"
            placeholder="About Me/Bio"
          ></textarea>
        </div>
  
        {/* Rate per hour */}
        <div className="mb-7.5 pb-7.5 border-b border-b-boldblue">
          <div className="flex justify-between border border-boldblue rounded-lg w-full max-w-75 px-5 py-4 text-sm text-boldblue">
            <input 
              type="text" 
              name="ratePerHour"
              value={formData.ratePerHour}
              onChange={handleInputChange}
              className="outline-none placeholder:font-semibold w-[80%]" 
              placeholder="Rate per hour" 
            />
            <span>Rate</span>
          </div>
        </div>
  
        {/* Primary position/Title + Skills + Expertise */}
        <div className="mb-7.5 pb-7.5 border-b border-b-boldblue">
          <input 
            type="text" 
            name="primaryPosition"
            value={formData.primaryPosition}
            onChange={handleInputChange}
            className="block mb-7.5 placeholder:font-semibold text-sm text-boldblue border border-boldblue rounded-lg w-full max-w-75 px-5 py-4 focus:outline focus:outline-boldblue" 
            placeholder="Primary position/Title" 
          />
          
          {/* Skills */}
          <div className="flex flex-wrap items-center mb-7.5 gap-2.5">
            <div className="relative w-full max-w-75">
              <div className="flex justify-between border border-boldblue rounded-lg w-full px-5 py-4 text-sm text-boldblue">
                <input 
                  type="text" 
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onFocus={() => {
                    setShowSkillsDropdown(true)
                    setFilteredSkills(skillsList);}}
                    onBlur={() => setTimeout(() => setShowSkillsDropdown(false), 200)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (skillInput) addTag('skills', skillInput);
                    }
                  }}
                  className="outline-none placeholder:font-semibold w-[80%]" 
                  placeholder="Skills" 
                />
                <button 
                  type="button" 
                  onClick={() => {
                    if (skillInput) addTag('skills', skillInput);
                  }}
                  className="focus:outline-none"
                >
                  <IoIosSearch />
                </button>
              </div>
              
              {/* Skills dropdown */}
              {showSkillsDropdown && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-boldblue rounded-lg shadow-lg max-h-48 overflow-y-scroll dropdown-scrollbar"
                    onMouseDown={(e) => e.preventDefault()} // Prevent blur event from firing
                >
                  {filteredSkills.map((skill, idx) => (
                    <div 
                      key={`skill-option-${idx}`} 
                      className="px-4 py-2 hover:bg-deepskyblue hover:text-white cursor-pointer text-sm"
                      onMouseDown={(e) => {
                        e.preventDefault(); // Prevent blur event from firing
                        addTag('skills', skill);
                      }}
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {formData.skills.map((skill, index) => (
              <div 
                key={`skill-${index}`} 
                className="flex flex-row justify-between items-center px-2.5 py-1.25 gap-2.5 bg-deepskyblue rounded-[37px] text-xs text-white"
              >
                {skill}
                <button 
                  type="button"
                  onClick={() => removeTag('skills', index)}
                  className="font-semibold text-sm ml-1 focus:outline-none hover:text-red-500 transition transform active:scale-95 cursor-pointer"
                >
                  <IoCloseOutline size={16} />
                </button>
              </div>
            ))}
          </div>
          
          {/* Expertise */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative w-full max-w-75">
              <div className="flex justify-between border border-boldblue rounded-lg w-full px-5 py-4 text-sm text-boldblue">
                <input 
                  type="text"
                  value={expertiseInput}
                  onChange={(e) => setExpertiseInput(e.target.value)}
                  onFocus={() => {
                    setShowExpertiseDropdown(true)
                    setFilteredExpertise(expertiseList);
                  }}
                  onBlur={() => setTimeout(() => setShowExpertiseDropdown(false), 200)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (expertiseInput) addTag('expertise', expertiseInput);
                    }
                  }}
                  className="outline-none placeholder:font-semibold w-[80%]" 
                  placeholder="Expertise" 
                />
                <button 
                  type="button" 
                  onClick={() => {
                    if (expertiseInput) addTag('expertise', expertiseInput);
                  }}
                  className="focus:outline-none"
                >
                  <IoIosSearch />
                </button>
              </div>
              
              {/* Expertise dropdown */}
              {showExpertiseDropdown && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-boldblue rounded-lg shadow-lg max-h-48 overflow-y-scroll dropdown-scrollbar"
                    onMouseDown={(e) => e.preventDefault()} // Prevent blur event from firing
                >
                  {filteredExpertise.map((exp, idx) => (
                    <div 
                      key={`expertise-option-${idx}`} 
                      className="px-4 py-2 hover:bg-deepskyblue hover:text-white cursor-pointer text-sm"
                      onMouseDown={(e) => {
                        e.preventDefault(); // Prevent blur event from firing
                        addTag('expertise', exp);
                      }}
                    >
                      {exp}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {formData.expertise.map((item, index) => (
              <div 
                key={`expertise-${index}`} 
                className="flex flex-row justify-between items-center px-2.5 py-1.25 gap-2.5 bg-deepskyblue rounded-[37px] text-xs text-white"
              >
                {item}
                <button 
                  type="button"
                  onClick={() => removeTag('expertise', index)}
                  className="font-semibold text-sm ml-1 focus:outline-none cursor-pointer transition transform active:scale-95 hover:text-red-500"
                >
                  <IoCloseOutline size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
  
        {/* Certification */}
        <div className="mb-7.5 pb-7.5 border-b border-b-boldblue">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative w-full max-w-75">
              <div className="flex justify-between border border-boldblue rounded-lg w-full px-5 py-4 text-sm text-boldblue">
                <input 
                  type="text"
                  value={certificationInput}
                  onFocus={() => {
                    setShowCertificationsDropdown(true);
                    setFilteredCertifications(certificationsList);
                  }}
                  onBlur={() => setTimeout(() => setShowCertificationsDropdown(false), 200)}
                  onChange={(e) => setCertificationInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (certificationInput) addTag('certifications', certificationInput);
                    }
                  }}
                  className="outline-none placeholder:font-semibold w-[80%]" 
                  placeholder="Certifications" 
                />
                <button 
                  type="button" 
                  onClick={() => {
                    if (certificationInput) addTag('certifications', certificationInput);
                  }}
                  className="focus:outline-none"
                >
                  <IoIosSearch />
                </button>
              </div>
              
              {/* Certifications dropdown */}
              {showCertificationsDropdown && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-boldblue rounded-lg shadow-lg max-h-48 overflow-y-scroll dropdown-scrollbar"
                    onMouseDown={(e) => e.preventDefault()} // Prevent blur event from firing
                >
                  {filteredCertifications.map((cert, idx) => (
                    <div 
                      key={`cert-option-${idx}`} 
                      className="px-4 py-2 hover:bg-aquagreen hover:text-white cursor-pointer text-sm"
                      onMouseDown={(e) => {
                        e.preventDefault(); // Prevent blur event from firing
                        addTag('certifications', cert);
                      }}
                    >
                      {cert}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {formData.certifications.map((cert, index) => (
              <div 
                key={`cert-${index}`} 
                className="flex flex-row justify-between items-center px-2.5 py-1.25 gap-2.5 bg-aquagreen rounded-[37px] text-xs text-white"
              >
                {cert}
                <button 
                  type="button"
                  onClick={() => removeTag('certifications', index)}
                  className="font-semibold text-sm ml-1 focus:outline-none cursor-pointer transition transform active:scale-95  hover:text-red-500"
                >
                  <IoCloseOutline size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
  
        {/* Work History */}
        <div className="mb-7.5">
          <h3 className="mb-7.5 font-semibold text-black">Work History</h3>
          
          {formData.workHistory.map((work, index) => (
            <div key={work.id} className="mb-10">
              <div className="flex justify-between mb-5">
                <h4 className="font-semibold">Work Experience {index + 1}</h4>
                {formData.workHistory.length > 1 && (
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
  
              <div className="flex items-start gap-7.5 mb-7.5">
                <input 
                  type="text"
                  value={work.department}
                  onChange={(e) => updateWorkHistory(work.id, 'department', e.target.value)}
                  className="placeholder:font-semibold text-sm text-boldblue border border-boldblue rounded-lg w-full max-w-[242px] px-5 py-4 focus:outline focus:outline-boldblue" 
                  placeholder="Department/Agency" 
                />
                
                <div className="flex items-center gap-2.5">
                  <input 
                    type="radio" 
                    id={`state-${work.id}`} 
                    name={`department-type-${work.id}`} 
                    value="state" 
                    checked={work.departmentType === "state"}
                    onChange={() => updateWorkHistory(work.id, 'departmentType', 'state')}
                  />
                  <label htmlFor={`state-${work.id}`}>State</label>
                  
                  <input 
                    type="radio" 
                    id={`federal-${work.id}`} 
                    name={`department-type-${work.id}`} 
                    value="federal" 
                    checked={work.departmentType === "federal"}
                    onChange={() => updateWorkHistory(work.id, 'departmentType', 'federal')}
                  />
                  <label htmlFor={`federal-${work.id}`}>Federal</label>
                </div>
                
                <input 
                  type="text"
                  value={work.experienceLevel}
                  onChange={(e) => updateWorkHistory(work.id, 'experienceLevel', e.target.value)}
                  className="placeholder:font-semibold text-sm text-boldblue border border-boldblue rounded-lg w-full max-w-[242px] px-5 py-4 focus:outline focus:outline-boldblue" 
                  placeholder="Level of Dept Experience" 
                />
              </div>
              
              <div className="mb-7.5">
                <input 
                  type="text"
                  value={work.location}
                  onChange={(e) => updateWorkHistory(work.id, 'location', e.target.value)}
                  className="placeholder:font-semibold block text-sm text-boldblue border border-boldblue rounded-lg w-full max-w-75 px-5 py-4 focus:outline focus:outline-boldblue" 
                  placeholder="Location" 
                />
              </div>
  
              <div className="flex items-center gap-7.5 mb-7.5">
                <input 
                  type="text"
                  value={work.fromDate}
                  onChange={(e) => updateWorkHistory(work.id, 'fromDate', e.target.value)}
                  className="placeholder:font-semibold block text-sm text-boldblue border border-boldblue rounded-lg w-full max-w-75 px-5 py-4 focus:outline focus:outline-boldblue" 
                  placeholder="From" 
                />
                <input 
                  type="text"
                  value={work.toDate}
                  onChange={(e) => updateWorkHistory(work.id, 'toDate', e.target.value)}
                  className="placeholder:font-semibold block text-sm text-boldblue border border-boldblue rounded-lg w-full max-w-75 px-5 py-4 focus:outline focus:outline-boldblue" 
                  placeholder="To" 
                />
              </div>
            </div>
          ))}
  
          <div>
            <button 
              type="button" 
              onClick={addWorkHistory}
              className="text-sm px-4 py-[11px]  bg-boldblue rounded-lg text-white font-semibold transition transform active:scale-95 hover:opacity-70 cursor-pointer"
            >
              Add More
            </button>
          </div>
        </div>
  
        {/* Degrees */}
        <div className="mb-7.5">
          <h3 className="mb-7.5 font-semibold text-black">Degrees</h3>
          
          {formData.degrees.map((degree) => (
            <div key={degree.id} className="flex items-start justify-start gap-7.5 mb-5">
              <input 
                type="text"
                value={degree.degree}
                onChange={(e) => updateDegree(degree.id, 'degree', e.target.value)}
                className="placeholder:font-semibold text-sm text-boldblue border border-boldblue rounded-lg w-full max-w-75 px-5 py-4 focus:outline focus:outline-boldblue" 
                placeholder="Degree" 
              />
              <input 
                type="text"
                value={degree.institution}
                onChange={(e) => updateDegree(degree.id, 'institution', e.target.value)}
                className="placeholder:font-semibold text-sm text-boldblue border border-boldblue rounded-lg w-full max-w-75 px-5 py-4 focus:outline focus:outline-boldblue" 
                placeholder="Institution" 
              />
              <input 
                type="text"
                value={degree.yearCompleted}
                onChange={(e) => updateDegree(degree.id, 'yearCompleted', e.target.value)}
                className="placeholder:font-semibold text-sm text-boldblue border border-boldblue rounded-lg w-full max-w-75 px-5 py-4 focus:outline focus:outline-boldblue" 
                placeholder="Year Completed" 
              />
              {formData.degrees.length > 1 && (
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
        
        {/* Error message */}
        {/* {error && (
          <div className="mt-5 text-red-500">{error}</div>
        )} */}
        
        {/* Sticky bottom action buttons */}
        <section className="flex items-center justify-center gap-2.5 py-7.5 px-6 fixed bottom-0 left-0 bg-skyblue w-full border-t border-t-boldblue">
          <button 
            type="button"
            onClick={handleCancel}
            className="cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out py-3 px-5 border bg-white border-boldblue text-boldblue text-sm font-semibold rounded-lg"
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={handlePreview}
            className="cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out  py-3 px-5 border bg-white border-boldblue text-boldblue text-sm font-semibold rounded-lg"
          >
            Preview Public View
          </button>
          <button 
            type="submit"
            disabled={isLoading}
            className="cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out py-3 px-5 bg-boldblue text-white text-sm font-semibold rounded-lg border border-boldblue"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </section>
      </form>
    </main>
    </>
  );
};

export default CreateFreelancerProfile;