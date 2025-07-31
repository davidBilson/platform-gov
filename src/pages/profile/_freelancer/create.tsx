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

import { ProfessionalFieldsAndAreasOfExpertise152 } from "@/utils/feedFilter/152ProfessionalFieldsAndAreasOfExpertise";
import { certificatesAndEducationList } from "@/utils/feedFilter/CertificatesAndEducationList";
// UI Components
import Legalagreement from "@/components/ui/legal-agreement";
import { toast } from "react-toastify";

import {
  ProfileImageUpload,
  BioSection,
  RateSection,
  FirmAffiliationSection,
  ClearanceSection,
  LocationSection,
  TagsSection,
  WorkHistorySection,
  DegreeSection,
  ActionButtons
} from '@/components/profile/editProfile/contractor';

const CreateFreelancerProfile = () => {

  const router = useRouter();
  const { userId, name, email } = useAuthStore();

  const [formData, setFormData] = useState<ProfileFormData>({
    bio: "",
    ratePerHour: "",
    secondRate: "",
    profession: "",
    primaryPosition: "",
    skills: [],
    certifications: [],
    // expertise: [],
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
  const textareaRef = useRef<HTMLTextAreaElement>(null!);
  const fileInputRef = useRef<HTMLInputElement>(null!);

  const validateForm = () => {
    const errors: string[] = [];
    // Check work history requirements
    formData.workHistory.forEach((work, index) => {
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

  // useEffect(() => {
  //   if (showExpertiseDropdown) {
  //     const availableExpertise = ProfessionalFieldsAndAreasOfExpertise152.filter(exp => !formData.expertise.includes(exp));

  //     if (expertiseInput.trim()) {
  //       const filtered = availableExpertise.filter(exp => exp.toLowerCase().includes(expertiseInput.toLowerCase()));
  //       setFilteredExpertise(filtered);
  //     } else {
  //       setFilteredExpertise(availableExpertise);
  //     }
  //   } else {
  //     setFilteredExpertise(ProfessionalFieldsAndAreasOfExpertise152.filter(exp => !formData.expertise.includes(exp)));
  //   }
  // }, [expertiseInput, formData.expertise, showExpertiseDropdown]);

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

      if (response?.success && response?.data) {
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
          // expertise: profileData.expertise || [],
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

    if (formData.bio !== "" && formData.profileImageUrl !== "") {
      router.push('/profile');
    } else {
      toast.error("Please complete, and save your profile");
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      handleTextAreaInput(textareaRef);
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
          <div className="mb-7.5 pb-7.5 border-b border-b-deepskyblue flex flex-col sm:flex-row sm:items-start  gap-5">
            <ProfileImageUpload
              profileImageUrl={formData.profileImageUrl ?? ''}
              handleProfileImageClick={handleProfileImageClick}
              handleProfileImageChange={handleProfileImageChangeWrapper}
              fileInputRef={fileInputRef}
            />
            <div>

              <p className="text-black font-semibold text-base md:text-xl text-center md:text-left">{name}</p>
              <p className="text-gray-500 text-xs text-center md:text-left pt-2">{email ?? ''}</p>
            </div>
          </div>

          <BioSection
            bio={formData.bio}
            handleInputChange={handleInputChangeWrapper}
            textareaRef={textareaRef}
            handleTextAreaInput={handleTextAreaInputWrapper}
          />

          <RateSection
            ratePerHour={formData.ratePerHour}
            secondRate={formData.secondRate ?? ''}
            handleInputChange={handleInputChangeWrapper}
          />

          <input
            type="text"
            name="primaryPosition"
            value={formData.primaryPosition}
            onChange={handleInputChangeWrapper}
            className="block mb-7.5 placeholder:font-semibold text-sm text-boldblue border border-boldblue rounded-lg w-full md:max-w-75 px-5 py-4 focus:outline focus:outline-boldblue"
            placeholder="Consultant Focus Area"
          />

          <FirmAffiliationSection
            firmAffiliation={formData.firmAffiliation}
            setFormData={setFormData}
            showFirmDropdown={showFirmDropdown}
            setShowFirmDropdown={setShowFirmDropdown}
          />

          <ClearanceSection
            clearance={formData.clearance ?? ''}
            setFormData={setFormData}
            showClearancesDropdown={showClearancesDropdown}
            setShowClearancesDropdown={setShowClearancesDropdown}
          />

          <LocationSection
            location={formData.location}
            setFormData={setFormData}
            showStatesDropdown={showStatesDropdown}
            setShowStatesDropdown={setShowStatesDropdown}
          />

          <div className="my-7.5 pt-7.5 border-t border-t-deepskyblue">
            <TagsSection
              type="certifications"
              inputValue={certificationInput}
              setInputValue={setCertificationInput}
              tags={formData.certifications}
              addTag={addTagWrapper}
              removeTag={removeTagWrapper}
              showDropdown={showCertificationsDropdown}
              setShowDropdown={setShowCertificationsDropdown}
              filteredOptions={filteredCertifications}
              placeholder="Certifications"
              bgColor="bg-aquagreen"
            />
          </div>

          <div className="flex flex-wrap items-center mb-7.5 gap-2.5">
            <TagsSection
              type="skills"
              inputValue={skillInput}
              setInputValue={setSkillInput}
              tags={formData.skills}
              addTag={addTagWrapper}
              removeTag={removeTagWrapper}
              showDropdown={showSkillsDropdown}
              setShowDropdown={setShowSkillsDropdown}
              filteredOptions={filteredSkills}
              placeholder="Skills & Expertise"
              bgColor="bg-deepskyblue"
            />
          </div>

          {/* <div className="flex flex-wrap items-center gap-2.5">
            <TagsSection
              type="expertise"
              inputValue={expertiseInput}
              setInputValue={setExpertiseInput}
              tags={formData.expertise}
              addTag={addTagWrapper}
              removeTag={removeTagWrapper}
              showDropdown={showExpertiseDropdown}
              setShowDropdown={setShowExpertiseDropdown}
              filteredOptions={filteredExpertise}
              placeholder="Expertise"
              bgColor="bg-deepskyblue"
            />
          </div> */}

          <WorkHistorySection
            workHistory={formData.workHistory}
            addWorkHistory={addWorkHistoryWrapper}
            updateWorkHistory={updateWorkHistoryWrapper}
            removeWorkHistory={removeWorkHistoryWrapper}
            handleYearInput={handleYearInput}
            handleCurrentRoleChange={handleCurrentRoleChange}
            showDepartmentDropdown={showDepartmentDropdown}
            setShowDepartmentDropdown={setShowDepartmentDropdown}
            showExperienceDropdown={showExperienceDropdown}
            setShowExperienceDropdown={setShowExperienceDropdown}
          />

          <DegreeSection
            degrees={formData.degrees}
            addDegree={addDegreeWrapper}
            updateDegree={updateDegreeWrapper}
            removeDegree={removeDegreeWrapper}
            handleDegreeYearInput={handleDegreeYearInput}
          />
        </form>

        <ActionButtons
          isLoading={isLoading}
          handleSubmit={handleSubmit}
          handlePreview={handlePreview}
        />
      </main>
    </>
  );
};

export default CreateFreelancerProfile;