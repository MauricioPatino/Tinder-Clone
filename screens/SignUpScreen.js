import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import buttonStyles from '../styles/components/buttonStyles';
import profileImageStyles from '../styles/components/profileImageStyles';
import textInput from '../styles/components/textInputStyles';
import { selectImage } from '../functions/imageSelection'; 
import { handleSignUp } from '../functions/SignUp';
import Animated, { LightSpeedInRight, LightSpeedOutLeft, RollInLeft } from 'react-native-reanimated';

const SignUpScreen = ({ navigation }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isExiting, setIsExiting] = useState(false);


  const nextStep = () => {
    setIsExiting(false);
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setIsExiting(true);
    setStep((prev) => (prev > 0 ? prev - 1 : prev));
    setIsExiting(false);
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <Animated.View
          key="step0"
          entering={LightSpeedInRight}
          exiting={isExiting ? LightSpeedOutLeft : undefined} 
          style={styles.stepContainer}>
            <TextInput
              style={textInput.textInput}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={textInput.textInput}
              placeholder="Age"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
            <TextInput
              style={textInput.textInput}
              placeholder="Bio"
              value={bio}
              onChangeText={setBio}
              multiline
            />
            <TouchableOpacity style={buttonStyles.nextButton} onPress={nextStep}>
              <Text style={buttonStyles.buttonText}>Next</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      case 1:
        return (
          <Animated.View
          key="step1"
          entering={LightSpeedInRight}
          exiting={isExiting ? LightSpeedOutLeft : undefined}
          style={styles.stepContainer}>
            {photo && <Image source={{ uri: photo }} style={profileImageStyles.cardContainer} />}
            <TouchableOpacity style={buttonStyles.photoButton} onPress={() => selectImage(setPhoto)}>
              <Text style={buttonStyles.photoButtonText}>Select Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={buttonStyles.nextButton} onPress={nextStep}>
              <Text style={buttonStyles.buttonText}>Next</Text>
            </TouchableOpacity>
            <TouchableOpacity style={buttonStyles.backButton} onPress={prevStep}>
              <Text style={buttonStyles.buttonText}>Back</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      case 2:
        return (
          <Animated.View             
          key="step2"
          entering={LightSpeedInRight}
          exiting={isExiting ? LightSpeedOutLeft : undefined} 
          style={styles.stepContainer}>
            <TextInput
              style={textInput.textInput}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <TextInput
              style={textInput.textInput}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            {loading ? (
              <ActivityIndicator size="large" color="#FF6F61" />
            ) : (
              <TouchableOpacity style={buttonStyles.nextButton} onPress={() => handleSignUp(name, age, bio, email, password, photo, setLoading, navigation)} disabled={loading}>
                <Text style={buttonStyles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={buttonStyles.backButton} onPress={prevStep}>
              <Text style={buttonStyles.buttonText}>Back</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Sign Up</Text>
        {renderStepContent()}
      </ScrollView>
      <TouchableOpacity style={buttonStyles.backButton} onPress={() => navigation.pop()}>
        <Text style={buttonStyles.buttonText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 8,
  },
    stepContainer: {
    width: '100%',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'white',
  },
});

export default SignUpScreen;
