import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MatchesScreen from '../screens/MatchesScreen';


const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Matches') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline'; 
          } 

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007BFF', 
        tabBarInactiveTintColor: 'gray',  
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
      <Tab.Screen name="Matches" component={MatchesScreen} options={{headerShown: false}}/>
      <Tab.Screen name="Profile" component={ProfileScreen} options={{headerShown: false}}/>
    </Tab.Navigator>
  );
};

export default TabNavigator;