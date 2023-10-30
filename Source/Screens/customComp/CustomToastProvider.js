import { View, Text } from 'react-native'
import React from 'react'
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#05e326' }}
      contentContainerStyle={{ paddingHorizontal: 15,backgroundColor:'#0D1724',zIndex:999 }}
      text1Style={{
        fontSize: 17,
        fontWeight: '400',
        color:"#fff",
      }}
      text2Style={{
        fontSize: 15,
        color:"#fff",
      }}
    />
  ),
   
  error: (props) => (
    <ErrorToast
    {...props}
      style={{ borderLeftColor: '#CB0017' }}
      contentContainerStyle={{ paddingHorizontal: 15,backgroundColor:'#0D1724',zIndex:999}}
      text1Style={{
        fontSize: 17,
        color:"#fff",
      }}
      text2Style={{
        fontSize: 15,
        color:"#fff",
      }}
    />
  ), 
  warning: (props) => (
    <ErrorToast
    {...props}
      style={{ borderLeftColor: '#ff9966' }}
      contentContainerStyle={{ paddingHorizontal: 15,backgroundColor:'#0D1724',zIndex:999}}
      text1Style={{
        fontSize: 17,
        color:"#fff",
      }}
      text2Style={{
        fontSize: 15,
        color:"#fff",
      }}
    />
  ), 
};
export default function CustomToastProvider() {
  return (
    <Toast config={toastConfig} /> 
  )
}