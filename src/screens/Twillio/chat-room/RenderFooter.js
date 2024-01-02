import React, {memo} from 'react';
import styles from './RenderChatMessageStyle';

import {
  Pressable,
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import VideoPlayer from '../../../components/VideoPlayer';
import {openFile} from '../../../utils/utils';
let docImage =
  'https://png.pngtree.com/png-clipart/20220612/original/pngtree-pdf-file-icon-png-png-image_7965915.png';

const RenderFooter = ({medias = [], selectedMedia, navigation}) => {
  return (
    <>
      {medias.length ? (
        <ScrollView horizontal style={styles.scrollviewFooter}>
          {medias.map((item, index) => {
            let type = item?.mime;
            let mediaType = type && type.split('/')[0];
            if (type === 'application') {
              mediaType = 'document';
            }

            return (
              <View key={index} style={styles.footerView}>
                <Pressable
                  onPress={() => {
                    let data = [...medias];
                    data.splice(index, 1);
                    selectedMedia(data);
                  }}
                  style={styles.footerPressable}>
                  <MaterialIcons
                    name="close"
                    size={16}
                    color={'black'}
                    style={styles.closeIcon}
                  />
                </Pressable>

                {mediaType === 'video' ? (
                  <>
                    <VideoPlayer
                      navigation={navigation}
                      video={item.path}
                      style={styles.footerVideo}
                      showPreview={true}
                    />
                  </>
                ) : mediaType === 'image' ? (
                  <TouchableOpacity
                    onPress={() => {
                      openFile(item.path);
                    }}>
                    <Image
                      source={{uri: item?.path}}
                      style={styles.footerImage}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.footerFilePress}
                    onPress={() => {
                      openFile(item.path);
                    }}>
                    <Image
                      source={{uri: docImage}}
                      style={styles.footerFileImage}
                    />
                    <Text style={styles.footerFileText} numberOfLines={2}>
                      {item?.filename}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </ScrollView>
      ) : null}
    </>
  );
};

export default memo(RenderFooter);
