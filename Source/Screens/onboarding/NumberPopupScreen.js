import React, {useState} from 'react';
import {Text, TouchableOpacity, View, Linking} from 'react-native';
import Modal from 'react-native-modal';

function NumberPopupScreen({number}) {
  const [isModalVisible, setModalVisible] = useState(true);
  return (
    <Modal isVisible={isModalVisible}>
      <View
        style={{
          flex: 0.25,
          backgroundColor: '#6b0195',
          borderRadius: 5,
          padding: 20,
        }}>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(false);
          }}>

          </TouchableOpacity>
      </View>
    </Modal>
  );
}
export default NumberPopupScreen;
