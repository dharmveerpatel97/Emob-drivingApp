import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import Icon1 from 'react-native-vector-icons/dist/Feather';
import {color} from '../../utils/color';
import { mobH,mobW } from '../../utils/config';

const Header = ({
  navigation,
  onClick,
  HeaderName,
  rightIcon = false,
  rightClick,
  titlePosition = 'left',
}) => {
  if (titlePosition === 'center') {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: mobW*0.034,
          paddingVertical: 5,
        }}>
        <TouchableOpacity
          onPress={() => {
            onClick ? onClick() : navigation.goBack();
          }}
          style={{alignItems: 'center'}}>
          <Icon name="arrowleft" color={color.white} size={24} />
        </TouchableOpacity>
        <TouchableOpacity style={{}}>
          <Text style={styles.headerTitle}>{HeaderName}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{flexDirection: 'row'}} />
      </View>
    );
  } else {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 15,
        }}>
        <TouchableOpacity
          onPress={() => {
            onClick ? onClick() : navigation.goBack();
          }}
          style={{flexDirection: 'row', alignItems: 'center', margin: 14}}>
          <Icon name="arrowleft" color={color.white} size={24} />
          <Text
            style={{
              color: color.white,
              fontSize: 18,
              marginStart: 10,
              fontWeight: 'bold',
            }}>
            {HeaderName}
          </Text>
        </TouchableOpacity>
        {rightIcon && (
          <TouchableOpacity
            onPress={() => {
              rightClick();
            }}
            style={{flexDirection: 'row', alignItems: 'center',padding: 14}}>
            <Image style={{height:25,width:25, resizeMode: 'contain',}} source={require('../../Assests/image/edit_icon.png')}/>
          </TouchableOpacity>
        )}
      </View>
    );
  }
};

export default Header;
const styles = StyleSheet.create({
  headerTitle: {
    color: color.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
