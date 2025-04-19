
"use client"
import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import Image from "next/image";
import { IoMdImages } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { ProfileFormData, WorkHistory, Degree } from "@/types/profile";
import { generateId } from "@/utils/profile-utils";
import { fetchProfile, saveProfile, skillsList, expertiseList, certificationsList } from "@/api/profile-api";
import useAuthStore from '@/store/authStore';
import { AxiosError } from "axios";
import { toast } from "react-hot-toast"; // Assuming you use toast for notifications
import Legalagreement from "@/components/ui/legal-agreement";
import { useRouter } from 'next/router';

interface AuthStoreState {
  userId: string;
  name: string;
}

const CreateProfile = () => {
  const router = useRouter();
  // Get user ID from auth store
  const { userId, name } = useAuthStore() as AuthStoreState;

  // State for form data
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

  // State for search inputs and filtered results
  const [skillInput, setSkillInput] = useState<string>("");
  const [expertiseInput, setExpertiseInput] = useState<string>("");
  const [certificationInput, setCertificationInput] = useState<string>("");
  const [filteredSkills, setFilteredSkills] = useState<string[]>([]);
  const [filteredExpertise, setFilteredExpertise] = useState<string[]>([]);
  const [filteredCertifications, setFilteredCertifications] = useState<string[]>([]);
  
  // UI state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [error, setError] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [isProfileExists, setIsProfileExists] = useState<boolean>(false);
  const [showSkillsDropdown, setShowSkillsDropdown] = useState<boolean>(false);
  const [showExpertiseDropdown, setShowExpertiseDropdown] = useState<boolean>(false);
  const [showCertificationsDropdown, setShowCertificationsDropdown] = useState<boolean>(false);
  
  const [pendingSubmission, setPendingSubmission] = useState<boolean>(false);
  const [showLegalAgreement, setShowLegalAgreement] = useState<boolean>(false);
  const [acceptedLegalAgreement, setAcceptedLegalAgreement] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter skills, expertise, and certifications based on input
  useEffect(() => {
    console.log(profileId)
    if (skillInput.trim()) {
      const filtered = skillsList.filter(skill => 
        skill.toLowerCase().includes(skillInput.toLowerCase())
      );
      setFilteredSkills(filtered);
      setShowSkillsDropdown(true);
    } else {
      setShowSkillsDropdown(false);
    }
  }, [skillInput]);

  useEffect(() => console.log(profileId),[profileId])

  useEffect(() => {
    if (expertiseInput.trim()) {
      const filtered = expertiseList.filter(exp => 
        exp.toLowerCase().includes(expertiseInput.toLowerCase())
      );
      setFilteredExpertise(filtered);
      setShowExpertiseDropdown(true);
    } else {
      setShowExpertiseDropdown(false);
    }
  }, [expertiseInput]);

  useEffect(() => {
    if (certificationInput.trim()) {
      const filtered = certificationsList.filter(cert => 
        cert.toLowerCase().includes(certificationInput.toLowerCase())
      );
      setFilteredCertifications(filtered);
      setShowCertificationsDropdown(true);
    } else {
      setShowCertificationsDropdown(false);
    }
  }, [certificationInput]);


  // Fetch the current user's profile
  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetchProfile(userId);
      
      if (response.success && response.data) {
        // Profile exists, populate form with fetched data
        const profileData = response.data;
        setProfileId(profileData._id);
        setIsProfileExists(true);
        
        // Update form data with fetched profile
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
          profileImageUrl: profileData.profileImage || "",
          profileImage: null
        });
      } else {
        // Profile doesn't exist, keep default form values
        setIsProfileExists(false);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      // setError("Error fetching profile data");
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

  // Handle profile image selection
  const handleProfileImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        profileImage: file,
        profileImageUrl: URL.createObjectURL(file)
      }));
    }
  };

  // Handle click on profile image button
  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  // Add tag (skill, expertise, certification)
  const addTag = (type: 'skills' | 'expertise' | 'certifications', value: string) => {
    if (!value.trim()) return;
    
    // Check if the tag already exists
    if (formData[type].includes(value.trim())) return;
    
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], value.trim()]
    }));
    
    // Clear the input and dropdown
    if (type === 'skills') {
      setSkillInput("");
      setShowSkillsDropdown(false);
    } else if (type === 'expertise') {
      setExpertiseInput("");
      setShowExpertiseDropdown(false);
    } else if (type === 'certifications') {
      setCertificationInput("");
      setShowCertificationsDropdown(false);
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
    
    const response = await saveProfile(
      formData, 
      userId, 
      isProfileExists && typeof userId === 'string' ? userId : null
    );
    
    if (response?.data?.success) {
      // If creating a new profile, save the profileId
      if (!isProfileExists && response.data.data?._id) {
        setProfileId(response.data.data._id);
        setIsProfileExists(true);
      }
      
      toast.success(isProfileExists ? "Profile updated successfully" : "Profile created successfully");
      
      try {
        // Refetch user profile to ensure we have the latest data
        await fetchUserProfile();
        router.push("/profile");
      } catch (fetchError) {
        console.error("Error fetching updated profile:", fetchError);
        router.push("/profile");
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
    router.push('/profile')
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
              {formData.profileImageUrl ? (
                <Image 
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
            className="block text-sm text-boldblue border border-boldblue rounded-lg w-full max-w-275 px-5 py-4 outline-none resize-none overflow-hidden"
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
            className="block mb-7.5 placeholder:font-semibold text-sm text-boldblue border border-boldblue rounded-lg w-full max-w-75 px-5 py-4 outline-none" 
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
                  onFocus={() => setShowSkillsDropdown(true)}
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
              {showSkillsDropdown && filteredSkills.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-boldblue rounded-lg shadow-lg max-h-48 overflow-auto">
                  {filteredSkills.map((skill, idx) => (
                    <div 
                      key={`skill-option-${idx}`} 
                      className="px-4 py-2 hover:bg-deepskyblue hover:text-white cursor-pointer text-sm"
                      onClick={() => addTag('skills', skill)}
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
                className="flex flex-row justify-between items-center px-[10px] py-[5px] gap-[10px] bg-deepskyblue rounded-[37px] text-xs text-white"
              >
                {skill}
                <button 
                  type="button"
                  onClick={() => removeTag('skills', index)}
                  className="font-semibold text-sm ml-1 focus:outline-none"
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
                  onFocus={() => setShowExpertiseDropdown(true)}
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
              {showExpertiseDropdown && filteredExpertise.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-boldblue rounded-lg shadow-lg max-h-48 overflow-auto">
                  {filteredExpertise.map((exp, idx) => (
                    <div 
                      key={`expertise-option-${idx}`} 
                      className="px-4 py-2 hover:bg-deepskyblue hover:text-white cursor-pointer text-sm"
                      onClick={() => addTag('expertise', exp)}
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
                className="flex flex-row justify-between items-center px-[10px] py-[5px] gap-[10px] bg-deepskyblue rounded-[37px] text-xs text-white"
              >
                {item}
                <button 
                  type="button"
                  onClick={() => removeTag('expertise', index)}
                  className="font-semibold text-sm ml-1 focus:outline-none"
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
                  onFocus={() => setShowCertificationsDropdown(true)}
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
              {showCertificationsDropdown && filteredCertifications.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-boldblue rounded-lg shadow-lg max-h-48 overflow-auto">
                  {filteredCertifications.map((cert, idx) => (
                    <div 
                      key={`cert-option-${idx}`} 
                      className="px-4 py-2 hover:bg-aquagreen hover:text-white cursor-pointer text-sm"
                      onClick={() => addTag('certifications', cert)}
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
                className="flex flex-row justify-between items-center px-[10px] py-[5px] gap-[10px] bg-aquagreen rounded-[37px] text-xs text-white"
              >
                {cert}
                <button 
                  type="button"
                  onClick={() => removeTag('certifications', index)}
                  className="font-semibold text-sm ml-1 focus:outline-none"
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
                    className="text-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <input 
                type="text" 
                value={work.title}
                onChange={(e) => updateWorkHistory(work.id, 'title', e.target.value)}
                className="placeholder:font-semibold mb-7.5 block text-sm text-boldblue border border-boldblue rounded-lg w-full max-w-157.5 px-5 py-4 outline-none" 
                placeholder="Title" 
              />
  
              <div className="flex items-start gap-7.5 mb-7.5">
                <input 
                  type="text"
                  value={work.department}
                  onChange={(e) => updateWorkHistory(work.id, 'department', e.target.value)}
                  className="placeholder:font-semibold text-sm text-boldblue border border-boldblue rounded-lg w-full max-w-[242px] px-5 py-4 outline-none" 
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
                  className="placeholder:font-semibold text-sm text-boldblue border border-boldblue rounded-lg w-full max-w-[242px] px-5 py-4 outline-none" 
                  placeholder="Level of Dept Experience" 
                />
              </div>
              
              <div className="mb-7.5">
                <input 
                  type="text"
                  value={work.location}
                  onChange={(e) => updateWorkHistory(work.id, 'location', e.target.value)}
                  className="placeholder:font-semibold block text-sm text-boldblue border border-boldblue rounded-lg w-full max-w-75 px-5 py-4 outline-none" 
                  placeholder="Location" 
                />
              </div>
  
              <div className="flex items-center gap-7.5 mb-7.5">
                <input 
                  type="text"
                  value={work.fromDate}
                  onChange={(e) => updateWorkHistory(work.id, 'fromDate', e.target.value)}
                  className="placeholder:font-semibold block text-sm text-boldblue border border-boldblue rounded-lg w-full max-w-75 px-5 py-4 outline-none" 
                  placeholder="From" 
                />
                <input 
                  type="text"
                  value={work.toDate}
                  onChange={(e) => updateWorkHistory(work.id, 'toDate', e.target.value)}
                  className="placeholder:font-semibold block text-sm text-boldblue border border-boldblue rounded-lg w-full max-w-75 px-5 py-4 outline-none" 
                  placeholder="To" 
                />
              </div>
            </div>
          ))}
  
          <div>
            <button 
              type="button" 
              onClick={addWorkHistory}
              className="text-sm px-4 py-[11px] bg-boldblue rounded-lg text-white font-semibold"
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
                className="placeholder:font-semibold text-sm text-boldblue border border-boldblue rounded-lg w-full max-w-75 px-5 py-4 outline-none" 
                placeholder="Degree" 
              />
              <input 
                type="text"
                value={degree.institution}
                onChange={(e) => updateDegree(degree.id, 'institution', e.target.value)}
                className="placeholder:font-semibold text-sm text-boldblue border border-boldblue rounded-lg w-full max-w-75 px-5 py-4 outline-none" 
                placeholder="Institution" 
              />
              <input 
                type="text"
                value={degree.yearCompleted}
                onChange={(e) => updateDegree(degree.id, 'yearCompleted', e.target.value)}
                className="placeholder:font-semibold text-sm text-boldblue border border-boldblue rounded-lg w-full max-w-75 px-5 py-4 outline-none" 
                placeholder="Year Completed" 
              />
              {formData.degrees.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeDegree(degree.id)}
                  className="text-red-500 px-2"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          
          <button 
            type="button"
            onClick={addDegree}
            className="text-sm px-4 py-[11px] bg-boldblue rounded-lg text-white font-semibold"
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
            className="cursor-pointer active:opacity-70 py-3 px-5 border bg-white border-boldblue text-boldblue text-sm font-semibold rounded-lg"
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={handlePreview}
            className="cursor-pointer active:opacity-70  py-3 px-5 border bg-white border-boldblue text-boldblue text-sm font-semibold rounded-lg"
          >
            Preview Public View
          </button>
          <button 
            type="submit"
            disabled={isLoading}
            className="cursor-pointer active:opacity-70 py-3 px-5 bg-boldblue text-white text-sm font-semibold rounded-lg border border-boldblue"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </section>
      </form>
    </main>
    </>
  );
};

export default CreateProfile;