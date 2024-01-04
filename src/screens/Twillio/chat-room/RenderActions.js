import React, {memo} from 'react';
import {Actions} from 'react-native-gifted-chat';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const RenderActions = ({actionsProps, selectedMedia}) => {
  return (
    <Actions
      {...actionsProps}
      options={{
        ['Take Photo']: () => {
          ImagePicker.openCamera({
            width: 300,
            height: 400,
            mediaType: 'photo',
            cropping: true,
            compressImageQuality: 0.7,
          })
            .then(image => {
              selectedMedia(prev => [...prev, image]);
            })
            .catch(error => {});
        },
        ['Choose From Library']: () => {
          ImagePicker.openPicker({
            multiple: true,
            mediaType: 'photo',
            compressImageQuality: 0.7,
            showsSelectedCount: true,
            maxFiles: 100,
            cropping: true,
            compressImageMaxWidth: 1024,
            forceJpg: true,
          })
            .then(images => {
              selectedMedia(prev => [...prev, ...images]);
            })
            .catch(error => {});
        },
        // ['Choose Video']: () => {
        //   ImagePicker.openPicker({
        //     mediaType: 'video',
        //   })
        //     .then(video => {
        //       selectedMedia([video]);
        //     })
        //     .catch(error => {});
        // },
        ['Choose Documents']: async () => {
          const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.allFiles],
          });
          let data = res.map(val => {
            return {path: val?.uri, filename: val?.name, mime: val?.type};
          });
          selectedMedia(data);
        },
        Cancel: props => null,
      }}
      icon={() => <MaterialIcons name="attachment" size={25} color={'gray'} />}
    />
  );
};

export default memo(RenderActions);
