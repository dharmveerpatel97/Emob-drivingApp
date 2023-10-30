import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Header,
  StyleSheet,
  Modal,
  StatusBar,
  SafeAreaView,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import {BOLD, REGULAR, ITALIC} from '../../utils/fonts';
import CustomPressable from '../customComp/CustomPressable';
import {color} from '../../utils/color';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import {mobW, mobH} from '../../utils/config';
import Check from '../../Assests/image/Check.png';
import PaymentChoice from '../component/PaymentChoice';
import {useTranslation} from 'react-i18next';

export default function UpgradedPlans({navigation}) {
  const {t} = useTranslation();
  const [isvisiblePayChoice, setisvisiblePayChoice] = useState(false);
  const [selectedID, setselectedID] = useState(2);
  const DATA = [
    {
      id: '1',
      planName: 'Platinum',
      totalDays: '1 months',
      payableAmt: '₹4,999/-',
      actualPrice: '₹28,999/-',
    },
    {
      id: '2',
      planName: 'Gold',
      totalDays: '1 months',
      payableAmt: '₹4,999/-',
      actualPrice: '₹28,999/-',
    },
    {
      id: '3',
      planName: 'Platinum',
      totalDays: '1 months',
      payableAmt: '₹4,999/-',
      actualPrice: '₹28,999/-',
    },
    {
      id: '4',
      planName: 'Silver',
      totalDays: '1 months',
      payableAmt: '₹4,999/-',
      actualPrice: '₹28,999/-',
    },
  ];

  const renderItem_offer = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('UpgradPlan', {
            plan: item.title,
            price: item.title1,
            beforeprice: item.title2,
          });
        }}
        style={{
          marginHorizontal: 16,
          backgroundColor: '#2e2e2e',
          paddingVertical: 9,
          paddingHorizontal: 0.037 * mobW,
          borderRadius: 10,
          marginBottom: 25,
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View>
          <Text
            style={{
              color: color.white,
              fontSize: 16,
              opacity: 0.7,
              height: 30,
              fontFamily: 'Roboto-Bold',
              justifyContent: 'flex-start',
            }}>
            {item.planName + ' '} - {' ' + item.totalDays}
          </Text>
          <Text
            style={{
              fontSize: 18,
              height: 30,
              fontFamily: 'Roboto-Bold',
              justifyContent: 'flex-start',
              color: '#ffffff',
            }}>
            {'  ' + item.payableAmt + '    '}
            <Text
              style={{
                color: color.white_50,
                opacity: 0.7,
                textDecorationLine: 'line-through',
              }}>
              {item.actualPrice}
            </Text>
          </Text>
        </View>
        <Image
          style={{width: 10, height: 15}}
          source={require('../../Assests/image/next.png')}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal transparent visible={isvisiblePayChoice}>
        <PaymentChoice
          btnName={t('PAY LATER')}
          onclose={() => {
            setisvisiblePayChoice(false);
          }}
          onNextscreenmove={selectedID => {
            selectedID == 1
              ? navigation.navigate('Myplans')
              : navigation.navigate('EvPayment', {
                  showmsg: true,
                  rootmove: 'Myplans',
                  rootname: 'Back to My Plans',
                });
            setisvisiblePayChoice(false);
          }}></PaymentChoice>
      </Modal>

      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: mobH * 0.08}}
        scrollEnabled={true}>
        <StatusBar translucent barStyle="light-content" />
        <View style={styles.headerSubBox}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="arrowleft" color={color.white} size={24} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.headerTitle}> {t('My Plans')} </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Notification');
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 10,
            }}>
            <Image
              style={{width: 40, height: 40}}
              source={require('../../Assests/image/notification_white.png')}
            />
          </TouchableOpacity>
        </View>

        <FlatList
          contentContainerStyle={{marginTop: 50}}
          data={DATA}
          renderItem={renderItem_offer}
          keyExtractor={item => item.id}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {backgroundColor: color.black_BG, flex: 1, paddingVertical: 20},
  headerBox: {paddingTop: mobH * 0.032},
  headerSubBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0.037 * mobW,
    marginTop: 25,
  },
  headerTitle: {color: color.white, fontSize: 20, fontFamily: BOLD},
  headerTitle1: {
    color: color.white,
    fontSize: 14,
    fontFamily: REGULAR,
  },
});
