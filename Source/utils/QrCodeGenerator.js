import React from 'react'
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-generator';

const QrCodeGenerator=({value})=>{
    return <View style={{alignSelf:'center'}}>
        <QRCode
    value={value}
    size={125}
    bgColor={color.black_BG}
    fgColor='white'/>
    </View> 
}
export default QrCodeGenerator