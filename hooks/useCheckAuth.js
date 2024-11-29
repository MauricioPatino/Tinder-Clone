import { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';

const useCheckAuth = (navigation) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        Alert.alert('Not Logged In', 'Please log in to continue.');
        navigation.replace('Login');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [navigation]);

  return { currentUser, loading };
};

export default useCheckAuth;
