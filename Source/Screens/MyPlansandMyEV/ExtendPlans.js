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
  PermissionsAndroid,
  TouchableOpacity,
  Image,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import {BOLD, REGULAR, ITALIC} from '../../utils/fonts';
import CustomPressable from '../customComp/CustomPressable';
import {color} from '../../utils/color';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import {mobW, mobH} from '../../utils/config';
import Check from '../../Assests/image/Check.png';
import PaymentChoice from '../component/PaymentChoice';
import {useTranslation} from 'react-i18next';

export default function ExtendPlans({navigation}) {
  const {t} = useTranslation();
  const [isvisiblePayChoice, setisvisiblePayChoice] = useState(false);
  const [selectedID, setselectedID] = useState(2);

  const offer = [
    {title: '2 FREE charging hours'},
    {title: '2 FREE battery swaps'},
    {title: 'Reference site about Lorem Ipsum'},
    {title: 'Reference site about Lorem Ipsum'},
    {title: 'Dummy Text'},
    {title: 'Reference site Lorem Ipsum'},
  ];

  const renderItem = ({item}) => {
    return (
      <View
        style={{
          marginHorizontal: 15,
          borderRadius: 10,
          flexDirection: 'row',
          height: 24,
          marginVertical: 5,
        }}>
        <Image
          style={{width: 24, marginHorizontal: 15, height: 24}}
          source={Check}
        />
        <Text
          style={{
            color: 'white',
            fontSize: 14,
            marginVertical: 2,
            fontFamily: REGULAR,
          }}>
          {' '}
          {item.title}{' '}
        </Text>
      </View>
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
        <View style={styles.headerBox}>
          <View style={styles.headerSubBox}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon name="arrowleft" color={color.white} size={24} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.headerTitle}> {t('My Plans')} </Text>
            </TouchableOpacity>
            <TouchableOpacity></TouchableOpacity>
          </View>

          <View
            style={{
              marginHorizontal: 30,
              flexDirection: 'row',
              marginTop: 20,
              justifyContent: 'space-between',
            }}>
            <Text style={styles.headerTitle1}>{t('Current Plan')}</Text>
            <Text style={styles.headerTitle1}>{t('3 April 2023 12:00PM')}</Text>
          </View>

          <View
            style={{
              marginHorizontal: 30,
              flexDirection: 'row',
              marginVertical: 20,
              justifyContent: 'space-between',
            }}>
            <Text style={styles.headerTitle}>{t('Bronze - Hourly')}</Text>
            <Text style={styles.headerTitle}>{'₹4,999/-'}</Text>
          </View>
          <FlatList
            data={offer}
            renderItem={renderItem}
            contentContainerStyle={{marginLeft: 10}}
            keyExtractor={item => item.id}
          />
          <View
            style={{
              borderBottomColor: color.white_50,
              marginHorizontal: 50,
              marginVertical: 15,
              borderStyle: 'dashed',
              borderBottomWidth: 2,
            }}
          />
          <Text
            style={{
              width: '100%',
              textAlign: 'center',
              justifyContent: 'center',
              color: color.white,
              fontFamily: REGULAR,
              fontSize: 14,
              paddingHorizontal: 50,
              lineHeight: 22,
            }}>
            {t('Reference site about Lorem Ipsum, giving information on its origins')}
          </Text>

          <View style={{flexDirection: 'row', height: 40, marginTop: 30}}>
            <Text
              style={{
                fontSize: 14,
                margin: 10,
                paddingHorizontal: 20,
                fontFamily: REGULAR,
                color: color.white,
              }}>
              {' '}
              {t('Extend Hours')}
            </Text>

            <View
              style={{
                backgroundColor: color.white,
                borderRadius: 5,
                right: 20,
                position: 'absolute',
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <TouchableOpacity>
                <Image
                  source={require('../../Assests/image/minus.png')}
                  style={{height: 2, width: 10, margin: 10}}
                />
              </TouchableOpacity>

              <Text
                style={{
                  color: color.Border_color,
                  fontFamily: BOLD,
                  paddingHorizontal: 10,
                  borderLeftColor: color.Border_color,
                  borderRightColor: color.Border_color,
                  borderLeftWidth: 0.5,
                  borderRightWidth: 0.5,
                }}>
                {t('8 Hours')}
              </Text>
              <TouchableOpacity>
                <Image
                  source={require('../../Assests/image/plus_p.png')}
                  style={{height: 10, width: 10, margin: 10}}
                />
              </TouchableOpacity>
            </View>
          </View>

          <CustomPressable
            text={`${t('extendPlan_EXTEND_PAY')} ₹799.00`}
            marginTop={100}
            btnWidth={mobW - 60}
            route={''}
            isGradient={true}
            backgroundColor="#10281C"
            onPress={() => {
              setisvisiblePayChoice(true);
            }}
            position={'relative'}
            bottom={0}
          />
          <View style={{marginTop: 20, width: mobW, paddingHorizontal: 30}}>
            <TouchableOpacity
              style={{
                height: 50,
                width: '100%',
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#00AF66',
                borderRadius: 10,
              }}
              onPress={() => {
                navigation.navigate('UpgradedPlans');
              }}>
              <Text
                style={{
                  fontSize: 20,
                  alignSelf: 'center',
                  color: '#ffffff',
                  fontFamily: BOLD,
                }}>
                {' '}
                {t('UPGRADE PLAN')}{' '}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
  },
  headerTitle: {color: color.white, fontSize: 20, fontFamily: BOLD},
  headerTitle1: {
    color: color.white,
    fontSize: 14,
    fontFamily: REGULAR,
  },
});
