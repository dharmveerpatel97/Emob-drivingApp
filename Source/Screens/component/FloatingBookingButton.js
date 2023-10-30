import React from 'react';
import {View,Text,StyleSheet, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import { color } from '../../utils/color';

const FloatingBookingButton=({bottomColor, onCurrentLocationPressed})=>{
  const {t} = useTranslation();
  
return (
    <View style={[styles.container,{ bottom:bottomColor,}]}>
        <View style={styles.rowContainer}>

        <View style={styles.bookBtnContainer}>
          <Text style={styles.booktxt}>{t("Floating_Book")}</Text>
        </View>


        <TouchableOpacity onPress={()=>onCurrentLocationPressed()} style={styles.directionContainer}>

        </TouchableOpacity>

        </View>
        </View>
);
}

const styles = StyleSheet.create({
container:{marginHorizontal:16,  position:'absolute', left:0,right:0},
rowContainer:{flexDirection:'row', justifyContent: 'space-between'},
bookBtnContainer:{backgroundColor:'#10281C', width:105, height:45, borderRadius:10, borderwidth:1, borderColor:'#001A0F', justifyContent:'center'},
booktxt:{color:'#00AF66', fontSize:18, alignSelf:'center' },
directionContainer:{width:48, height:48, borderRadius:48/2, backgroundColor:'#10281C'},
})
export default FloatingBookingButton;