import {StyleSheet, FlatList, Pressable, ActivityIndicator} from 'react-native';
import View from '../../components/wrapperComponent/ViewWrapper.js';
import Text from '../../components/wrapperComponent/TextWrapper.js';
import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  getAllArticles,
  getArticlesSlice,
  isArticle,
  saveArticleSlice,
} from '../../redux/HomeSlice';
import Modal from 'react-native-modal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../customs/Colors.js';
import {useTranslation} from 'react-i18next';
import {ArticleContentLoader} from '../../components/SkeletonContentLoading';
import {darkModeColor} from '../../utils/utils.js';

const SaveArticles = ({handleShadowVisible}) => {
  const {t} = useTranslation();

  const dispatch = useDispatch();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isRefreshing, setRefreshing] = useState(false);
  const [isArticleDataLoading, setArticleLoading] = useState(false);
  const [selectedArtileIndex, selectedArtile] = useState('');
  const [articleData, setArticles] = useState([]);

  const {darkMode} = useSelector(state => state.home);

  const getAllArticlesUpdatedData = useCallback(async () => {
    if (articleData && articleData.length === 0) {
      try {
        setArticleLoading(true);
        const {payload} = await dispatch(getArticlesSlice());
        setArticles(payload);
        setArticleLoading(false);
      } catch (err) {
        setArticleLoading(false);
      }
    }
  }, [dispatch]);

  useEffect(() => {
    getAllArticlesUpdatedData();
  }, [getAllArticlesUpdatedData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(getAllArticles());
    setRefreshing(false);
  };

  const renderItem = ({item, index}) => {
    const shadowColor = darkModeColor(darkMode);
    return (
      <Pressable
        key={index}
        onPress={() => {
          setModalVisible(true);
          selectedArtile(index);
        }}>
        <View isCard={true} style={[styles.saveContainer, {shadowColor}]}>
          {/* <View isCard={true} style={styles.titleCont}>
            <Text style={styles.title}>{t(item?.title)}</Text>
          </View> */}
          <Text>
            {item.length > 250 ? item.substring(0, 180 - 3) + '...' : item}
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
      {isArticleDataLoading ? <ArticleContentLoader /> : null}
      <Modal
        hasBackdrop={true}
        isVisible={isModalVisible}
        // onBackdropPress={() => {
        //   setModalVisible(false);
        // }}
        style={styles.titleView}>
        <View style={styles.modalArticleView}>
          {/* <Text style={styles.articleTitle}>
            {articleData.length && articleData[selectedArtileIndex]?.title}
          </Text> */}
          <Text style={{lineHeight: 21}}>
            {articleData &&
              articleData.length &&
              articleData[selectedArtileIndex]}
          </Text>
          <View style={styles.closeBtn}>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>Close</Text>
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
        data={articleData}
        renderItem={renderItem}
        style={{flex: 1}}
        contentContainerStyle={{flexGrow: 1}}
        keyExtractor={(item, index) => index}
        showsVerticalScrollIndicator={false}
        onScroll={handleOnScroll}
        scrollEventThrottle={16}
        onRefresh={onRefresh}
        refreshing={isRefreshing}
        ListEmptyComponent={() => {
          return (
            <View style={styles.notDataFoundContainer}>
              <Text style={styles.notDataFound}>{'No Data Found'}</Text>
            </View>
          );
        }}
      />
    </View>
  );
};

export default SaveArticles;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeText: {fontWeight: '600', color: Colors.dune},
  saveContainer: {
    margin: 10,
    padding: 10,
    borderRadius: 8,

    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.87,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: '#fff',
  },
  articleTitle: {
    marginBottom: 10,
    fontWeight: '600',
    fontSize: 18,
  },
  titleView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 10,
    marginVertical: 50,
    paddingHorizontal: 20,
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
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 3,
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
    backgroundColor: 'white',
  },
  notDataFound: {
    textAlign: 'center',
    color: Colors.dune,
  },
  notDataFoundContainer: {flex: 1, justifyContent: 'center'},
  homeContentLoading: {flexDirection: 'row', marginVertical: 10},
});
