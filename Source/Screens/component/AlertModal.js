import {View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator} from 'react-native';
import React from 'react';
import {color} from '../../utils/color';
import {useTranslation} from 'react-i18next';


export default function AlertModal({
  isVisible = false,
  isSuccessAlert = false,
  alertTitle = '',
  alertMsg = '',
  yesButton,
  yesButtonText = '',
  noButtonText = '',
  noButton,
  loading=false,
}) {
  const {t} = useTranslation();

  return (
    <Modal 
        transparent 
        visible={isVisible}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text
            style={{
              color: color.white,
              marginTop: 25,
              marginBottom: 10,
              fontSize: 16,
              fontWeight: '600',
            }}
            numberOfLines={1}>
            {alertTitle}
          </Text>
          <Text
            style={{
              color: color.white,
              fontSize: 14,
              textAlign: 'center',
              marginHorizontal: 30,
            }}>
            {alertMsg}
          </Text>

          {
            isSuccessAlert ?
            <View
            style={{
              width: '100%',
              borderTopWidth: 1,
              borderColor: color.white_50,
              marginTop: 30,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableOpacity
            onPress={()=>yesButton()}
              style={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 10,
              }}>
              <Text style={{color: '#fff', fontSize: 16}}>{yesButtonText}</Text>
            </TouchableOpacity>
          </View>
          : 
          <View
            style={{
              width: '100%',
              borderTopWidth: 1,
              borderColor: color.white_50,
              marginTop: 30,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableOpacity
               onPress={()=>yesButton()}
              style={{
                width: '50%',
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: '#fff',
                borderRightWidth: 1,
                paddingVertical: 10,
              }}>
                {
                  loading ? <ActivityIndicator color={color.white} /> :
                  <Text style={{color: '#fff', fontSize: 16}}>{yesButtonText}</Text>
                }
            </TouchableOpacity>
            <TouchableOpacity
               onPress={()=>noButton()}
              style={{
                width: '50%',
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 10,
              }}>
              <Text style={{color: '#fff', fontSize: 16}}>{noButtonText}</Text>
            </TouchableOpacity>
          </View>
          }
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalView: {
    position: 'absolute',
    width: '85%',
    backgroundColor: '#10281C',
    borderRadius: 20,
    borderWidth: 1,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredView: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    flex: 1,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
