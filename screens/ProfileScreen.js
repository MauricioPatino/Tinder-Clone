import React, { useState, useEffect } from 'react';
import { View, TextInput, Image, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { checkAuth } from '../functions/SignIn';
import profileImageStyles from '../styles/components/profileImageStyles';
import buttonStyles from '../styles/components/buttonStyles';
import textInput from '../styles/components/textInputStyles';
import { selectImage, updateProfileImage } from '../functions/imageSelection';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null); 
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [uploading, setUploading] = useState(false); 

  useEffect(() => {
    const unsubscribe = checkAuth(navigation, setLoading, setUser);
    return () => unsubscribe(); 
  }, [navigation]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const userProfile = await firestore().collection('users').doc(user.uid).get();
        if (userProfile.exists) {
          const data = userProfile.data();
          setName(data.name);
          setBio(data.bio);
          setProfileImage(data.profileImageUrl || null); 
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  const confirmLogout = () => {
    Alert.alert(
      'Log Out', 
      'Are you sure you want to log out?', 
      [
        { text: 'Cancel', style: 'cancel' }, 
        { text: 'Log Out', onPress: logout }, 
      ],
      { cancelable: true }
    );
  };

  const logout = async () => {
    try {
      await auth().signOut(); 
      Alert.alert('Success', 'You have been logged out.');
      navigation.replace('Login');  
    } catch (error) {
      console.error('Logout Error:', error.message);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  if (loading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => selectImage(setProfileImage)} style={profileImageStyles.cardContainer}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={profileImageStyles.cardImage} resizeMode="cover" />
        ) : (
          <View style={profileImageStyles.placeholderContainer}>
            <Text style={profileImageStyles.placeholderText}>Upload Image</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={textInput.textInput}
      />
      <TextInput
        placeholder="Bio"
        value={bio}
        onChangeText={setBio}
        style={textInput.textInput}
      />

      <TouchableOpacity
        style={buttonStyles.button}
        onPress={() => updateProfileImage(user, profileImage, name, bio, setLoading)}
        disabled={loading || uploading}
      >
        {loading || uploading ? <ActivityIndicator color="#fff" /> : <Text style={buttonStyles.buttonText}>Update Profile</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={buttonStyles.button} onPress={confirmLogout}>
        <Text style={buttonStyles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;
