import {
    View,
    Text,
    Linking,
    StyleSheet,
    Modal,
    Dimensions,
    TouchableOpacity,
  } from 'react-native';
  import React from 'react';
  import {useTranslation} from 'react-i18next';

  const screenWidth = Math.round(Dimensions.get('window').width);
  
  const LocationPermissionModal = ({isOpenLocationModal,onpressOpenSetting}) => {
    const {t} = useTranslation();

    

    const OpenSettings = async () => {
      Linking.openSettings();
      onpressOpenSetting()
    };
    
    return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isOpenLocationModal}
          onRequestClose={() => {
            null;
          }}>
          <View
            style={{flex: 1, backgroundColor: '#001A0F', alignItems: 'center'}}>
            <View style={{position: 'absolute', bottom: 15, width: screenWidth,width:'95%'}}>
              <Text
                style={{
                  marginTop: 5,
                  color: '#6C2BC2',
                  textAlign:'center'
                }}>
                {t('Location_Permission_Alert')}
              </Text>
              <Text style={{marginTop: 15,marginBottom:20,color:'#fff',textAlign:'center',fontSize:16}}>
                {t('Location_Functionality')}
              </Text>
  
              <TouchableOpacity
                onPress={() => {
                  OpenSettings()
                }}
                style={{
                  alignSelf: 'center',
                  width: '94%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: screenWidth*0.025,
                  backgroundColor:'#6F74F9',
                  borderRadius:4
                }}>
                <Text
                  style={{
                    fontWeight: '700',
                    fontSize: (screenWidth * 4) / 100,
                    color: '#ffffff',
                  }}>
                  {t('Location_Open_Settings')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
    );
  };
  
  export default LocationPermissionModal;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fafafa',
    },
  });
  