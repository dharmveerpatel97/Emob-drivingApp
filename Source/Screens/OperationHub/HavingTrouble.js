import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  Component,
} from 'react';
import {
  View,
  Header,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Modal,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Pressable,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import {BOLD, REGULAR, ITALIC} from '../../utils/fonts';
import ImagePicker, { openCamera } from 'react-native-image-crop-picker';
import {color} from '../../utils/color';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import {mobW, mobH} from '../../utils/config';
import {t} from 'i18next';
import CustomPressable from '../customComp/CustomPressable';
import {useTranslation} from 'react-i18next';

export default function HavingTrouble({navigation}) {
  const {t} = useTranslation();
  const [text, settext] = useState('');
  const [isvisible, setisvisible] = useState(false);
  const [imageuploadflag, setimageuploadflag] = useState(false);
  const [imgarray, setimgarray] = useState([]);
  const onback = () => {
    setisvisible(false);
    navigation.goBack();
  };
  const removeimage = item => {
    console.log(item);
    var array = imgarray;
    var index = array.indexOf(item);

    if (index !== -1) {
      array.splice(index, 1);
      const arr2 = array;
      setimgarray(arr2);
    }
  };
  const PickImageFromGallery = () => {
    try {
      ImagePicker.openPicker({
        cropping: true,
      }).then(image => {
        console.log(image, 'image');
        setDocImageUrl(image);
      });
    } catch (error) {
      console.log(error);
    }
  };
  const setDocImageUrl = imageUrl => {
    setimageuploadflag(false);
    const arr2 = [...imgarray, imageUrl];
    console.log(arr2);
    setimgarray(arr2);
  };
  const OpenCamera = () => {
    ImagePicker.openCamera({
      cropping: true,
    }).then(image => {
      setDocImageUrl(image.path);
    });
  };

  const renderItem = ({item}) => {
    return (
      <View style={{borderWidth: 1}}>
        <View
          style={{
            margin: 10,
            borderColor: color.white,
            borderWidth: 1,
            borderRadius: 10,
            width: 80,
            height: 80,
          }}>
          <Image
            resizeMode="cover"
            style={{flex: 1, borderRadius: 5}}
            source={{uri: item}}
          />
          <TouchableOpacity
            onPress={() => removeimage(item)}
            style={{
              margin: 5,
              position: 'absolute',
              top: -12,
              right: -12,
              width: 26,
              borderRadius: 13,
              justifyContent: 'center',
              alignItems: 'center',
              height: 26,
              backgroundColor: color.Border_color,
              color: 'tomato',
            }}>
            <Image
              source={require('../../Assests/image/cross.png')}
              style={{height: 10, width: 10}}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <Modal transparent visible={isvisible}>
        <View style={modalStyles.container1}>
          <View style={modalStyles.headerSubBox}>
            <TouchableOpacity></TouchableOpacity>
            <TouchableOpacity>
              <Text style={modalStyles.headerTitle}>
                {t('Submitted Response')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onback()}
              style={{
                flexDirection: 'row',
                marginRight: 15,
                alignItems: 'center',
              }}>
              <Icon name="close" color={color.white} size={24} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 60,
            }}>
            <Image
              style={{width: 280, height: 250, resizeMode: 'contain'}}
              source={require('../../Assests/image/having_trouble.png')}
            />
          </View>
          <Text style={modalStyles.listTitle}>
            {' '}
            {t('Thanks for informing us')} {'\n'}
            {t('about your issue.')}
          </Text>
          <Text style={modalStyles.listTitle1}>
            {' '}
            {t(
              ' We have successfully received your issue and will get back to you as soon as possible.',
            )}
          </Text>
          <Text style={modalStyles.listTitle1}>
            {' '}
            {t('Kindly bear with us. ')}
          </Text>
        </View>
      </Modal>

      <StatusBar translucent barStyle="light-content" />
      <Modal
        animationType="slide"
        transparent={true}
        visible={imageuploadflag}
        onRequestClose={() => {
          imageuploadflag(!imageuploadflag);
        }}>
        <TouchableOpacity
          onPress={() => imageuploadflag(!imageuploadflag)}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.8)',
          }}>
          <View style={{position: 'absolute', bottom: 20}}>
            <Pressable
              onPress={() => OpenCamera()}
              style={{
                opacity: 1,
                backgroundColor: color.Blue_light,
                marginHorizontal: 20,
                borderRadius: 14,
                width: Dimensions.get('screen').width / 1.1,
                // margin: 20,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  padding: 14,
                  fontSize: 20,
                  color: color.white,
                }}>
                {t(' Camera')}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => PickImageFromGallery()}
              style={{
                opacity: 1,
                backgroundColor: color.Blue_light,
                marginHorizontal: 20,
                borderRadius: 14,
                width: Dimensions.get('screen').width / 1.1,
                margin: 20,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  padding: 14,
                  color: color.white,
                  fontSize: 20,
                }}>
                {t('Gallery')}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setimageuploadflag(false)}
              style={{
                opacity: 1,
                backgroundColor: color.purpleborder,
                marginHorizontal: 20,
                borderRadius: 14,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: color.white,
                  padding: 14,
                  fontSize: 20,
                }}>
                {t('Cancel')}
              </Text>
            </Pressable>
          </View>
        </TouchableOpacity>
      </Modal>
      <View style={styles.headerSubBox}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name="arrowleft" color={color.white} size={24} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.headerTitle}>{'Having Trouble'}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: mobH * 0.08}}
        scrollEnabled={true}>
        <Text style={styles.listTitle}>
          {t(
            'Mention your issues here, if needed take picture and attach here for better understanding. \n  Thankyou.',
          )}
        </Text>
        <Text style={styles.listTitle1}>{t('Mention Issues here')}</Text>
        <TextInput
          style={styles.input}
          value={text}
          placeholder={t("Type here ...")}
          placeholderTextColor={color.white}
          returnKeyType="next"
          onChangeText={text => settext(text)}
          multiline={true}
        />
        <Text style={styles.listTitle1}>{t('Upload attachment')}</Text>
        <View
          style={{
            margin: 16,
            height: 100,
            borderColor: color.Border_color,
            borderWidth: 1.5,
            borderRadius: 10,
            borderStyle: 'dashed',
          }}>
          <View style={{flexDirection: 'row', marginVertical: 25}}>
            <Image
              style={{
                width: 50,
                height: 50,
                marginLeft: 30,
                resizeMode: 'contain',
              }}
              source={require('../../Assests/image/Otp/uploadIcon.png')}
            />

            <View style={{flexDirection: 'column'}}>
              <View style={{flexDirection: 'row', marginBottom: 5}}>
                <Text style={styles.listTitleupload}>
                  {t('Choose file to')}{' '}
                </Text>
                <TouchableOpacity onPress={() => setimageuploadflag(true)}>
                  <Text
                    style={{
                      color: '#00AF66',
                      fontSize: 16,
                      textDecorationLine: 'underline',
                    }}>
                    {t('Upload')}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.listTitleSupp}>
                {t('Support : JPG, JPEG (max. 5.0 MB)')}
              </Text>
            </View>
          </View>
        </View>

        <FlatList
          horizontal={true}
          style={{marginTop: 20}}
          data={imgarray}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </ScrollView>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <CustomPressable
          text={t("SUBMIT")}
          marginTop={0}
          btnWidth={mobW - 60}
          route={''}
          isGradient={true}
          backgroundColor="#10281C"
          onPress={() => setisvisible(true)}
          position={'relative'}
          bottom={0}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.black_BG,
    flex: 1,
    paddingVertical: 20,
  },
  headerBox: {
    paddingTop: mobH * 0.032,
  },
  headerSubBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 0.037 * mobW,
    marginTop: 40,
  },
  headerTitle: {
    color: color.white,
    fontSize: 20,
    justifyContent: 'flex-start',
    fontFamily: 'Roboto-Bold',
    paddingHorizontal: 20,
  },
  listTitle: {
    textAlign: 'center',
    justifyContent: 'center',
    color: color.white,
    marginHorizontal: 40,
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    lineHeight: 25,
    marginTop: 40,
    marginBottom: 30,
    fontWeight: '700',
  },
  listTitle1: {
    color: color.white,
    paddingHorizontal: 30,
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    marginVertical: 10,
  },
  listTitleupload: {
    color: color.white,
    marginLeft: 30,
    fontSize: 16,
    marginBottom: -5,
  },

  listTitleSupp: {
    color: color.white,
    opacity: 0.3,
    marginLeft: 30,
    fontSize: 12,
  },
  input: {
    margin: 16,
    padding: 20,
    color: color.white,
    lineHeight: 20,
    fontSize: 18,
    backgroundColor: '#10281C',
    borderRadius: 10,
    height: 170,
    textAlignVertical: 'top',
  },
});

const modalStyles = StyleSheet.create({
  headerSubBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0.037 * mobW,
    marginTop: 30,
  },

  headerTitle: {
    color: color.white,
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
  },
  container1: {
    backgroundColor: '#001A0F',
    width: '100%',
    height: '100%',
  },
  listTitle: {
    width: '100%',
    textAlign: 'center',
    lineHeight: 30,
    color: color.purpleborder,
    flexWrap: 'wrap',
    marginTop: 30,
    fontSize: 20,
    marginBottom: 50,
    fontFamily: 'Roboto-Medium',
  },
  listTitle1: {
    width: '100%',
    textAlign: 'center',
    lineHeight: 25,
    color: color.white,
    paddingHorizontal: 35,
    fontSize: 14,
    marginBottom: 50,
    fontFamily: 'Roboto-Regular',
  },
});
