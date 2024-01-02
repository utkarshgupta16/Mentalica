import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import {Image} from 'react-native';
import Colors from '../customs/Colors';


const SplashScreen = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('MainRoute');
    }, 3000);
  }, []);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.white,
      }}>
      {/* <LottieView
                // onAnimationFinish={onUplooadingDone}
                // height={200}
                // width={200}
                source={LottieUploading}
                autoPlay
                loop
                style={{ alignSelf: 'center', width: wp(50), height: hp(26) }}
            />
            <View
                style={{
                    width: wp(70),
                    height: hp(8),
                    alignSelf: 'center',
                    marginTop: hp(2),
                    bottom: 0,
                    position: 'absolute',
                    marginBottom: hp(8),
                }}
            >
                <DWLogo width={'90%'} height={'90%'} color={"white"} />
            </View> */}
      <Image
        source={require('../icons/logo-no-background.png')}
        style={{width: 300}}
        resizeMode="contain"
      />
    </View>
  );
};

export default SplashScreen;
