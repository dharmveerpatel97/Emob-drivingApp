import {View, TextInput, Text, StyleSheet} from 'react-native';
import {BOLD, ITALIC} from '../../utils/fonts';
import {color, fontstyles} from '../../utils/color';
import React, { useEffect, useRef } from 'react';

const CustomTextInput =  React.forwardRef(({
  Inputheading,
  placeholderTextColor,
  style,
  autoCapitalize,
  keyboardAppearance,
  placeHolder,
  maxLength,
  value,
  onFocus,
  onChangeText,
  isError,
  keyboardType,
  isEditable=true,
  autoFocused=true
}, ref) => { 
  
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputHeading}>{Inputheading} *</Text>
      <View style={styles.Inputbox}>
        <TextInput
          ref={ref}
          placeholderTextColor={placeholderTextColor}
          style={style}
          autoCapitalize={autoCapitalize}
          keyboardAppearance={keyboardAppearance}
          autoFocus={autoFocused}
          keyboardType={keyboardType}
          placeholder={placeHolder}
          editable={isEditable}
          maxLength={maxLength}
          autoFocused
          value={value}
          onFocus={onFocus}
          onChangeText={onChangeText}
        />
       
      </View>
      {isError && (
        <Text style={{color: 'red', fontFamily: 'Roboto-Medium',paddingHorizontal:2}}>{isError}</Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 25,
    width: '100%',
    display: 'flex',
  },

  Inputbox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: color.Black_light,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderColor: color.Border_color,
    borderWidth: 2,
    height:50,
    padding:2,
  },

  inputHeading: {
    color: '#ffff',
    marginBottom: 5,
    fontSize: fontstyles.InputHeadingSize,paddingHorizontal:2,
    fontFamily: BOLD,
  },
});
export default CustomTextInput;
