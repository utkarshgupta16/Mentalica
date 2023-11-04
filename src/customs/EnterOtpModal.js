import React, {useEffect, useRef, useState} from 'react';
import {
  Platform,
  View,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
} from 'react-native';
import Modal from 'react-native-modal';
import Colors from './Colors';
import Button from '../components/Button';

const EnterOtpModal = ({
  state,
  submitCodeHandler,
  resendCode,
  showEnterCodeModal,
  setShowEnterCodeModal,
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const inputRefs = useRef([]);
  const handleOtpChange = (text, index) => {
    if (text.length === 1 && index < 5) {
      inputRefs.current[index + 1].focus();
    }
    if (text.length === 0 && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
  };

  useEffect(() => {
    let secondsInterval;

    if (showEnterCodeModal) {
      secondsInterval = setInterval(() => {
        if (secondsLeft > 0) {
          setSecondsLeft(prevSecLeft => prevSecLeft - 1);
        }
      }, 1000);
    }

    if (!showEnterCodeModal) {
      setSecondsLeft(30);
      clearInterval(secondsInterval);
    }
    return () => {
      clearInterval(secondsInterval);
    };
  }, [showEnterCodeModal, secondsLeft]);

  return (
    <Modal
      avoidKeyboard={false}
      onRequestClose={() => {
        setShowEnterCodeModal(false);
      }}
      keyboardAvoidingBehavior={
        Platform.OS === 'android' ? 'height' : 'padding'
      }
      animationType="slide"
      transparent={true}
      closeOnClick={true}
      // isVisible={true}
      isVisible={showEnterCodeModal}
      onBackdropPress={() => {
        setShowEnterCodeModal(false);
      }}
      onBackButtonPress={() => {
        setShowEnterCodeModal(false);
      }}>
      <View style={styles.modalContainer}>
        <Text style={styles.enterOTPText}>
          Enter the 6-digit OTP sent to {state.username}
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.otpInput}
              onChangeText={text => handleOtpChange(text, index)}
              value={digit}
              keyboardType="numeric"
              maxLength={1}
              ref={ref => (inputRefs.current[index] = ref)}
            />
          ))}
        </View>
        <Button title="Submit" onPress={submitCodeHandler} />
        <View style={styles.resendCodeContainer}>
          <Text style={styles.resendCodeAgainText}>Didn't get a code? </Text>
          <View style={styles.resendMainContainer}>
            <Pressable style={styles.resendButton} onPress={resendCode}>
              <Text style={styles.resend}>Resend</Text>
            </Pressable>
            <Text style={styles.resendTimerText}>
              In 00:{secondsLeft > 9 ? secondsLeft : '0' + secondsLeft}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EnterOtpModal;

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    paddingVertical: 32,
    borderRadius: 10,
  },
  enterOTPText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.primaryDarkBlue,
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  otpInput: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    textAlign: 'center',
    marginRight: 10,
    borderRadius: 8,
  },
  resendCodeContainer: {
    marginTop: 24,
    flexDirection: 'row',
  },
  resendCodeAgainText: {
    fontSize: 15,
  },
  resendMainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendButton: {
    marginRight: 8,
  },
  resend: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryBlue,
  },
  resendTimerText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.primaryDarkBlue,
  },
});
