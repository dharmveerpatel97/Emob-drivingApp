import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { BOLD } from '../../utils/fonts';

export default function CustomBtn({
  navigation,
  text,
  btnWidth,
  route,
  Allow,
  ErrorMessage,
  position,
  bottom,
  props,
}) {
  const [Message, SetMessage] = useState('');
  const width = btnWidth;
  return (
    <TouchableOpacity
      style={[styles.btn, {position: position, bottom: bottom}]}
      onPress={() => {
        if (Allow == true) {
          navigation.navigate(route, {value: props});
        } else SetMessage(ErrorMessage);
      }}>
      <Text style={{color: 'red', fontSize: 16, marginVertical: 10}}>
        {Message}
      </Text>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 3}}
        colors={['#00AF66', '#00AF66']}
        width={width}
        style={[styles.linearGradient]}>
        <Text
          style={{
            fontSize: 20,
            textAlign: 'center',
            // margin: 18,
            color: '#ffffff',
            fontFamily:BOLD
          }}>
          {text}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    marginHorizontal: 14,
  },
  linearGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: 50,
    // flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
  },
});
