import {StyleSheet} from 'react-native';
import {resetStack, mobW, mobH} from '../utils/commonFunction';
import {color} from '../utils/color';
import {BOLD, REGULAR, ITALIC} from '../utils/fonts';
const RentalEVStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.black_BG,
  },
  topContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    marginHorizontal: 16,
    marginTop: mobH * 0.056,
  },
  topContainer_text: {
    display: 'flex',
    justifyContent: 'center',
    marginStart: 15,
  },

  innerText: {
    color: 'white',
    fontSize: 22,
    fontFamily: BOLD,
  },

  linearGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: 50,
    borderRadius: 10,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    flexDirection: 'column',
    right: 0,
    borderRadius: 10,
  },
  timeTxt: {
    fontSize: mobW * 0.038,
    color: color.white,
    fontFamily: BOLD,
  },

  placeBox: {
    margin: 16,
    borderWidth: 1,
    backgroundColor: '#10281C',
    paddingBottom: mobH * 0.021,
    paddingTop: mobH * 0.021,
    paddingLeft: 10,
    borderRadius: 10,
    width: mobW * 0.94,
    alignSelf: 'center',
  },
  rideIcons: {
    height: mobW * 0.05,
    width: mobW * 0.05,
    padding: 2,
  },
  dotedIcons: {
    borderStyle: 'dotted',
    height: '100%',
    borderLeftWidth: 2,
    borderColor: color.Border_color,
    marginLeft: mobW * 0.02,
  },
  dotedIcons1: {
    borderStyle: 'dotted',
    height: '100%',
    borderLeftWidth: 2,
    borderColor: color.Border_color,
    marginLeft: mobW * 0.02,
  },
  secondBox: {
    justifyContent: 'space-between',
    height: mobW,
    marginTop: 20,
    paddingVertical: mobW * 0.02,
    marginLeft: mobW * 0.03,
  },
  startPointTxt: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.7,
    fontFamily: REGULAR,
  },
  startRideTimeBox: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: mobW * 0.75,
  },
  startPointTimeTxt: {
    color: color.white,
    fontSize: 12,
    opacity: 0.7,
    fontFamily: REGULAR,
    marginTop: 10,
    marginRight: mobW * 0.09,
  },
  FifthContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 15,
    marginHorizontal: 16,
    borderRadius: 10,
    borderColor: '#10281C',
    borderWidth: 2,
    backgroundColor: '#10281C',
    paddingVertical: 10,
  },

  progressBox: {
    margin: 16,
    backgroundColor: '#10281C',
    paddingBottom: mobH * 0.021,
    paddingTop: mobH * 0.021,
    paddingLeft: 10,
    borderRadius: 10,
    width: mobW * 0.94,
    alignSelf: 'center',
  },
  progressIcons: {
    height: mobH * 0.03,
    width: mobH * 0.03,
  },
  acceRejectProgressDotline1: {
    borderStyle: 'solid',
    height: mobH * 0.09,
    borderLeftWidth: 2,
    borderColor: color.Border_color,
  },
  acceRejectProgressDotline2: {
    borderStyle: 'dotted',
    height: mobH * 0.21,
    borderLeftWidth: 2,
    borderColor: color.Border_color,
  },
  progresSubHead: {
    color: color.white,
    marginTop: 10,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: BOLD,
  },
  vehicleAcceptBtn: {
    backgroundColor: color.red,
    width: '40%',
    marginRight: 10,
    justifyContent: 'center',
    borderRadius: 10,
    alignItems: 'center',
  },
  vehicleRejectBtn: {
    backgroundColor: color.acceptGreenColor,
    width: '40%',
    marginHorizontal: 10,
    justifyContent: 'center',
    borderRadius: 10,
    alignItems: 'center',
  },
  vehicleAcceptBtnTxt: {
    color: color.white,
    alignSelf: 'center',
    fontFamily: 'Poppins-Medium',
  },
  divider: {
    borderWidth: 0.5,
    borderColor: color.white_50,
    width: mobW * 0.75,
    marginVertical: 20,
    height: 1,
  },
  wayToOperationDottedLine1:{
    borderStyle: 'dotted',
    height: mobH * 0.21,
    borderLeftWidth: 2,
    borderColor: color.Border_color,
  },
  wayToOperationDottedLine2:{
    borderStyle: 'dotted',
    height: mobH * 0.09,
    borderLeftWidth: 2,
    borderColor: color.Border_color,
  },
  wayToOperationAdd:{
    color: color.white,
    padding: 10,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    fontFamily: 'Roboto-Medium',
    marginRight:mobW*0.09
  },
  linearButton:{
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: 50,
    borderRadius: 10,
  }
});

export default RentalEVStyle;
