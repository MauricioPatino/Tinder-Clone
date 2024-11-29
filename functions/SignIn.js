import auth from '@react-native-firebase/auth';

export const handleSignIn = async (email, password, setErrorMessage, setLoading, navigation) => {
  if (!email || !password) {
    setErrorMessage('Email and password cannot be empty.');
    return;
  }
  setLoading(true);
  setErrorMessage(null); 
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    console.log('Login successful!', user.email);
    navigation.navigate('MainTabs');
    return user; 
  } catch (error) {
    if (error.code === 'auth/invalid-email') {
      setErrorMessage('That email address is invalid.');
    } else if (error.code === 'auth/user-not-found') {
      setErrorMessage('No user found with that email.');
    } else if (error.code === 'auth/wrong-password') {
      setErrorMessage('Incorrect password.');
    } else {
      setErrorMessage('Login failed. Please try again.');
    }
    console.error(error);
  } finally {
    setLoading(false); 
  }
};

export const checkAuth = (navigation, setLoading, setUser) => {
  setLoading(true); 

  const unsubscribe = auth().onAuthStateChanged((user) => {
    if (user) {
      setUser(user);
    } else {
      navigation.navigate('Login');
    }
    setLoading(false); 
  });

  return unsubscribe;
};