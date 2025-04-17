import { useEffect, useState } from 'react';
import { LoginFormData, FormErrors } from '@/types/auth';
import { validateEmail } from '@/utils/validation';

export const useLoginFormValidation = (formData: LoginFormData, formErrors: FormErrors): boolean => {
  const [isValid, setIsValid] = useState<boolean>(false);
  
  useEffect(() => {
    const { email, password } = formData;
    const allFieldsFilled = 
      email.trim() !== '' &&
      password.trim() !== '';
      
    const noErrors = 
      validateEmail(email) &&
      formErrors.email === '' &&
      formErrors.password === '';
    
    setIsValid(allFieldsFilled && noErrors);
  }, [formData, formErrors]);
  
  return isValid;
};