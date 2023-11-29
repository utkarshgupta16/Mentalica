import {StyleSheet, FlatList, Pressable, Image} from 'react-native';
import View from '../../wrapperComponent/ViewWrapper.js';
import Text from '../../wrapperComponent/TextWrapper.js';
import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {getAllArticles, isArticle} from '../../../redux/HomeSlice';
import Modal from 'react-native-modal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../../utils/Responsive.js';
import Colors from '../../../customs/Colors.js';

const ArticlesList = () => {
  const dispatch = useDispatch();
  const [articlesData, setArticlesData] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({});

  useEffect(() => {
    (async () => {
      const alrticlesList = await dispatch(getAllArticles());
      setArticlesData(alrticlesList?.payload);
    })();
  }, []);

  console.log('articlesData====>>>>>', articlesData);

  const renderItem = ({item}) => {
    return (
      <Pressable
        onPress={() => {
          setArticlesData(item);
          setModalVisible(true);
        }}>
        <View style={styles.flatlistContainer}>
          <View style={styles.titleCont}>
            <Text style={styles.title}>{item?.title}</Text>
            <Pressable onPress={() => {}}>
              <MaterialIcons
                name="save"
                size={20}
                color={Colors.grayishBlue}
                style={styles.icon}
              />
            </Pressable>
          </View>
          <Text>
            {(item?.body).length > 250
              ? (item?.body).substring(0, 180 - 3) + '...'
              : item?.body}
          </Text>
        </View>
      </Pressable>
    );
  };

  console.log();

  return (
    <View style={styles.container}>
      <Modal
        hasBackdrop={true}
        isVisible={isModalVisible}
        // onBackdropPress={() => {
        //   setModalVisible(false);
        // }}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          height: 10,
          marginVertical: 50,
          paddingHorizontal: 20,
        }}>
        <View style={styles.modalArticleView}>
          <Text
            style={{
              marginBottom: 10,
              fontWeight: '600',
              fontSize: 18,
            }}>
            {articlesData?.title}ss
          </Text>

          <Text>{articlesData?.body}</Text>
          <View style={styles.closeBtn}>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text style={{fontWeight: '600'}}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <FlatList
        key={new Date()}
        data={articlesData}
        renderItem={renderItem}
        keyExtractor={() => Math.random() * 73}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ArticlesList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatlistContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#D8D9DA',
    borderRadius: 8,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 3,
    backgroundColor: '#fff',
    marginBottom: 10,
    marginHorizontal: 10,
  },
  title: {
    fontWeight: '600',
    marginBottom: 8,
    fontSize: 15,
    fontFamily: 'Fuzzy Bubbles',
  },
  modalArticleView: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D8D9DA',
    borderRadius: 8,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 3,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    borderWidth: 1,
    borderColor: 'white',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 50,
    marginTop: 30,
  },
  icon: {
    padding: 5,
  },
  titleCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
});
