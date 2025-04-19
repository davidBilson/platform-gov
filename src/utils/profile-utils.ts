// Utility functions for profile management

// Generate a unique ID for new entries
export const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };
  
  // Convert File object to base64 string for API submission
  export const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };
  
  // Prepare form data for API submission
  export const prepareDataForSubmission = async (formData: any, userId: string) => {
    const apiFormData = {
      ...formData,
      userId, // Include the userId for the API
    };
    
    // Convert profile image to base64 if there is one
    if (formData.profileImage) {
      const base64Image = await convertFileToBase64(formData.profileImage);
      apiFormData.profileImage = base64Image;
    }
    
    return apiFormData;
  };