import React from 'react';
import {useTranslation} from 'react-i18next';
import {View, Text} from 'react-native';

const Messages = () => {
  const {t} = useTranslation();
  return (
    <View>
      <Text>{t('Messages')}</Text>
    </View>
  );
};

export default Messages;
