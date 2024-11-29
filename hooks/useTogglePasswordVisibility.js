import { useState } from 'react';

const useTogglePasswordVisibility = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handlePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible); 
  };

  const rightIcon = passwordVisible ? 'eye' : 'eye-off'; 

  return {
    passwordVisible,
    rightIcon,
    handlePasswordVisibility,
  };
};

export default useTogglePasswordVisibility;