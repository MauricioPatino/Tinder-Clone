import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import buttonStyles from '../styles/components/buttonStyles';
import useCheckAuth from '../hooks/useCheckAuth'; 

const MatchesScreen = ({ navigation }) => {
  const { currentUser, loading: authLoading } = useCheckAuth(navigation); 
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchMatches();
    }
  }, [currentUser]);

  const fetchMatches = async () => {
    try {
      const matchesSnapshot = await firestore()
        .collection('matches')
        .where('usersMatched', 'array-contains', currentUser.uid)
        .get();

      const matchesList = await Promise.all(
        matchesSnapshot.docs.map(async (doc) => {
          const matchData = doc.data();
          const matchedUserId = matchData.usersMatched.find((uid) => uid !== currentUser.uid);

          const userDoc = await firestore().collection('users').doc(matchedUserId).get();

          if (!matchedUserId || !userDoc.exists) {
            return null;
          }

          const matchedUser = userDoc.data();
          return {
            id: doc.id,
            matchedUser,
          };
        })
      );
      setMatches(matchesList.filter((match) => match !== null));
    } catch (error) {
      console.error('Error fetching matches:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const startChat = (matchId) => {
    navigation.navigate('Chat', { matchId });
  };

  const confirmDeletion = (matchId) => {
    Alert.alert(
      'Remove Match',
      'Are you sure you want to remove this match?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', onPress: () => deleteMatch(matchId) },
      ],
      { cancelable: true }
    );
  };

  const deleteMatch = async (matchId) => {
    try {
      await firestore().collection('matches').doc(matchId).delete();
      setMatches((prevMatches) => prevMatches.filter((match) => match.id !== matchId));
      console.log('Match removed successfully.');
    } catch (error) {
      console.error('Error deleting match:', error);
    }
  };

  const renderMatchItem = ({ item }) => {
    if (!item.matchedUser) {
      return (
        <View style={styles.errorContainer}>
          <Text>Unable to load user information.</Text>
        </View>
      );
    }

    return (
      <View style={styles.matchContainer}>
        <TouchableOpacity
          style={styles.chatContainer}
          onPress={() => startChat(item.id)}
        >
          <Image
            source={{ uri: item.matchedUser.profileImageUrl || '/assets/defaultImageError.png ' }}
            style={styles.profileImage}
          />
          <View style={styles.textContainer}>
            <Text style={styles.name}>{item.matchedUser.name}</Text>
            <Text style={styles.chatPrompt}>Tap to start chatting</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => confirmDeletion(item.id)}>
          <Text style={buttonStyles.deleteButton}>X</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (authLoading || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6F61" />
        <Text>Loading Matches...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={matches}
      keyExtractor={(item) => item.id}
      renderItem={renderMatchItem}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  listContainer: {
    padding: 16,
  },
  matchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
    marginVertical: 8,
    borderRadius: 8,
  },
  chatContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatPrompt: {
    fontSize: 14,
    color: '#666',
  },
});

export default MatchesScreen;
