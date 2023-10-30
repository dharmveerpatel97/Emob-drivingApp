import {View, Text,StyleSheet,Dimensions,TouchableOpacity,Image} from 'react-native';
import React from 'react';
import DatePicker from 'react-native-date-picker';
import { color, fontstyles } from '../../utils/color';
import { REGULAR,BOLD } from '../../utils/fonts';
const mobW = Dimensions.get('screen').width;
export default function DatePickerComponent({
  date,
  onCancel, 
  onConfirm,
  datePickerFlag,
  maximumDate,
  minimumDate,
  pickerOpen,
  dateShow,
  showborder=false,
  labels,
  disabled=false,
  isError,
}) {
  return (
    <View>
      <Text style={styles.labels}>{labels}*</Text>
      <TouchableOpacity
        disabled={disabled}
        onPress={()=>{pickerOpen()}}
        style={[styles.inputFieldContainer,{borderColor:showborder ? color.purpleborder : color.black_medum}]}>
        <Text style={{  color: dateShow == 'DD-MM-YYYY' ? color.white_50 : color.white, fontSize: 20}}>
          {dateShow}
        </Text>
       { showborder ? <Image
          style={{width: 20, height: 20}}
          source={require('../../Assests/image/calendar.png')}
        /> : null
       }
      </TouchableOpacity>
      {isError && 
            <Text style={{color: 'red'}}>
              {isError}
            </Text>
          } 
      <DatePicker
        modal
        mode={'date'}
        open={datePickerFlag}
        theme="dark"
        maximumDate={maximumDate ? maximumDate : null}
        minimumDate={minimumDate ? minimumDate : null}
        date={date ? new Date(date) : new Date()}
        onConfirm={date => onConfirm(date)}
        onCancel={onCancel}
        textColor={color.purpleborder}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#00AF66',
    flex: 1,
    paddingHorizontal: 20,
  },
  labels: {
    color: color.white,
    fontSize: fontstyles.InputHeadingSize,
    fontFamily: BOLD,paddingHorizontal:5,
    marginVertical: 10,
  },
  inputFieldContainer: {
    backgroundColor: color.Black_light,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    height:50,
    width: '100%',
    borderRadius: 10,
    borderWidth: 1.5,
    // borderColor: color.purpleborder,
    paddingHorizontal: 9,
  },
  inputField: {
    fontSize:  fontstyles.InputFontSize,
    fontFamily: REGULAR,
    height: mobW * 0.13,
    width: '100%',
    color: '#fff',
  },
  documentContainer: {
    backgroundColor: color.Black_light,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: Platform.OS == 'android' ? 6 : 14,
    paddingVertical: 26,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: color.purpleborder,
    borderStyle: 'dashed',
    justifyContent: 'center',
  },
  cutomInput: {
    color: '#fff',
    fontSize: fontstyles.InputFontSize,
    fontFamily: REGULAR,
    borderRadius: 20,
    height: mobW * 0.14,
    width: '99%',
  },
});
