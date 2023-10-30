import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import moment from 'moment';
import React, {useCallback, useState} from 'react';
import {color} from '../../utils/color';
import {useTranslation} from 'react-i18next';
import CustomRideCard from '../component/CustomRideCard';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import { mobW,mobH } from '../../utils/config';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { cancelRide, getRideHistory } from '../../Redux/rideSlice';
import Loader from '../customComp/Loader'
import { useFocusEffect } from '@react-navigation/native';

export default function MyRides({navigation}) {
  const [currentRide,setCurrentRide]=useState([])
  const [completedRide,setCompletedRide]=useState([])
  const [cancelledRide,setCancelledRide]=useState([])
  const dispatch = useDispatch();
  const {rideHistory} = useSelector(state => state.ride);
  const [loading,setLoading] = useState(false);
  console.log('====================================rideHistory');
  console.log(rideHistory);
  console.log('====================================rideHistory');

  useFocusEffect(
    useCallback(() => {
      setLoading(true)
      dispatch(getRideHistory()).then(()=>{
        setLoading(false)
      }).catch(() => {
        setLoading(false)
      })
    }, []),
  );

  useEffect(()=>{
    if(rideHistory?.rides && rideHistory?.rides?.length>=0){
      getHistoryTypes()
    }
  },[rideHistory])

  const getHistoryTypes=()=>{
   // let currHis = rideHistory?.rides?.filter((item,index)=>{return (item.status=='assigned' || item.status=='arrived' || item.status=='ended_and_unpaid' || item.status=='in_progress')});
    let compHis = rideHistory?.rides?.filter((item,index)=>{return item.status=='completed'});
    let cancHis = rideHistory?.rides?.filter((item,index)=>{return item.status=='cancelled'});
    
    //console.log('currHis',currHis)
    console.log('compHis',compHis)
    console.log('cancHis',cancHis)
    
    // setCurrentRide([...currHis])
    //currHis.length>=0 &&   setCurrentRide([...currHis]);
    compHis.length>=0 && setCompletedRide([...compHis]);
    cancHis.length>=0 && setCancelledRide([...cancHis]);

    
  }

  const {t} = useTranslation();
  const [activeTab, setActiveTab] = useState(2);
  const TabBox = (active_tab,title)=>{
    return(
      <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        setActiveTab(active_tab);
      }}
      style={active_tab == activeTab ? styles.activeBox : styles.deactiveBox}>
      <Text
        style={ active_tab == activeTab ? styles.activeteTExtColor :  styles.deactiveteTExtColor }>
        {
          t(`${title}`)
        }
      </Text>
    </TouchableOpacity>
    )
  }
  const cancelButton = (rideId)=>{
    console.log('rideId',rideId)
    dispatch(cancelRide(rideId)).then((response)=>{
      console.log('CANCEL RIDER response',response)
      if(response.payload.message=="Success"){
        dispatch(getRideHistory())
      }
    }).catch((error)=>{
      console.log('error',error)
    })
  }

  

  return (
    <SafeAreaView style={styles.container}>
      <Loader isFetching={loading}/>
      <ScrollView contentContainerStyle={{flexGrow:1}}>
        <View
          style={styles.headerBox}>
          <View style={styles.headerSubBox}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon name="arrowleft" color={color.white} size={24} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Text
                style={styles.headerTitle}>
                {t('My_Rides_title')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{flexDirection: 'row'}} />
          </View>

          <View
            style={styles.tabContainer}>
              {/* {TabBox(1,'CURRENT')} */}
              {TabBox(2,'COMPLETED')}
              {TabBox(3,'CANCELLED')}
          </View>
        </View>
        <View style={{paddingHorizontal: mobW * 0.035,flex:1}}>
          {/* {activeTab == 1 && 
            <>
            {
              currentRide.length > 0 ? 
              currentRide.map((item,index)=>{
                return <CustomRideCard  navigation={navigation} data={{type: 'current'}} rideData={item} cancelButton={(rideId)=>cancelButton(rideId)}/>
              })
              :
              <View style={{height:'80%',justifyContent:'center',alignItems:'center'}}>
                  <Text style={{color:"#ffffff",fontSize:18}}>No records found</Text>
              </View>
            }
            </>
          } */}
          {activeTab == 2 && (
            <>
             {
              completedRide.length > 0 ? 
              completedRide.map((item,index)=>{
                return <CustomRideCard navigation={navigation} data={{type: 'complete'}} rideData={item}/>
              })
              :
              <View style={{height:'80%',justifyContent:'center',alignItems:'center'}}>
                  <Text style={{color:"#ffffff",fontSize:18}}>{t('No records found')}</Text>
              </View>
            }
            </>
          )}
          {activeTab == 3 && (
            <>
            {
              cancelledRide.length > 0 ?
              cancelledRide.map((item,index)=>{
                return <CustomRideCard navigation={navigation} data={{type: 'cancelled'}} rideData={item}/>
              })
              :
              <View style={{height:'80%',justifyContent:'center',alignItems:'center'}}>
                  <Text style={{color:"#ffffff",fontSize:18}}>{t('No records found')}</Text>
              </View>
            }
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.black_BG,
    flex: 1,
    paddingVertical: 20,
  },
  headerBox:{
    backgroundColor: '#10281C',
    paddingTop: mobH * 0.032,
  },
  headerSubBox:{
    flexDirection:"row",
    justifyContent:'space-between',
    paddingHorizontal:0.037*mobW
  },
  headerTitle:{
    color: color.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: -20,
  },
  tabContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: mobW * 0.035,
    marginTop: mobW * 0.07,
  },
  deactiveteTExtColor: {
    color: color.white_50,
    fontSize: mobW * 0.040,
    fontWeight: '600',
    marginBottom:7
  },
  activeteTExtColor: {
    color: color.purpleborder,
    fontSize: mobW * 0.040,
    fontWeight: '600',
    marginBottom:7
  },
  activeBox: {
    borderBottomColor: color.purpleborder,
    borderBottomWidth: 2.5,
    width:mobW/2,
    paddingHorizontal: 7,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 5,
  },
  deactiveBox: {
    borderBottomColor: color.black_BG,
    borderBottomWidth: 2.5,
    width:mobW/2,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 5,
  },
});
