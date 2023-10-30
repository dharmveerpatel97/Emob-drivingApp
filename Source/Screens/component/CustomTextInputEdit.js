import {View, TextInput, Text, StyleSheet} from 'react-native';
import {BOLD, ITALIC} from '../../utils/fonts';
import {color, fontstyles} from '../../utils/color';
import React, { useEffect, useRef } from 'react';
import {mobW, mobH} from '../../utils/config';
const CustomTextInputEdit =  React.forwardRef(({
  Inputheading,
  placeholderTextColor,
  style,
  autoCapitalize,
  keyboardAppearance,
  placeHolder,
  maxLength,showborder,
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
      <View style={[styles.Inputbox,{borderColor:showborder ? color.purpleborder : color.black_medum}]}>
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
        <Text style={{color: 'red', fontFamily: 'Roboto-Medium',paddingHorizontal: 5,}}>{isError}</Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 15,
    width: '100%',
    display: 'flex',
  },

  Inputbox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: color.black_medum,
    paddingHorizontal: 10,
    borderRadius: 10,
    height:50,
    padding:2,
    borderWidth:1
  },

  inputHeading: {
    color: color.white,
    marginBottom: 5, paddingHorizontal: 5,
    fontSize: fontstyles.InputHeadingSize,
    fontFamily: BOLD,
  },
});
export default CustomTextInputEdit;
