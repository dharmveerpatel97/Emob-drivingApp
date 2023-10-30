import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View,ScrollView,Header,Modal,StyleSheet,StatusBar,SafeAreaView,Platform,FlatList,Text,TouchableOpacity,Image} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {color} from '../../utils/color';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import {mobW, mobH} from '../../utils/config';
import {BOLD, REGULAR, ITALIC} from '../../utils/fonts';
import {useTranslation} from 'react-i18next';



export default function FAQ({onclose,onNotification,title,yesclick,noclick}) {
  const {t} = useTranslation();


  return (
    <SafeAreaView style={styles.container}>
       <StatusBar translucent barStyle="light-content" />
      <View style={styles.headerBox}>
        <View style={styles.headerSubBox}>
        <TouchableOpacity
              onPress={()=> onclose()}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon name="arrowleft" color={color.white} size={24} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Text
                style={styles.headerTitle}>
               {t("FAQ_faq")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onNotification()
              }}
              style={{flexDirection: 'row', alignItems: 'center',marginRight:10}}>
                  <Image
      style={{width: 40, height: 40}}
      source={require('../../Assests/image/notification_white.png')}/>
            </TouchableOpacity>
        </View>

        <Text style={{color: color.white,fontSize: 16,fontFamily:'Robot-Medium',height:40,opacity:0.7,marginTop:50,marginHorizontal:16}}> {t("FAQ_faq")} </Text>
        <Text style={{color: color.white,fontSize: 14,fontFamily:'Robot-Medium',height:40,marginHorizontal:16}}> {title} </Text>
        <Text style={{color: color.white,fontSize: 14,opacity:0.7,fontFamily:'Robot-Medium',marginHorizontal:16,lineHeight:20}}>
       {t("FAQ_driver")}
       </Text>
       <View style={{width:mobW-30,marginHorizontal:15,marginTop:60,flexDirection:'column'}}>
                <View style={{opacity:0.3,marginTop:10,height:1,backgroundColor:color.white}}></View>
               <Text style={{fontSize: 14,marginVertical:25,color: color.white,lineHeight:20,width:'100%',fontFamily:'Roboto-Medium'}}> {t('FAQ_information')} </Text>
              <View style={{flexDirection:'row',marginLeft:5}}>
               <TouchableOpacity style={{width: 80, height: 50}} onPress={() => { yesclick()}}>
               <Text
                style={styles.btnTitle}>
               {t("FAQ_Yes")}
              </Text> 
               </TouchableOpacity>
            <TouchableOpacity style={{width: 80, height: 50}} onPress={() => { noclick() }}>
            <Text
                style={styles.btnTitle}>
               {t("FAQ_No")}
              </Text> 
              </TouchableOpacity>
            </View>
             
           </View>

      </View>
 </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {backgroundColor: color.black_BG,flex: 1},
  headerBox: {height:mobH-30,width:mobW},
  sectionWrapper: {justifyContent: "center", alignItems: "center"},
  headerSubBox:{flexDirection:"row",justifyContent:'space-between',paddingHorizontal:0.037*mobW,height:40},
  btnTitle:{color: color.white,fontSize: 20,textAlignVertical:'center',fontFamily:'Robot-Bold',height:40},

  headerTitle:{color: color.white,fontSize: 20,textAlignVertical:'center',textAlign:'center',fontFamily:'Robot-Bold',height:40},
 ButtonContainer: { marginTop:150,marginHorizontal:16,borderRadius:10,backgroundColor:'#10281C'},
  listTitle:{ flexWrap:'wrap',paddingHorizontal:45,width:'100%', textAlign: 'center',color: color.white,fontFamily:BOLD, fontSize: 22,marginVertical:50},
  rowStyle:{justifyContent:'center',backgroundColor:'#10281C',borderRadius:10,borderRadius:10,height:110,width:'30%',alignSelf: 'center',alignItems:'center',flexDirection:'column'}
 });
