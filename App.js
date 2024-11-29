import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import TabNavigator from './navigation/TabNavigator';
import SignUpScreen from './screens/SignUpScreen';
import MatchesScreen from './screens/MatchesScreen';
import ChatScreen from './screens/ChatScreen';
import { StatusBar, StyleSheet, View } from 'react-native';

const Stack = createStackNavigator();

const App = () => {
  return ( 
    <View style={styles.container}>
    <StatusBar hidden={true} /> 
    <NavigationContainer>
      
      <Stack.Navigator initialRouteName='Login'>
        
        <Stack.Screen
          name="Login"
          component={LoginScreen} options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainTabs"
          component={TabNavigator} options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen} options={{ headerShown: false }}
        />
        <Stack.Screen name="Matches" 
        component={MatchesScreen} options={{headerShown: false}} />
        
        <Stack.Screen name="Chat" 
        component={ChatScreen} options={{headerShown: false}}/>

      </Stack.Navigator>

    </NavigationContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
