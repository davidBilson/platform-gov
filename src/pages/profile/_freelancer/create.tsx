"use client"
import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { useRouter } from 'next/router';
import useAuthStore from '@/store/useAuth';
import { ProfileFormData, WorkHistory, Degree } from "@/types/profile";
// API
import { fetchProfile } from "../../../api/profile-api";
// Utils
import { generateId } from "@/utils/profiles/profile.contractor";
import { handleTextAreaInput, handleInputChange, handleProfileImageChange, addTag, removeTag, addWorkHistory, updateWorkHistory, removeWorkHistory, addDegree, updateDegree, removeDegree, submitProfileData } from "@/utils/profiles/profile.contractor";
import { usaStates, canadaStates, ukStates, australiaStates } from '@/utils/countryAndStates/index';
import { clearanceLevels } from "@/utils/govtAgencyAndClearanceIndex/departmentAgenciesClearances";

import { ProfessionalFieldsAndAreasOfExpertise152 } from "@/utils/feedFilter/152ProfessionalFieldsAndAreasOfExpertise";
import { certificatesAndEducationList } from "@/utils/feedFilter/CertificatesAndEducationList";
import { GovernmentDepartmentsAndAgenciesByCountry } from "@/utils/feedFilter/GovernmentDepartmentsAndAgenciesByCountry";
// UI Components
import Legalagreement from "@/components/ui/legal-agreement";
import { toast } from "react-toastify";
// Icons
import { IoMdImages, IoIosSearch } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";

const statesByCountry = { USA: usaStates, UK: ukStates, Canada: canadaStates, Australia: australiaStates };
const firmOptions = ["Janus Global Advisors"];

