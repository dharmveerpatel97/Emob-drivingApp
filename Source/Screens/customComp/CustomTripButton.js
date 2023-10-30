import React from 'react'
import { Text,StyleSheet, TouchableOpacity, Dimensions } from "react-native"
import { color } from '../../utils/color';
import { BOLD } from '../../utils/fonts';

const WIDTH = Dimensions.get('screen').width;
const HEIGHT = Dimensions.get('screen').height;

const CustomTripButton =({backgroundColor, buttonTitle,onPress})=>{
    return (
        <TouchableOpacity onPress={()=>onPress()} style={{width:WIDTH-50, height:50, borderRadius:10,backgroundColor: backgroundColor, justifyContent:'center', marginTop:20}}>
            <Text style={{alignSelf:'center',fontWeight:'700', fontFamily:BOLD, fontSize:16, color:color.white}}>{buttonTitle}</Text>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({

})
export default CustomTripButton