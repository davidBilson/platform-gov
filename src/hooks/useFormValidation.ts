// src/hooks/useFormValidation.ts
import { useEffect, useState } from 'react';
import { FormData } from '@/types/auth';
import { validateEmail, validatePhone, validatePassword } from '@/utils/validation';

export const useFormValidation = (formData: FormData): boolean => {
  const [isValid, setIsValid] = useState<boolean>(false);
  
  useEffect(() => {
    const { first_name, last_name, email, phone_number, password } = formData;
    const allFieldsFilled = 
      first_name.trim() !== '' &&
      last_name.trim() !== '' &&
      email.trim() !== '' &&
      phone_number.trim() !== '' &&
      password.trim() !== '';
      
    const noErrors = 
      validateEmail(email) &&
      validatePhone(phone_number) &&
      validatePassword(password);
    
    setIsValid(allFieldsFilled && noErrors);
  }, [formData]);
  
  return isValid;
};