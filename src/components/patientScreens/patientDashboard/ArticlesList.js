import {StyleSheet, FlatList, Pressable, ActivityIndicator} from 'react-native';
import View from '../../wrapperComponent/ViewWrapper.js';
import Text from '../../wrapperComponent/TextWrapper.js';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getAllArticles, isArticle} from '../../../redux/HomeSlice';
import Modal from 'react-native-modal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../../utils/Responsive.js';
import Colors from '../../../customs/Colors.js';
import ScreenLoading from '../../ScreenLoading.js';

const ArticlesList = ({handleShadowVisible}) => {
  const dispatch = useDispatch();
  const [articlesData, setArticlesData] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isRefreshing, setRefreshing] = useState(false);

  const {isArticleDataLoading, articleData, darkMode} = useSelector(
    state => state.home,
  );

  console.log('articleData ===>>>>>>', articleData);

  useEffect(() => {
    (async () => {
      if (Object.keys(articleData).length == 0) {
        await dispatch(getAllArticles());
      }
    })();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(getAllArticles());
    setRefreshing(false);
  };

  const renderItem = ({item}) => {
    return (
      <Pressable
        onPress={() => {
          setModalVisible(true);
        }}>
        <View
          isCard={true}
          style={{
            margin: 10,
            padding: 10,
            borderRadius: 8,
            shadowColor: darkMode ? 'white' : 'gray',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.87,
            shadowRadius: 4,
            elevation: 3,
            backgroundColor: '#fff',
          }}>
          <View isCard={true} style={styles.titleCont}>
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

  const handleOnScroll = event => {
    const yOffset = event.nativeEvent.contentOffset.y;
    if (yOffset > 0) {
      handleShadowVisible(true);
    } else {
      handleShadowVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      {isArticleDataLoading ? <ScreenLoading /> : null}
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
            {articleData?.title}
          </Text>

          <Text>{articleData?.body}</Text>
          <View style={styles.closeBtn}>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text style={{fontWeight: '600'}}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {/* <View
        style={{
          height: 40,
          backgroundColor: 'white',
          width: '100%',
          marginBottom: 20,
          shadowColor: isShadowVisible ? '#000' : '#fff',
          shadowOffset: isShadowVisible
            ? {
                width: 0,
                height: 5,
              }
            : {
                width: 2,
                height: 2,
              },
          shadowOpacity: isShadowVisible ? 0.3 : 0,
          shadowRadius: isShadowVisible ? 3 : 0,
          elevation: isShadowVisible ? 2 : 0,
        }}></View> */}
      <FlatList
        key={new Date()}
        data={articleData}
        renderItem={renderItem}
        keyExtractor={() => Math.random() * 73}
        showsVerticalScrollIndicator={false}
        onScroll={handleOnScroll}
        scrollEventThrottle={16}
        onRefresh={onRefresh}
        refreshing={isRefreshing}
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
  shadowView: {
    width: '100%',
    height: 40,
    marginBottom: 20,
    borderWidth: 1,
  },
  headerWithShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2, // For Android
  },
});
