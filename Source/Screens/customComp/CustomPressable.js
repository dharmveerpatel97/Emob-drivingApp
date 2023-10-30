import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {BOLD} from '../../utils/fonts';
import {color} from '../../utils/color';

export default function CustomPressable({
  navigation,
  text,
  btnWidth,
  route,
  ErrorMessage,
  position,
  bottom,
  props,
  onPress,
  isLoading = false,
  isGradient = true,
  marginTop = 30,
  backgroundColor = '#69A0F3',
  textColor="#FFFFFF",
}) {
  const [Message, SetMessage] = useState('');
  const width = btnWidth;

  if (isGradient) {
    return (
      <TouchableOpacity
        style={[
          styles.btn,
          {position: position, bottom: bottom, marginTop: marginTop},
        ]}
        disabled={isLoading}
        onPress={() => {
          onPress();
        }}>
        {ErrorMessage && (
          <Text style={{color: 'red', fontSize: 16}}>{ErrorMessage}</Text>
        )}
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          colors={['#00AF66', '#00AF66']}
          width={width}
          style={[styles.linearGradient]}>
          {isLoading ? (
            <ActivityIndicator color={color.white} />
          ) : (
            <Text
              style={{
                fontSize: 18,
                textAlign: 'center',
                // margin: 18,
                color: textColor,

                fontFamily: BOLD,
              }}>
              {text}
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity
        disabled={isLoading}
        style={[
          styles.btn,
          {
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            height: 50,
            borderRadius: 10,
            alignSelf: 'center',
            width: width,
            backgroundColor: backgroundColor,
            marginTop: marginTop,
            position: position,
            bottom: bottom,
          },
        ]}
        onPress={() => {
          onPress();
        }}>
        <>
          {isLoading ? (
            <ActivityIndicator color={color.white} />
          ) : (
            <Text
              style={{
                fontSize: 18,
                textAlign: 'center',
                // margin: 18,
                color: textColor,
                fontFamily: BOLD,
                fontWeight:'600'
              }}>
              {text}
            </Text>
          )}
        </>
      </TouchableOpacity>
    );
  }
}

export function BorderPressable({
  borderColor = '#00AF66',
  btnWidth,
  text,
  position,
  bottom,
  onPress,
  isLoading = false,
  marginTop = 30,
}) {
  return(
    <TouchableOpacity
    style={{
      width: btnWidth,
      borderColor: borderColor,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      height: 50,
      borderRadius: 10,
      alignSelf: 'center',
      marginTop: marginTop,
      position: position,
      bottom: bottom,
    }}
    onPress={() => {
      onPress();
    }}>
    <>
      {isLoading ? (
        <ActivityIndicator color={color.white} />
      ) : (
        <Text
          style={{
            fontSize: 18,
            textAlign: 'center',
            // margin: 18,
            color: '#ffffff',
            fontFamily: BOLD,
          }}>
          {text}
        </Text>
      )}
    </>
  </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
  btn: {
    alignSelf: 'center',
  },
  linearGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: 50,
    borderRadius: 10,
  },
});
