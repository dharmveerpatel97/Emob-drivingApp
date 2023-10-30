import {Dimensions, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../customComp/Header';
import {color} from '../../utils/color';
import ImageZoom from 'react-native-image-pan-zoom';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import { mobW } from '../../utils/commonFunction';

const ImageView = ({navigation, route}) => {
  const Img = route.params.path;
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: color.black_BG}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: mobW * 0.034,
          paddingVertical: 5,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{alignItems: 'center'}}>
          <Icon name="arrowleft" color={color.white} size={24} />
        </TouchableOpacity>
      </View>
      <View style={{paddingHorizontal: 20,marginBottom:30}}>
        <Image
          style={{width: '100%', height: '100%'}}
          resizeMode={'contain'}
          source={{uri: Img}}
        />
      </View>
    </SafeAreaView>
  );
};

export default ImageView;

const styles = StyleSheet.create({});
