import axios from 'axios';
import { toast } from 'react-toastify';
import { saveProfile } from "@/api/profile-api";


export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// to handle auto-resize of textarea
export const handleTextAreaInput = (textareaRef) => {
  if (textareaRef?.current) {
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }
}

export const handleInputChange = (e, setFormData) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }))
}

export const handleProfileImageChange = async (e, setFormData) => {
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

export const addTag = (type, value, formData, setFormData, setInput) => {
  if (!value.trim()) return;
  
  // Check if the tag already exists - if it does, remove it instead of adding
  if (formData[type].includes(value.trim())) {
    // Find index of the item
    const index = formData[type].indexOf(value.trim());
    // Remove the item
    removeTag(type, index, setFormData);
    return;
  }
  
  // Otherwise add as before
  setFormData(prev => ({
    ...prev,
    [type]: [...prev[type], value.trim()]
  }));
  
  // Clear the input but DO NOT close the dropdown
  if (setInput) {
    setInput("");
  }
};

export const removeTag = (type, index, setFormData) => {
  setFormData(prev => ({
    ...prev,
    [type]: prev[type].filter((_, i) => i !== index)
  }));
};

export const addWorkHistory = (setFormData) => {
  const newWorkHistory = {
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

export const updateWorkHistory = (id, field, value, setFormData) => {
  setFormData(prev => ({
    ...prev,
    workHistory: prev.workHistory.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    )
  }));
};

// Remove work history entry
export const removeWorkHistory = (id, formData, setFormData) => {
  if (formData.workHistory.length <= 1) return; // Keep at least one entry
  
  setFormData(prev => ({
    ...prev,
    workHistory: prev.workHistory.filter(item => item.id !== id)
  }));
};

// Add degree entry
export const addDegree = (setFormData) => {
  const newDegree = {
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


export const updateDegree = (id, field, value, setFormData) => {
  setFormData(prev => ({
    ...prev,
    degrees: prev.degrees.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    )
  }));
};

export const removeDegree = (id, formData, setFormData) => {
  if (formData.degrees.length <= 1) return; // Keep at least one entry
  
  setFormData(prev => ({
    ...prev,
    degrees: prev.degrees.filter(item => item.id !== id)
  }));
};

export const submitProfileData = async (formData, userId, isProfileExists, setIsLoading, setIsProfileExists, toast, router, fetchUserProfile) => {
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
      formData.profileImageUrl = formData.profileImage;
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
    if (error.response) {
      const statusCode = error.response.status;
      const errorMessage = error.response.data?.message || "An error occurred while saving";
      
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