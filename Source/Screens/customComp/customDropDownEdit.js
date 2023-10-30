import React, { useState } from 'react';
  import { StyleSheet, Text, View } from 'react-native';
  import { Dropdown } from 'react-native-element-dropdown';
  import Icon from 'react-native-vector-icons/dist/Feather';
import { color, fontstyles } from '../../utils/color';
import {BOLD, REGULAR, ITALIC} from '../../utils/fonts';
import {mobW, mobH} from '../../utils/config';


  const DropdownComponentEdit = ({ dropdownList,title,showborder, onChange,onFocus,selectedValue = null,disabale=false}) => {
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    
    const selectItem=(item)=>{
          setValue(item.name)
          onChange(item.name)
          setIsFocus(false);
          
    }
    // const renderLabel = () => {
    //   if (value || isFocus) {
    //     return (
    //       <Text style={[styles.label, isFocus && { color: 'blue' }]}>
    //         {value}
    //       </Text>
    //     );
    //   }
    //   return null;
    // };

    return (
      <View style={styles.container}>
        <Dropdown
          style={[styles.dropdown, {borderColor:showborder  ? color.purpleborder : color.black_medum}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          iconStyle={styles.iconStyle}
          iconColor={color.white}
          data={dropdownList}
          
          containerStyle={{borderRadius:10,padding:10,backgroundColor:color.Black_light}}
          itemContainerStyle={{backgroundColor:color.Black_light}}
          maxHeight={300}
          labelField="name"
          valueField="id"
          activeColor={color.Black_light}
          placeholder={selectedValue === null ?title : selectedValue} 
          onFocus={onFocus}
          onBlur={() => setIsFocus(false)}  
          disable={disabale}
          onChange={(item) => {
            selectItem(item)
          }}
          itemTextStyle={{color:color.white}}
          onChangeText={null}
        />
      </View>
    );
  };

  export default DropdownComponentEdit;

  const styles = StyleSheet.create({
    container: {
     
      // padding: 16,
      // margin: 10
    },
    dropdown: {
      backgroundColor: color.Black_light ,
      padding: 10,height:50,
      borderWidth: 1,
      borderRadius: 10
    },
    icon: {
      marginRight: 5,
    },
    label: {
      position: 'absolute',
      backgroundColor: color.black_BG,
      left: 22,
      top: 8,
      zIndex: 999,
      paddingHorizontal: 8,
      fontSize: 14,
    },
    placeholderStyle: {
      fontSize: 16,
      color: color.white,
      fontFamily:REGULAR
    },
    selectedTextStyle: {
      fontFamily:REGULAR,
      color: color.white,
      paddingLeft:5,
    },
    iconStyle: {
      width: 30,
      height: 30,
    },
   
  });