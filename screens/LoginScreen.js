import React, { useState } from 'react';
import {View, Text, ImageBackground, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Pressable} from 'react-native';
import {handleSignIn} from '../functions/SignIn';
import useTogglePasswordVisibility from '../hooks/useTogglePasswordVisibility';
import {MaterialCommunityIcons} from '@expo/vector-icons'; 
import textInputStyles from '../styles/components/textInputStyles';
import buttonStyles from '../styles/components/buttonStyles';


const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const {passwordVisible, rightIcon, handlePasswordVisibility} = useTogglePasswordVisibility();


  return (
    <ImageBackground source={require('../assets/couple_1.jpeg')} style={styles.background}>
    <View style={styles.container}>
      <Text style={styles.title}>Date Ready</Text>
      
      <TextInput
        style={textInputStyles.emailInput}
        placeholder="enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <View style={textInputStyles.passwordContainer}>
        <TextInput
        style={textInputStyles.passwordInput}
        placeholder="enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!passwordVisible}
        autoCapitalize="none"
        autoCorrect={false}
        />
        <Pressable onPress={handlePasswordVisibility}> 
          <MaterialCommunityIcons name={rightIcon} size={22} color="#CC0000" /> 
        </Pressable>
      </View>             

      {errorMessage && <Text style={{ color: 'red' }}>{errorMessage}</Text>}

      <TouchableOpacity
        style={[buttonStyles.button, { backgroundColor: loading ? 'gray' : '#007BFF' }]}
        onPress={() => handleSignIn(email, password, setErrorMessage, setLoading, navigation)} 
        disabled={loading}
      >
      {loading ? (<ActivityIndicator color="#FFF" />) : (<Text style={buttonStyles.buttonText}>Login</Text>)}
      
      </TouchableOpacity> 

      <TouchableOpacity
        style={[buttonStyles.signupButton]}  
        onPress={() => navigation.navigate('SignUp')}
        disabled={loading}
      >
        <Text style={buttonStyles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
    
    </ImageBackground>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
    paddingTop: 350,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  background: {
    flex: 1, 
    opacity: 0.75,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginBottom: 20,
    color: '#ffffff',
  },
  signupText: {
    color: '#007BFF',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default LoginScreen;
