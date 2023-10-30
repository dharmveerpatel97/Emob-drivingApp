import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Header,
  Modal,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import CustomPressable from '../customComp/CustomPressable';
import {color} from '../../utils/color';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import {mobW, mobH} from '../../utils/config';
import Check from '../../Assests/image/Check.png';
import PaymentChoice from '../component/PaymentChoice';
import {BOLD, REGULAR, ITALIC} from '../../utils/fonts';
import {useTranslation} from 'react-i18next';
export default function UpgradPlan({navigation, route}) {
  const [PayModalVisible, setPayModalVisible] = useState(false);
  const [selectedID, setselectedID] = useState(2);
  const {t} = useTranslation();
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
          marginVertical: 10,
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
      <Modal transparent visible={PayModalVisible}>
        <PaymentChoice
          btnName={t('PAY LATER')}
          onclose={() => {
            setPayModalVisible(false);
          }}
          onNextscreenmove={selectedID => {
            selectedID == 1
              ? navigation.navigate('Myplans')
              : navigation.navigate('EvPayment', {
                  showmsg: true,
                  rootmove: 'Myplans',
                  rootname: 'Back to My Plans',
                });
            setPayModalVisible(false);
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
              <Text style={styles.headerTitle}>
                {' '}
                {t('extendPlan_My_Plans')}{' '}
              </Text>
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

          <View
            style={{
              marginHorizontal: 30,
              flexDirection: 'row',
              marginVertical: 20,
              justifyContent: 'space-between',
            }}>
            <Text style={styles.headerTitle}>{route.params.plan}</Text>
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.headerTitle}>{route.params.price}</Text>
              <Text
                style={[
                  styles.headerTitle2,
                  {justifyContent: 'flex-start', opacity: 0.7, height: 30},
                ]}>
                {' '}
                {route.params.beforeprice}
              </Text>
              <View
                style={{
                  backgroundColor: color.white,
                  opacity: 0.7,
                  height: 1,
                  marginTop: -18,
                }}></View>
            </View>
          </View>
          <FlatList
            data={offer}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
          <View
            style={{
              borderColor: color.white,
              marginHorizontal: 50,
              marginVertical: 20,
              borderStyle: 'dashed',
              borderWidth: 1,
              borderRadius: 1,
            }}></View>
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
            {' '}
            {t(
              'Reference site about Lorem Ipsum, giving information on its origins',
            )}
          </Text>
        </View>
      </ScrollView>
      <CustomPressable
        text={t('UPGRADE PLAN')}
        marginTop={20}
        btnWidth={mobW - 60}
        route={''}
        isGradient={true}
        backgroundColor="#10281C"
        onPress={() => {
          setPayModalVisible(true);
        }}
        position={'absolute'}
        bottom={50}
      />
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
  headerTitle2: {color: color.white, fontSize: 16, fontFamily: REGULAR},
  headerTitle1: {color: color.white, fontSize: 14, fontFamily: REGULAR},
});
