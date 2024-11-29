import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export const handleSignUp = async (name, age, bio, email, password, photo, setLoading, navigation) => {
  if (!name || !age || !bio || !email || !password || !photo) {
    Alert.alert('Error', 'Please fill in all fields and select a photo.');
    return;
  }

  setLoading(true);

  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    const fileName = `${user.uid}/profile.jpg`;
    const reference = storage().ref(fileName);

    await reference.putFile(photo);
    const profileImageUrl = await reference.getDownloadURL();

    await firestore().collection('users').doc(user.uid).set({
      name,
      age: parseInt(age, 10),
      bio,
      email,
      profileImageUrl,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    Alert.alert('Success', 'Your account has been created!');
    navigation.replace('MainTabs');
  } catch (error) {
    console.error('SignUp Error:', error.message);
    Alert.alert('Error', error.message);
  } finally {
    setLoading(false);
  }
};
