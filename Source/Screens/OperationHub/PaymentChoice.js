
import React, { useState} from 'react';
import {color} from '../../utils/color';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import CustomTripButton from '../customComp/CustomTripButton';
import { useTranslation } from 'react-i18next';


export default function PaymentChoice({amount,onclose,onNextscreenmove,btnName}){
  const [ChooseType, setChooseType] = useState([
    {
      id: 2,
      title: 'Pay Online Now',
      selected: true,
    },
    {
      id: 1,
      title: 'Pay Later at Pickup Point',
      selected: false,
    },
  ]);

  const onRadioBtnClick = async item => {
    let updatedState = ChooseType.map(isLikedItem =>
      isLikedItem.id === item.id
        ? {...isLikedItem, selected: true}
        : {...isLikedItem, selected: false},
    );
    setChooseType(updatedState);
    setselectedID(item.id);
  };

  const [selectedID, setselectedID] = useState(2);
  const {t} = useTranslation();

return (
    <View style={modalStyles.container1}>
      <View style={modalStyles.innerContainer}>
        <View
          style={{
            width: 30,
            height: 30,
            right: 0,
            marginRight: 20,
            position: 'absolute',
            top: 30,
          }}>
          <TouchableOpacity onPress={() => onclose()}>
            <Image
              style={{width: 30, height: 30}}
              source={require('../../Assests/image/close_blue.png')}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 100 / 2,
            backgroundColor: '#001A0F',
            justifyContent: 'center',
            alignSelf: 'center',
            top: 180,
            marginBottom: 15,
          }}>
          <Image
            style={{width: 50, height: 50, alignSelf: 'center'}}
            source={require('../../Assests/image/rupee_1.png')}
          />
        </View>
        <View style={{alignSelf: 'center', marginBottom: 20, top: 180}}>
          <Text
            style={{
              fontSize: 20,
              fontfamily: BOLD,
              color: color.white,
            }}>
            {t('What_do_you_want_to_do')}
          </Text>
        </View>

        <View style={{top: 200}}>
          <FlatList
            data={ChooseType}
            ItemSeparatorComponent={() => {
              return <View style={{height: 10}} />;
            }}
            renderItem={({item}) => {
              return (
                <View
                  style={{
                    marginHorizontal: 30,
                    marginTop: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 5,
                    height: 50,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: item.selected ? '#00AF66' : '#10281C',
                    backgroundColor: item.selected
                      ? '#001A0F80'
                      : '#10281C',
                  }}>
                  <TouchableOpacity
                    onPress={() => onRadioBtnClick(item)}
                    style={{width: '86%'}}>
                    <Text
                      style={{
                        fontSize: 16,
                        marginLeft: 21,
                        color: item.selected ? '#00AF66' : color.white,
                      }}>
                      {item.title}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => onRadioBtnClick(item)}>
                    {item.selected ? (
                      <Image
                        style={{
                          width: 20,
                          marginHorizontal: 10,
                          height: 20,
                        }}
                        source={require('../../Assests/image/radioselected.png')}
                      />
                    ) : (
                      <Image
                        style={{
                          width: 20,
                          marginHorizontal: 10,
                          height: 20,
                        }}
                        source={require('../../Assests/image/radio_nonselect.png')}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </View>

        <View
          style={{marginHorizontal: 40, bottom: 40, position: 'absolute'}}>
          <CustomTripButton
            buttonTitle={
              selectedID == 1
                ? btnName
                : amount + '/- '+t('MAKE PAYMENT NOW')
            }
            backgroundColor={'#00AF66'}
            onPress={() =>  {
              onNextscreenmove(selectedID)
            }}
          />
        </View>
      </View>
    </View>
)
}

const modalStyles = StyleSheet.create({
    innerContainer:{backgroundColor: '#10281C',borderRadius: 20,borderWidth: 1,flexDirection:'column',alignItems: 'center',justifyContent: 'center',marginHorizontal: 16,height:'75%',marginVertical:'30%'},
    container1: {backgroundColor: 'rgba(0,0,0,0.7)',width: '100%', height: '100%',borderWidth: 1},
  });
  