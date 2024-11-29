import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet, Dimensions, Alert } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const { width, height } = Dimensions.get('window'); 

const defaultImage = '/assets/defaultImageError.png'; 

const SwipingCardsScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        console.log('User is logged in:', user.uid);
        fetchUsers(); 
      } else {
        Alert.alert('Not Logged In', 'Please log in to continue.');
        navigation.replace('Login');
      }
    });

    return unsubscribe; 
  }, [navigation]);


  const fetchUsers = async () => {
    try {
      const usersSnapshot = await firestore().collection('users').get();
      const usersList = usersSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((user) => user.id !== currentUser?.uid); 
      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6F61" />
        <Text>Loading Users...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Swiper
        cards={users}
        renderCard={(user) => (
          <View style={styles.card}>
            <Image
              source={{ uri: user.profileImageUrl || defaultImage }} 
              style={styles.image}
              onError={() => console.warn('Failed to load image')} 
            />
            <Text style={styles.name}>{user.name}, {user.age}</Text>
            <Text style={styles.bio}>{user.bio}</Text>
          </View>
        )}
        onSwipedLeft={(cardIndex) => console.log('Swiped Left:', users[cardIndex]?.name)}
        onSwipedRight={(cardIndex) => handleSwipeRight(users[cardIndex])}
        cardIndex={0}
        backgroundColor="#f5f5f5"
        stackSize={3}
        infinite={false}
      />
    </View>
  );
};

const handleSwipeRight = async (likedUser) => {
  console.log('Swiped Right:', likedUser.name);
  try {
    await firestore().collection('matches').add({
      usersMatched: [auth().currentUser.uid, likedUser.id],
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
    console.log('Match recorded');
  } catch (error) {
    console.error('Error recording match:', error.message);
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  card: {
    width: width * 0.9,
    height: height * 0.7,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  image: {
    width: '100%',
    height: '75%',
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bio: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SwipingCardsScreen;
