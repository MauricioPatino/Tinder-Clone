import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { TouchableOpacity } from 'react-native-gesture-handler';
import buttonStyles from '../styles/components/buttonStyles';
import textInputStyles from '../styles/components/textInputStyles';

const ChatScreen = ({ route, navigation }) => {
  const { matchId } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const currentUser = auth().currentUser;

  useEffect(() => {
    const unsubscribe = firestore()
      .collection(`matches/${matchId}/messages`)
      .orderBy('timestamp', 'asc')
      .onSnapshot((snapshot) => {
        const messagesList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messagesList);
      });
      
    return unsubscribe;
  }, [matchId]);

  const sendMessage = async () => {
    if (newMessage.trim()) {
      await firestore().collection(`matches/${matchId}/messages`).add({
        senderId: currentUser.uid,
        text: newMessage,
        timestamp: firestore.FieldValue.serverTimestamp(),
      });
      setNewMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={item.senderId === currentUser.uid ? styles.sentMessage : styles.receivedMessage}>
            {item.text}
          </Text>
        )}
      />
      <TextInput
        style={textInputStyles.textInput}
        value={newMessage}
        onChangeText={setNewMessage}
        placeholder="Start chatting..."
      />
      <TouchableOpacity style={buttonStyles.button} onPress={sendMessage}>
        <Text>Send</Text>
      </TouchableOpacity>

      <TouchableOpacity style={buttonStyles.backButton} onPress={() => navigation.goBack()}>
        <Text>Go back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    padding: 10,
    marginVertical: 4,
    borderRadius: 10,
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
    padding: 10,
    marginVertical: 4,
    borderRadius: 10,
  },
});

export default ChatScreen;
