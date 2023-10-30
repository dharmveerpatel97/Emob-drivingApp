import React from 'react';
import {
    TouchableOpacity,
    Text,
    View,
    Modal,
    Dimensions,
  } from 'react-native';
  import {useTranslation} from 'react-i18next';
import { color } from '../../utils/color';

const screenWidth = Math.round(Dimensions.get('window').width);
export const ImagePickerModal = ({isOpenImagePicker,closePicker,openCamera,openGallary}) => {
  const {t} = useTranslation();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpenImagePicker}
      onRequestClose={() => {
        closePicker()
      }}>
      <View
        style={{flex: 1, backgroundColor: '#001A0F90', alignItems: 'center'}}>
        <View style={{position: 'absolute', bottom: 15, width: screenWidth}}>
          <View
            style={{
              alignSelf: 'center',
              width: '94%',
              backgroundColor: '#10281C',
              alignSelf: 'center',
              borderRadius: 10,
            }}>
            <TouchableOpacity
              style={{
                width: '100%',
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                borderBottomColor: 'gray',
                borderBottomWidth: 0.5,
              }}
              activeOpacity={0.9}
              onPress={() => {
                openCamera()
              }}>
              <View
                style={{
                  borderRadius: 30,
                  paddingVertical: (screenWidth * 3.5) / 100,
                }}>
                <Text
                  style={{
                    fontWeight: '700',
                    textAlign: 'center',
                    fontSize: (screenWidth * 4) / 100,
                    color: '#fff',
                  }}>
                  {t("Image_Camera")}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: '100%',
                alignSelf: 'center',
                marginTop: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                openGallary();
              }}>
              <View
                style={{
                  borderRadius: 30,
                  paddingVertical: (screenWidth * 3.5) / 100,
                }}>
                <Text
                  style={{
                    fontWeight: '700',
                    textAlign: 'center',
                    fontSize: (screenWidth * 4) / 100,
                    color: '#fff',
                  }}>
                  {t('Image_Gallery')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginTop: 15,
              alignSelf: 'center',
              borderRadius: 10,
              width: '94%',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#6F74F9',
            }}>
            <TouchableOpacity
              onPress={() => {
                closePicker()
              }}
              style={{
                alignSelf: 'center',
                width: '94%',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: (screenWidth * 3.5) / 100,
              }}>
              <Text
                style={{
                  fontWeight: '700',
                  fontSize: (screenWidth * 4) / 100,
                  color: '#ffffff',
                }}>
                {t('Image_cancel')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
