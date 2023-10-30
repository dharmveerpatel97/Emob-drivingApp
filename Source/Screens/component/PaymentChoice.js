import {BOLD} from '../../utils/fonts';
import React, {useState} from 'react';
import {color} from '../../utils/color';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import CustomPressable from '../customComp/CustomPressable';
import {mobW} from '../../utils/commonFunction';
import { useTranslation } from 'react-i18next';

export default function PaymentChoice({
  amount,
  onclose,
  onNextscreenmove,
  btnName,
  isLoading=false,
  errorMessage='',
  hideOnline=false
}) {

  const {t} = useTranslation();
  const [ChooseType, setChooseType] = useState([
    // {
    //   id: 2,
    //   title: 'Pay Online Now',
    //   selected: true,
    // },
    {
      id: 1,
      title: 'Pay later at pickup point',
      selected: true,
    },
  ]);

  const capitalizeFirstCharacter = (str) => { 
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const onRadioBtnClick = async item => {
    let updatedState = ChooseType.map(isLikedItem =>
      isLikedItem.id === item.id
        ? {...isLikedItem, selected: true}
        : {...isLikedItem, selected: false},
    );
    setChooseType(updatedState);
    setselectedID(item.id);
  };

  const [selectedID, setselectedID] = useState(1);
  // const [selectedID, setselectedID] = useState(2);
  return (
    <View style={modalStyles.container1}>
      <View style={modalStyles.innerContainer}>
        <TouchableOpacity
        onPress={()=>{onclose()}}
          style={{
            width: 30,
            height: 30,
            right: 0,
            marginRight: 15,
            position: 'absolute',
            top: 15,
            zIndex: 999,
          }}>
          <Image
            style={{width: 30, height: 30}}
            source={require('../../Assests/image/close_blue.png')}
          />
        </TouchableOpacity>
        <View style={modalStyles.rupeeIconContainer}>
          <Image
            style={{width: 60, height: 60, alignSelf: 'center'}}
            source={require('../../Assests/image/rupee_1.png')}
          />
        </View>

        <Text style={modalStyles.desText}>{t('What_do_you_want_to_do')}</Text>

        {/* <FlatList
          data={ChooseType}
           style={{backgroundColor:color.red}}
          ItemSeparatorComponent={() => {
            return <View style={{height: 10}} />;
          }}
          renderItem={({item,index}) => {
            return ( 
              <>
              { */}
             
              <TouchableOpacity
                onPress={() => onRadioBtnClick(ChooseType[0])}
                style={{
                  marginTop: 10,
                  flexDirection: 'row',
                  marginBottom: 5,
                  height: 50,
                  borderRadius: 10,
                  width: mobW-100,
                  alignItems: 'center',
                  alignSelf: 'center',
                  justifyContent: 'space-between',
                  borderWidth: 1,
                  borderColor: ChooseType[0].selected ? null : '#00AF66',
                  backgroundColor: ChooseType[0].selected ? '#001A0F80' : '#10281C',
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    marginLeft: 21,
                    color: ChooseType[0].selected ? color.white : '#00AF66',
                  }}>
                  {t(`${ChooseType[0].title}`)}
                </Text>

                {ChooseType[0].selected ? (
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
              
              {/* }
              </>
            );
          }}
        /> */}
{
  errorMessage && 
        <Text style={{color:'red',marginTop:15,marginLeft:9}} numberOfLines={2}>{capitalizeFirstCharacter(errorMessage)}</Text>
}
        <CustomPressable
          isLoading={isLoading}
          text={
            selectedID == 1 ? btnName : '₹' + amount + '/-' + t('MAKE PAYMENT NOW')
          }
          isGradient={true}
          marginTop={15}
          btnWidth={mobW - 100}
          route={'Verify'}
          onPress={() => {
            onNextscreenmove(selectedID);
          }}
          position={'relative'}
          bottom={0}
        />
      </View>
    </View>
  );
}

const modalStyles = StyleSheet.create({
  innerContainer: {
    right: 0,
    marginRight: 20,
    position: 'absolute',
    width:mobW-50,
   backgroundColor: '#10281C',
   
    paddingVertical: 25,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  rupeeIconContainer: {
    width: mobW * 0.2,
    height: mobW * 0.2,
    borderRadius: (mobW * 0.2) / 2,
    backgroundColor: '#001A0F',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  desText: {
    fontSize: 20,
    fontfamily: BOLD,
    color: color.white,
    textAlign: 'center',
    marginTop: 10,
    marginBottom:20
  },
  container1: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
  },
});