const CreateFreelancerProfile = () => {

  const router = useRouter();
  const { userId, name } = useAuthStore();

  const [formData, setFormData] = useState<ProfileFormData>({
    bio: "",
    ratePerHour: "",
    secondRate: "",
    profession: "",
    primaryPosition: "",
    skills: [],
    certifications: [],
    expertise: [],
    firmAffiliation: "",
    clearance: "",
    location: {
      country: "",
      state: ""
    },
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
        yearCompleted: "",
        gpa: "" // optional
      }
    ],
    profileImage: null,
    profileImageUrl: "",
  });

  const [skillInput, setSkillInput] = useState<string>("");
  const [certificationInput, setCertificationInput] = useState<string>("");
  const [filteredSkills, setFilteredSkills] = useState<string[]>([]);
  const [filteredCertifications, setFilteredCertifications] = useState<string[]>([]);
  const [expertiseInput, setExpertiseInput] = useState<string>("");
  const [filteredExpertise, setFilteredExpertise] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProfileExists, setIsProfileExists] = useState<boolean>(false);
  const [showSkillsDropdown, setShowSkillsDropdown] = useState<boolean>(false);
  const [showCertificationsDropdown, setShowCertificationsDropdown] = useState<boolean>(false);
  const [showExpertiseDropdown, setShowExpertiseDropdown] = useState<boolean>(false);
  const [showStatesDropdown, setShowStatesDropdown] = useState<boolean>(false);
  const [showFirmDropdown, setShowFirmDropdown] = useState<boolean>(false);
  const [showClearancesDropdown, setShowClearancesDropdown] = useState<boolean>(false);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState<boolean>(false);
  const [showExperienceDropdown, setShowExperienceDropdown] = useState<boolean>(false);
  const [pendingSubmission, setPendingSubmission] = useState<boolean>(false);
  const [showLegalAgreement, setShowLegalAgreement] = useState<boolean>(false);
  const [acceptedLegalAgreement, setAcceptedLegalAgreement] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = () => {
    const errors: string[] = [];

    // Check work history requirements
    formData.workHistory.forEach((work, index) => {
      // if (!work.department.trim()) {
      //   errors.push(`Work Experience ${index + 1}: Department/Agency is required`);
      // }
      // if (!work.departmentType) {
      //   errors.push(`Work Experience ${index + 1}: Please select State or Federal`);
      // }
      // if (!work.fromDate.trim()) {
      //   errors.push(`Work Experience ${index + 1}: From date is required`);
      // }
      // if (!work.toDate.trim()) {
      //   errors.push(`Work Experience ${index + 1}: To date is required`);
      // }
    });

    return errors;
  };

  const validateYear = (year: string) => {
    const currentYear = new Date().getFullYear();
    const numYear = parseInt(year);

    if (isNaN(numYear) || numYear < 1925 || numYear > currentYear) {
      return false;
    }
    return true;
  };

  const handleYearInput = (e: ChangeEvent<HTMLInputElement>, workId: string, field: keyof WorkHistory) => {
    const value = e.target.value;

    // Only allow numbers and "present" for toDate
    if (field === 'toDate' && value.toLowerCase() === 'present') {
      updateWorkHistoryWrapper(workId, field, 'Present');
      return;
    }

    // Only allow numbers for year fields
    if (!/^\d*$/.test(value)) {
      return;
    }

    // For year fields, validate range
    if (value && value.length === 4) {
      if (!validateYear(value)) {
        toast.error(`Invalid year input!`);
        return;
      }
    }

    updateWorkHistoryWrapper(workId, field, value);
  };

  const handleDegreeYearInput = (e: any, degreeId: string) => {
    const value = e.target.value;

    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      return;
    }

    // Validate year range
    if (value && value.length === 4) {
      if (!validateYear(value)) {
        toast.error(`Invalid year input!`);
        return;
      }
    }

    updateDegreeWrapper(degreeId, 'yearCompleted', value);
  };

  const handleCurrentRoleChange = (workId: string, isChecked: boolean) => {
    if (isChecked) {
      updateWorkHistoryWrapper(workId, 'toDate', 'Present');
    } else {
      updateWorkHistoryWrapper(workId, 'toDate', '');
    }
  };

  useEffect(() => {
    if (showSkillsDropdown) {
      const availableSkills = ProfessionalFieldsAndAreasOfExpertise152.filter(skill => !formData.skills.includes(skill));

      if (skillInput.trim()) {
        const filtered = availableSkills.filter(skill => skill.toLowerCase().includes(skillInput.toLowerCase()));
        setFilteredSkills(filtered);
      } else {
        setFilteredSkills(availableSkills);
      }
    } else {
      setFilteredSkills(ProfessionalFieldsAndAreasOfExpertise152.filter(skill => !formData.skills.includes(skill)));
    }
  }, [skillInput, formData.skills, showSkillsDropdown]);

  useEffect(() => {
    if (showExpertiseDropdown) {
      const availableExpertise = ProfessionalFieldsAndAreasOfExpertise152.filter(exp => !formData.expertise.includes(exp));

      if (expertiseInput.trim()) {
        const filtered = availableExpertise.filter(exp => exp.toLowerCase().includes(expertiseInput.toLowerCase()));
        setFilteredExpertise(filtered);
      } else {
        setFilteredExpertise(availableExpertise);
      }
    } else {
      setFilteredExpertise(ProfessionalFieldsAndAreasOfExpertise152.filter(exp => !formData.expertise.includes(exp)));
    }
  }, [expertiseInput, formData.expertise, showExpertiseDropdown]);

  useEffect(() => {
    if (showCertificationsDropdown) {
      const availableCertifications = certificatesAndEducationList.filter(cert => !formData.certifications.includes(cert));

      if (certificationInput.trim()) {
        const filtered = availableCertifications.filter(cert => cert.toLowerCase().includes(certificationInput.toLowerCase()));
        setFilteredCertifications(filtered);
      } else {
        setFilteredCertifications(availableCertifications);
      }
    } else {
      setFilteredCertifications(certificatesAndEducationList.filter(cert => !formData.certifications.includes(cert)));
    }
  }, [certificationInput, formData.certifications, showCertificationsDropdown]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetchProfile(userId, 'contractor');

      if (response.success && response.data) {
        setIsProfileExists(true);
        const profileData = response.data;

        setFormData({
          bio: profileData.bio || "",
          ratePerHour: profileData.ratePerHour?.toString() || "",
          secondRate: profileData.secondRate?.toString() || "",
          primaryPosition: profileData.primaryPosition || "",
          profession: profileData.profession || "",
          clearance: profileData.clearance || "",
          skills: profileData.skills || [],
          expertise: profileData.expertise || [],
          certifications: profileData.certifications || [],
          firmAffiliation: profileData.firmAffiliation || "",
          location: {
            country: profileData?.location?.country || "",
            state: profileData?.location?.state || ""
          },
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
            yearCompleted: "",
            gpa: ""
          }],
          profileImageUrl: profileData.profileImage?.startsWith('/uploads')
            ? `${process.env.NEXT_PUBLIC_BASE_URL}${profileData.profileImage}`
            : profileData.profileImage || "",
          profileImage: profileData.profileImage || ""
        });

        return { success: true, data: response.data };

      } else {
        setIsProfileExists(false);
        return { success: false };
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const handleTextAreaInputWrapper = () => {
    handleTextAreaInput(textareaRef);
  };

  const handleInputChangeWrapper = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.name === 'bio') {
      // Change from word count to character count
      if (e.target.value.length > 1500) {
        // Truncate to 1500 characters instead of words
        const truncatedText = e.target.value.substring(0, 1500);
        setFormData({
          ...formData,
          bio: truncatedText
        });
        return;
      }
    }
    handleInputChange(e, setFormData);
  };

  const handleProfileImageChangeWrapper = async (e: ChangeEvent<HTMLInputElement>) => {
    await handleProfileImageChange(e, setFormData);
  };

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const addTagWrapper = (type: 'skills' | 'expertise' | 'certifications', value: string) => {
    const setInputFunc = type === 'skills' ? setSkillInput :
      type === 'expertise' ? setExpertiseInput :
        type === 'certifications' ? setCertificationInput : null;
    addTag(type, value, formData, setFormData, setInputFunc);
  };
  const removeTagWrapper = (type: 'skills' | 'expertise' | 'certifications', index: number) => { removeTag(type, index, setFormData) };
  const addWorkHistoryWrapper = () => { addWorkHistory(setFormData) };
  const updateWorkHistoryWrapper = (id: string, field: keyof WorkHistory, value: string) => { updateWorkHistory(id, field, value, setFormData); };
  const removeWorkHistoryWrapper = (id: string) => { removeWorkHistory(id, formData, setFormData) };
  const addDegreeWrapper = () => { addDegree(setFormData) };
  const updateDegreeWrapper = (id: string, field: keyof Degree, value: string) => { updateDegree(id, field, value, setFormData); };
  const removeDegreeWrapper = (id: string) => { removeDegree(id, formData, setFormData) };

  let called = false;
  function legalSetterOnce() {
    if (called) return;
    called = true;
    setShowLegalAgreement(true);
  }

  const submitProfileDataWrapper = async () => {
    await submitProfileData(
      formData,
      userId,
      isProfileExists,
      setIsLoading,
      setIsProfileExists,
      toast,
      router,
      fetchUserProfile
    );
  };

  useEffect(() => {
    if (pendingSubmission && acceptedLegalAgreement && showLegalAgreement === false) {
      setPendingSubmission(false);
      submitProfileDataWrapper();
    }
  }, [pendingSubmission, acceptedLegalAgreement, showLegalAgreement]);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => toast.error(error));
      return;
    }

    if (acceptedLegalAgreement) {
      submitProfileDataWrapper();
      return;
    }
    setPendingSubmission(true);
    legalSetterOnce();
  };

  const handlePreview = async () => {
    if (isProfileExists) {
      router.push('/profile');
      return;
    }

    const profileResult = await fetchUserProfile();

    if (profileResult.success) {
      router.push('/profile');
    } else {
      toast.error("Please save your profile before previewing public view");
    }
  };

  useEffect(() => {
    if (formData.bio && textareaRef.current) {
      handleTextAreaInput();
    }
  }, [formData.bio]);

  return (
    <>
      {showLegalAgreement && <Legalagreement setShowLegalAgreement={setShowLegalAgreement} acceptedLegalAgreement={acceptedLegalAgreement} setAcceptedLegalAgreement={setAcceptedLegalAgreement} />}
      <main className="p-6">
        <form onSubmit={handleSubmit} className="w-full max-w-275 m-auto pb-32">
          <div className="mb-7.5 pb-7.5 border-b border-b-deepskyblue flex flex-col sm:flex-row sm:items-center gap-5">

            <div className="relative w-22 h-22  bg-gray-300 border border-boldblue rounded-full flex items-center justify-center mx-auto sm:mx-0">
              <div className="w-[88px] rounded-full h-[88px] overflow-hidden absolute flex items-center justify-center">
                {formData?.profileImageUrl ? (
                  <img
                    src={formData.profileImageUrl}
                    alt="Profile"
                    className="w-full h-full object-cover object-center"
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
                onChange={handleProfileImageChangeWrapper}
                accept="image/*"
                className="hidden"
              />
            </div>
            <p className="text-black font-semibold text-xl">{name}</p>
          </div>

          <div className="mb-7.5 pb-7.5 border-b border-b-deepskyblue">
            <textarea
              ref={textareaRef}
              name="bio"
              value={formData.bio}
              onChange={handleInputChangeWrapper}
              onInput={handleTextAreaInputWrapper}
              maxLength={1500}
              rows={1}
              className="block text-sm text-boldblue border border-boldblue rounded-lg w-full max-w-275 px-5 py-4 focus:outline focus:outline-boldblue resize-none overflow-hidden scrollbar-hide"
              placeholder="About Me/Bio"
            ></textarea>
            <div className="text-right text-xs text-gray-500 mt-1">
              {formData.bio.length}/1500
            </div>
          </div>

          <div className="mb-7.5 pb-7.5 border-b border-b-deepskyblue flex flex-wrap items-center gap-4">
            <div className="flex justify-between border border-boldblue rounded-lg w-full max-w-75 px-5 py-4 text-sm text-boldblue">
              <input
                type="text"
                name="ratePerHour"
                value={formData.ratePerHour}
                onChange={handleInputChangeWrapper}
                className="outline-none placeholder:font-semibold w-[80%]"
                placeholder="Rate per hour"
              />
              <span>Rate</span>
            </div>
            <div className="flex justify-between border border-boldblue rounded-lg w-full max-w-75 px-5 py-4 text-sm text-boldblue">
              <input
                type="text"
                name="secondRate"
                value={formData.secondRate}
                onChange={handleInputChangeWrapper}
                className="outline-none placeholder:font-semibold w-[80%]"
                placeholder="Second Rate (optional)"
              />
              <span>Rate</span>
            </div>
          </div>

          <div className="mb-7.5 pb-7.5 border-b border-b-deepskyblue">
            <input
              type="text"
              name="primaryPosition"
              value={formData.primaryPosition}
              onChange={handleInputChangeWrapper}
              className="block mb-7.5 placeholder:font-semibold text-sm text-boldblue border border-boldblue rounded-lg w-full max-w-75 px-5 py-4 focus:outline focus:outline-boldblue"
              placeholder="Consultant Focus Area"
            />

            {/* <div className="relative w-full max-w-75 mb-7.5">

              <div className="flex justify-between border border-boldblue rounded-lg w-full px-5 py-4 text-sm text-boldblue">
                <input
                  type="text"
                  value={formData.profession}
                  onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                  onFocus={() => setShowProfessionalFieldsDropdown(true)}
                  onBlur={() => setTimeout(() => setShowProfessionalFieldsDropdown(false), 200)}
                  className="outline-none placeholder:font-semibold w-[80%]"
                  placeholder="Professional Field"
                />
                <IoIosSearch />
              </div>

              {showProfessionalFieldsDropdown && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-boldblue rounded-lg shadow-lg max-h-48 overflow-y-scroll dropdown-scrollbar"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {ProfessionalFieldsAndAreasOfExpertise152
                    .filter(field =>
                      formData.profession
                        ? field.toLowerCase().includes(formData.profession.toLowerCase())
                        : true
                    )
                    .map((field, idx) => (
                      <div
                        key={`professional-field-${idx}`}
                        className="px-4 py-2 hover:bg-deepskyblue hover:text-white cursor-pointer text-sm"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setFormData({
                            ...formData,
                            profession: field
                          });
                          setShowProfessionalFieldsDropdown(false);
                        }}
                      >
                        {field}
                      </div>
                    ))
                  }
                </div>
              )}
            </div> */}


            {/* Firm Affiliation */}
            <div className="mb-7.5">
              <div className="flex items-center gap-2.5 text-boldblue text-sm">
                <div className="flex items-center gap-2.5 mb-2.5 ">
                  <input
                    type="radio"
                    id="independent"
                    name="firmAffiliation"
                    value="independent"
                    checked={formData.firmAffiliation === "independent"}
                    onChange={() => setFormData({ ...formData, firmAffiliation: "independent" })}
                  />
                  <label htmlFor="independent">Independent</label>
                </div>

                <div className="flex items-center gap-2.5 mb-2.5">
                  <input
                    type="radio"
                    id="firm"
                    name="firmAffiliation"
                    value="firm"
                    checked={formData.firmAffiliation !== "independent"}
                    onChange={() => setFormData({ ...formData, firmAffiliation: "" })}
                  />
                  <label htmlFor="firm">Firm Affiliation</label>
                </div>
              </div>

              {formData.firmAffiliation !== "independent" && (
                <div className="relative w-full max-w-75">
                  <div className="flex justify-between border border-boldblue rounded-lg w-full px-5 py-4 text-sm text-boldblue">
                    <input
                      type="text"
                      value={formData.firmAffiliation}
                      onChange={(e) => setFormData({ ...formData, firmAffiliation: e.target.value })}
                      onFocus={() => setShowFirmDropdown(true)}
                      onBlur={() => setTimeout(() => setShowFirmDropdown(false), 200)}
                      className="outline-none placeholder:font-semibold w-[80%]"
                      placeholder="Select firm name"
                    />
                    <IoIosSearch />
                  </div>

                  {showFirmDropdown && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-boldblue rounded-lg shadow-lg max-h-48 overflow-y-scroll dropdown-scrollbar"
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {firmOptions
                        .filter(firm =>
                          formData.firmAffiliation
                            ? firm.toLowerCase().includes(formData.firmAffiliation.toLowerCase())
                            : true
                        )
                        .map((firm, idx) => (
                          <div
                            key={`firm-option-${idx}`}
                            className="px-4 py-2 hover:bg-deepskyblue hover:text-white cursor-pointer text-sm"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setFormData({
                                ...formData,
                                firmAffiliation: firm
                              });
                              setShowFirmDropdown(false);
                            }}
                          >
                            {firm}
                          </div>
                        ))
                      }
                    </div>
                  )}
                </div>
              )}
            </div>





            {/* Previously held clearances */}
            <div className="relative w-full max-w-75 mb-7.5">
              <div className="flex justify-between border border-boldblue rounded-lg w-full px-5 py-4 text-sm text-boldblue">
                <input
                  type="text"
                  value={formData.clearance || ""}
                  onChange={(e) => setFormData({ ...formData, clearance: e.target.value })}
                  onFocus={() => setShowClearancesDropdown(true)}
                  onBlur={() => setTimeout(() => setShowClearancesDropdown(false), 200)}
                  className="outline-none placeholder:font-semibold w-[80%]"
                  placeholder="Previously held clearances"
                />
                <IoIosSearch />
              </div>

              {showClearancesDropdown && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-boldblue rounded-lg shadow-lg max-h-48 overflow-y-scroll dropdown-scrollbar"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {clearanceLevels
                    .filter(clearance =>
                      formData.clearance
                        ? clearance.toLowerCase().includes(formData.clearance.toLowerCase())
                        : true
                    )
                    .map((clearance, idx) => (
                      <div
                        key={`clearance-option-${idx}`}
                        className="px-4 py-2 hover:bg-deepskyblue hover:text-white cursor-pointer text-sm"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setFormData({
                            ...formData,
                            clearance: clearance
                          });
                          setShowClearancesDropdown(false);
                        }}
                      >
                        {clearance}
                      </div>
                    ))
                  }
                </div>
              )}
            </div>

            {/* Location */}
            <div className="mb-7.5">
              <div className="flex gap-7.5 mb-2.5">
                <select
                  value={formData.location.country}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, country: e.target.value, state: "" }
                  })}
                  className="outline-none appearance-none border border-boldblue text-boldblue rounded-lg px-5 py-4 text-sm cursor-pointer"
                >
                  <option className="cursor-pointer" value="">Select Country</option>
                  <option className="cursor-pointer" value="USA">USA</option>
                  <option className="cursor-pointer" value="UK">UK</option>
                  <option className="cursor-pointer" value="Canada">Canada</option>
                  <option className="cursor-pointer" value="Australia">Australia</option>
                </select>

                {formData.location.country && (
                  <div className="relative w-full max-w-75">
                    <div className="flex justify-between border border-boldblue rounded-lg w-full px-5 py-4 text-sm text-boldblue">
                      <input
                        type="text"
                        value={formData.location.state}
                        onChange={(e) => setFormData({
                          ...formData,
                          location: { ...formData.location, state: e.target.value }
                        })}
                        onFocus={() => setShowStatesDropdown(true)}
                        onBlur={() => setTimeout(() => setShowStatesDropdown(false), 200)}
                        className="outline-none placeholder:font-semibold w-[80%]"
                        placeholder={`Search ${formData.location.country} states`}
                      />
                      <IoIosSearch />
                    </div>

                    {/* State dropdown */}
                    {showStatesDropdown && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-boldblue rounded-lg shadow-lg max-h-48 overflow-y-scroll dropdown-scrollbar"
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {statesByCountry[formData.location.country as keyof typeof statesByCountry]
                          .filter(state =>
                            formData.location.state
                              ? state.toLowerCase().includes(formData.location.state.toLowerCase())
                              : true
                          )
                          .map((state, idx) => (
                            <div
                              key={`state-option-${idx}`}
                              className="px-4 py-2 hover:bg-deepskyblue hover:text-white cursor-pointer text-sm"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setFormData({
                                  ...formData,
                                  location: { ...formData.location, state: state }
                                });
                                setShowStatesDropdown(false);
                              }}
                            >
                              {state}
                            </div>
                          ))
                        }
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="my-7.5 pt-7.5  border-t border-t-deepskyblue">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative w-full max-w-75">
                  <div className="flex justify-between border border-boldblue rounded-lg w-full px-5 py-4 text-sm text-boldblue">
                    <input
                      type="text"
                      value={certificationInput}
                      onFocus={() => {
                        setShowCertificationsDropdown(true);
                        setFilteredCertifications(certificatesAndEducationList);
                      }}
                      onBlur={() => setTimeout(() => setShowCertificationsDropdown(false), 200)}
                      onChange={(e) => setCertificationInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (certificationInput) addTagWrapper('certifications', certificationInput);
                        }
                      }}
                      className="outline-none placeholder:font-semibold w-[80%]"
                      placeholder="Certifications"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (certificationInput) addTagWrapper('certifications', certificationInput);
                      }}
                      className="focus:outline-none"
                    >
                      <IoIosSearch />
                    </button>
                  </div>

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
                            addTagWrapper('certifications', cert);
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
                      onClick={() => removeTagWrapper('certifications', index)}
                      className="font-semibold text-sm ml-1 focus:outline-none cursor-pointer transition transform active:scale-95  hover:text-red-500"
                    >
                      <IoCloseOutline size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

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
                      setFilteredSkills(ProfessionalFieldsAndAreasOfExpertise152);
                    }}
                    onBlur={() => setTimeout(() => setShowSkillsDropdown(false), 200)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (skillInput) addTagWrapper('skills', skillInput);
                      }
                    }}
                    className="outline-none placeholder:font-semibold w-[80%]"
                    placeholder="Skills"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (skillInput) addTagWrapper('skills', skillInput);
                    }}
                    className="focus:outline-none"
                  >
                    <IoIosSearch />
                  </button>
                </div>

                {showSkillsDropdown && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-boldblue rounded-lg shadow-lg max-h-48 overflow-y-scroll dropdown-scrollbar"
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {filteredSkills.map((skill, idx) => (
                      <div
                        key={`skill-option-${idx}`}
                        className="px-4 py-2 hover:bg-deepskyblue hover:text-white cursor-pointer text-sm"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          addTagWrapper('skills', skill);
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
                    onClick={() => removeTagWrapper('skills', index)}
                    className="font-semibold text-sm ml-1 focus:outline-none hover:text-red-500 transition transform active:scale-95 cursor-pointer"
                  >
                    <IoCloseOutline size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative w-full max-w-75">
                <div className="flex justify-between border border-boldblue rounded-lg w-full px-5 py-4 text-sm text-boldblue">
                  <input
                    type="text"
                    value={expertiseInput}
                    onChange={(e) => setExpertiseInput(e.target.value)}
                    onFocus={() => {
                      setShowExpertiseDropdown(true)
                      setFilteredExpertise(ProfessionalFieldsAndAreasOfExpertise152);
                    }}
                    onBlur={() => setTimeout(() => setShowExpertiseDropdown(false), 200)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (expertiseInput) addTagWrapper('expertise', expertiseInput);
                      }
                    }}
                    className="outline-none placeholder:font-semibold w-[80%]"
                    placeholder="Expertise"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (expertiseInput) addTagWrapper('expertise', expertiseInput);
                    }}
                    className="focus:outline-none"
                  >
                    <IoIosSearch />
                  </button>
                </div>

                {showExpertiseDropdown && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-boldblue rounded-lg shadow-lg max-h-48 overflow-y-scroll dropdown-scrollbar"
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {filteredExpertise.map((exp, idx) => (
                      <div
                        key={`expertise-option-${idx}`}
                        className="px-4 py-2 hover:bg-deepskyblue hover:text-white cursor-pointer text-sm"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          addTagWrapper('expertise', exp);
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
                    onClick={() => removeTagWrapper('expertise', index)}
                    className="font-semibold text-sm ml-1 focus:outline-none cursor-pointer transition transform active:scale-95 hover:text-red-500"
                  >
                    <IoCloseOutline size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Work History */}
          <div className="mb-7.5">
            <h3 className="mb-7.5 font-semibold text-black flex items-center gap-1">
              <span>Work History</span>
              <span className="text-crimson font-bold h-fit pt-1">*</span>
            </h3>

            {formData.workHistory.map((work, index) => (
              <div key={work.id} className="mb-10">
                <div className="flex justify-between mb-5">
                  <h4 className="font-semibold">Work Experience {index + 1}</h4>
                  {formData.workHistory.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeWorkHistoryWrapper(work.id)}
                      className="text-red-500 transition transform active:scale-95 hover:opacity-70 cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  value={work.title}
                  onChange={(e) => updateWorkHistoryWrapper(work.id, 'title', e.target.value)}
                  className="placeholder:font-semibold mb-7.5 block text-sm text-boldblue border border-boldblue rounded-lg w-full max-w-157.5 px-5 py-4 focus:outline focus:outline-boldblue"
                  placeholder="Title"
                />

                <div className="flex items-start gap-7.5 mb-7.5">
                  <div className="relative w-full max-w-[242px]">
                    <div className="relative flex justify-between border border-boldblue rounded-lg w-full px-5 py-4 text-sm text-boldblue">
                      <input
                        type="text"
                        value={work.department}
                        onChange={(e) => updateWorkHistoryWrapper(work.id, 'department', e.target.value)}
                        onFocus={() => setShowDepartmentDropdown(true)}
                        onBlur={() => setTimeout(() => setShowDepartmentDropdown(false), 200)}
                        className="outline-none placeholder:font-semibold w-[80%]"
                        placeholder="Department/Agency"
                        // required
                      />
                      <IoIosSearch />
                      {/* <span className="text-crimson font-bold absolute -right-4">*</span> */}
                    </div>

                    {showDepartmentDropdown && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-boldblue rounded-lg shadow-lg max-h-48 overflow-y-scroll dropdown-scrollbar"
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {GovernmentDepartmentsAndAgenciesByCountry
                          .filter(dept =>
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
                                updateWorkHistoryWrapper(work.id, 'department', dept);
                                setShowDepartmentDropdown(false);
                              }}
                            >
                              {dept}
                            </div>
                          ))
                        }
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center gap-1">
                        <input
                          type="radio"
                          id={`state-${work.id}`}
                          name={`departmentType-${work.id}`}
                          checked={work.departmentType === "state"}
                          onChange={() => updateWorkHistoryWrapper(work.id, 'departmentType', "state")}
                          className="form-radio h-4 w-4 text-boldblue transition duration-150 ease-in-out"
                          // required
                        />
                        <label htmlFor={`state-${work.id}`}>State</label>
                      </div>

                      <div className="flex items-center gap-1">
                        <input
                          type="radio"
                          id={`federal-${work.id}`}
                          name={`departmentType-${work.id}`}
                          checked={work.departmentType === "federal"}
                          onChange={() => updateWorkHistoryWrapper(work.id, 'departmentType', "federal")}
                          className="form-radio h-4 w-4 text-boldblue transition duration-150 ease-in-out"
                          // required/
                        />
                        <label htmlFor={`federal-${work.id}`}>Federal</label>
                      </div>
                    </div>
                    {/* <span className="text-crimson font-bold">*</span> */}
                  </div>

                  <div className="relative w-full max-w-[242px]">
                    <div className="flex justify-between border border-boldblue rounded-lg w-full px-5 py-4 text-sm text-boldblue">
                      <input
                        type="text"
                        value={work.experienceLevel}
                        onChange={(e) => updateWorkHistoryWrapper(work.id, 'experienceLevel', e.target.value)}
                        onFocus={() => setShowExperienceDropdown(true)}
                        onBlur={() => setTimeout(() => setShowExperienceDropdown(false), 200)}
                        className="outline-none placeholder:font-semibold w-[80%]"
                        placeholder="Level of Experience"
                      />
                      <IoIosSearch />
                    </div>

                    {showExperienceDropdown && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-boldblue rounded-lg shadow-lg max-h-48 overflow-y-scroll dropdown-scrollbar"
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {["Entry level (0-2 years)", "Intermediate/Mid-Level (2-5 years)", "Senior Level (5+ Years)"]
                          .filter(level =>
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
                                updateWorkHistoryWrapper(work.id, 'experienceLevel', level);
                                setShowExperienceDropdown(false);
                              }}
                            >
                              {level}
                            </div>
                          ))
                        }
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-7.5">
                  <input
                    type="text"
                    value={work.location}
                    onChange={(e) => updateWorkHistoryWrapper(work.id, 'location', e.target.value)}
                    className="placeholder:font-semibold block text-sm text-boldblue border border-boldblue rounded-lg w-full max-w-75 px-5 py-4 focus:outline focus:outline-boldblue"
                    placeholder="Location"
                  />
                </div>

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
                      // required
                    />
                    {/* <span className="text-crimson font-bold absolute top-4 -right-4">*</span> */}
                  </div>
                </div>
              </div>
            ))}

            <div>
              <button
                type="button"
                onClick={addWorkHistoryWrapper}
                className="text-sm px-4 py-[11px] bg-boldblue rounded-lg text-white font-semibold transition transform active:scale-95 hover:opacity-70 cursor-pointer"
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
                  onChange={(e) => updateDegreeWrapper(degree.id, 'degree', e.target.value)}
                  className="placeholder:font-semibold text-sm text-boldblue border border-boldblue rounded-lg w-full max-w-75 px-5 py-4 focus:outline focus:outline-boldblue"
                  placeholder="Degree"
                  required
                />
                <input
                  type="text"
                  value={degree.institution}
                  onChange={(e) => updateDegreeWrapper(degree.id, 'institution', e.target.value)}
                  className="placeholder:font-semibold text-sm text-boldblue border border-boldblue rounded-lg w-full max-w-75 px-5 py-4 focus:outline focus:outline-boldblue"
                  placeholder="Institution"
                />
                <input
                  type="text"
                  value={degree.yearCompleted}
                  onChange={(e) => handleDegreeYearInput(e, degree.id)}
                  className="placeholder:font-semibold text-sm text-boldblue border border-boldblue rounded-lg w-full max-w-75 px-5 py-4 focus:outline focus:outline-boldblue"
                  placeholder="Year Completed"
                  maxLength={4}
                  required
                />
                <input
                  type="text"
                  value={degree.gpa || ""}
                  onChange={(e) => updateDegreeWrapper(degree.id, 'gpa', e.target.value)}
                  className="placeholder:font-semibold text-sm text-boldblue border border-boldblue rounded-lg w-full max-w-75 px-5 py-4 focus:outline focus:outline-boldblue"
                  placeholder="GPA (Optional)"
                  maxLength={4}
                />
                {formData.degrees.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDegreeWrapper(degree.id)}
                    className="text-red-500 px-2 transition transform active:scale-95 hover:opacity-70 cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addDegreeWrapper}
              className="text-sm px-4 py-[11px] bg-boldblue rounded-lg text-white font-semibold transition transform active:scale-95 hover:opacity-70 cursor-pointer"
            >
              Add More
            </button>
          </div>

          <section className="flex items-center justify-center gap-2.5 py-7.5 px-6 fixed bottom-0 left-0 bg-skyblue w-full border-t border-t-boldblue">
            <button
              type="button"
              onClick={() => router.push('/')}
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