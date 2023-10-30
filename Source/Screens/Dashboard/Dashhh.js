import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import BottomSheet from 'react-native-simple-bottom-sheet'

export default function Dashhh() {
  return (
    <View style={{flex: 1}}>
    <BottomSheet isOpen sliderMinHeight={50} onOpen={()=>{alert('open')}} onClose={()=>{alert('onClose')}}>
      {(onScrollEndDrag) => (
        <ScrollView onScrollEndDrag={onScrollEndDrag}>
          {[...Array(10)].map((_, index) => (
            <View key={`${index}`} style={{backgroundColor:"red"}}>
              <Text>{`List Item ${index + 1}`}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </BottomSheet>
  </View>
  )
}
