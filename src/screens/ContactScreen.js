import {useState, useEffect} from 'react';
import chats from '../../src/assets/data/chats.json';
import ContactListItem from '../components/ContactListItem';
import {FlatList, Pressable, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {API, graphqlOperation, Auth} from 'aws-amplify';
import {listUsers} from '../graphql/queries';
// import { createChatRoom, createUserChatRoom } from "../graphql/mutations";
// import { getCommonChatRoomWithUser } from "../services/chatRoomService";

const ContactsScreen = () => {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    API.graphql(graphqlOperation(listUsers)).then(result => {
      setUsers(result.data?.listUsers?.items);
    });
  }, []);

  return (
    <FlatList
      data={users}
      renderItem={({item}) => (
        <ContactListItem user={item} navigation={navigation} />
      )}
      style={{backgroundColor: 'white'}}
    />
  );
};

export default ContactsScreen;
