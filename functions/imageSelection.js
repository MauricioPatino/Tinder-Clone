import { Alert, Platform } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';


export const selectImage = (setProfileImage) => {
  launchImageLibrary({ mediaType: 'photo' }, (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorCode) {
      console.error('Image picker error:', response.errorMessage);
      Alert.alert('Error', 'Error selecting image');
    } else {
      const uri = response.assets[0]?.uri;
      if (uri) setProfileImage(uri);
    }
  });
};


export const updateProfileImage = async (user, profileImage, name, bio, setLoading) => {
  setLoading(true);
  try {
    let profileImageUrl = profileImage;
    if (profileImage && profileImage.startsWith('file://')) {
      const uploadUri = Platform.OS === 'ios' ? profileImage.replace('file://', '') : profileImage;
      const fileName = `${user.uid}/profile.jpg`;
      const reference = storage().ref(fileName);

      await reference.putFile(uploadUri);
      profileImageUrl = await reference.getDownloadURL();
    }

    await firestore().collection('users').doc(user.uid).set(
      {
        name,
        bio,
        profileImageUrl,
      },
      { merge: true }
    );

    Alert.alert('Success', 'Profile updated successfully!');
  } catch (error) {
    console.error('Error updating profile:', error.message);
    Alert.alert('Error', `Failed to update profile: ${error.message}`);
  } finally {
    setLoading(false);
  }
};
