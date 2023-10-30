import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  ToastAndroid,BackHandler
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import React, {useState,useCallback} from 'react';
import {responsive_factor} from '../../constant/auth';
import CustomBtn from '../customComp/customBtn';
import {color, fontstyles} from '../../utils/color';
import Icons from 'react-native-vector-icons/dist/Ionicons';
import Header from '../customComp/Header';
import {BOLD, ITALIC, REGULAR} from '../../utils/fonts';
import RestApiClient from '../../network/RestApiClient';
import StorageProvider from '../../Session/StorageProvider';
import {useReducer} from 'react';
import CustomPressable from '../customComp/CustomPressable';
import msgProvider from '../../utils/MessageProvider';
import CustomTextInputEdit from '../component/CustomTextInputEdit';
import {useTranslation} from 'react-i18next';
import DropdownComponent1 from '../customComp/customDropDown1';
import { useDispatch } from 'react-redux';
import { getCityByState, getState } from '../../Redux/appSlice';
import { endPoints,methods,urlReqType,urls } from '../../utils/config';
const mobW = Dimensions.get('screen').width;

export default function AddressDetails({navigation, route}) {
  const {t} = useTranslation();
  const userData = route?.params?.userData;
  const [selection, setSelection] = useState('');
  const [value, setValue] = useState('');
  const [isSelected, setIsSelected] = useState(false);
  const [checkbox, setCheackbox] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [allowFlag, setAllowFlag] = useState(false);
  const [stateArr, setStateArr] = useState([]);
  const [cityArr, setCityArr] = useState([]);
  const [cityArr1, setCityArr1] = useState([]);
  const [userDatainfo,setuserDatainfo]= useState({});

  const [addDetails, setAddDetails] = useState({
    pincode: '',
    city: '',
    state: '',
    address: '',
    pincode1: '',
    city1: '',
    state1: '',
    address1: '',
    houseNumber: '',
    postOffice: '',
    houseNumber1: '',
    postOffice1: '',
  });

  const [isError, setIsError] = useState({
    pincode: '',
    city: '',
    state: '',
    address: '',
    pincode1: '',
    city1: '',
    state1: '',
    address1: '',
    houseNumber: '',
    postOffice: '',
    houseNumber1: '',
    postOffice1: '',
  });


  const dispatch = useDispatch();
  useState(()=>{
    dispatch(getState()).then((res)=>{
      if(res?.payload?.states){
        let states = res.payload.states.map((state)=>{
          return {id:state.id, stateName:state?.stateName, enabled:state.enabled,name:state.stateName}
        })
        console.log('statesstates',states)
        setStateArr(states)
      }
      console.log('state list success',res)
    }).catch((error)=>{
      console.log('state list error',error)
    })
  },[])

  useFocusEffect(
    useCallback(() => {
        getUserProfileInfo();
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        backPress,
      );
      return () => subscription.remove();
    }, []),
  );

  const backPress = () => {
    navigation.navigate('signup');
  }

  const getUserProfileInfo = async () => {
    await StorageProvider.getObject('accessToken')
      .then(res => {
        if (res) {
            RestApiClient(
            methods.GET,
            '',
            endPoints.GET_DRIVER_PROFILE_SELF,
            urlReqType.DMS,
            res?.accesstoken,
          )
            .then(response => {
               if (!response?.message) {
                   setuserDatainfo(response)
                   setAddDetails({
                    ...addDetails,
                    pincode: response?.address[0].pinCode.toString(),
                    city: response?.address[0].city,
                    state: response?.address[0].state,
                    address: response?.address[0].street,
                    houseNumber: response?.address[0].doorNumber,
                    postOffice: response?.address[0].postOffice,
          
                    pincode1: response?.address[1].pinCode.toString(),
                    city1: response?.address[1].city,
                    state1: response?.address[1].state,
                    address1: response?.address[1].street,
                    houseNumber1: response?.address[1].doorNumber,
                    postOffice1: response?.address[1].postOffice,
                  });
                } 

            })
            .catch(error => {
             
              ToastAndroid.show(t('errorOccured'), ToastAndroid.SHORT);
              console.log(error);
            });
        }
      })
      .catch(err => {
        ToastAndroid.show(t('errorOccured'), ToastAndroid.SHORT);
      });
  };


  const getCity = (stateid,cityType)=>{
    dispatch(getCityByState(stateid)).then((res)=>{
      if(res?.payload?.cities){
        let cities = res.payload.cities.map((city)=>{
          return {id:city.id, cityName:city?.cityName, enabled:city.enabled,name:city.cityName}
        })
        console.log('citiescities',cities)
        if(cityType=='state'){
          setCityArr(cities)
        }else{
          setCityArr1(cities)
        }
      }
      console.log('state list success',res)
    }).catch((error)=>{
      console.log('state list error',error)
    })
  }


  const selfEnrollDriver = () => {
    StorageProvider.getItem('userdata')
      .then(() => {})
      .catch(() => {});
    const body = {
      address: [
        {
          city: 'Noida',
          doorNumber: '12',
          pinCode: 7,
          postOffice: 'Noida',
          state: 'UP',
          street: 'string',
          type: 'local',
        },
      ],
      emergencyContact: {
        name: 'sumit',
        phNumber: '9786979796',
        relation: 'brother',
      },
      alternateMobileNumbers: ['7886868583'],
      bloodGroup: 'o-',
      dob: '12/07/2000',
    };

    StorageProvider.getItem('accessToken')
      .then(res => {
        console.log('res', res);
      })
      .catch(err => {});
  };

  const saveAndContinue = () => {
    let vailidation_flag = true;

    if (!addDetails?.pincode || isError.pincode != '') {
      vailidation_flag = false;
      setIsError(prev => {
        return {...prev, pincode: t('emptyPincode')};
      });
    }

    if (!addDetails?.city || isError.city != '') {
      vailidation_flag = false;
      setIsError(prev => {
        return {...prev, city: t('emptyCity')};
      });
    }

    if (!addDetails?.state || isError.state != '') {
      vailidation_flag = false;
      setIsError(prev => {
        return {...prev, state: t('emptyState')};
      });
    }

    if (!addDetails?.address || isError.address != '') {
      vailidation_flag = false;
      setIsError(prev => {
        return {...prev, address: t('emptyAdd')};
      });
    }

    if (!addDetails?.pincode1 || isError.pincode1 != '') {
      vailidation_flag = false;
      setIsError(prev => {
        return {...prev, pincode1: t('emptyPincode')};
      });
    }

    if (!addDetails?.city1) {
      vailidation_flag = false;
      setIsError(prev => {
        return {...prev, city1: t('emptyCity')};
      });
    }

    if (!addDetails?.state1) {
      vailidation_flag = false;
      setIsError(prev => {
        return {...prev, state1: t('emptyState')};
      });
    }

    if (!addDetails?.address1 || isError.address1 != '') {
      vailidation_flag = false;
      setIsError(prev => {
        return {...prev, address1: t('emptyAdd')};
      });
    }

    if (!addDetails?.houseNumber || isError.houseNumber != '') {
      vailidation_flag = false;
      setIsError(prev => {
        return {...prev, houseNumber: t('emptyHNo')};
      });
    }

    if (!addDetails?.houseNumber1 ||  isError.houseNumber1 != '') {
      vailidation_flag = false;
      setIsError(prev => {
        return {...prev, houseNumber1: t('emptyHNo')};
      });
    }

    if (!addDetails?.postOffice || isError.postOffice != '') {
      vailidation_flag = false;
      setIsError(prev => {
        return {...prev, postOffice: t('emptyPO')};
      });
    }

    if (!addDetails?.postOffice1 || isError.postOffice1 != '') {
      vailidation_flag = false;
      setIsError(prev => {
        return {...prev, postOffice1: t('emptyPO')};
      });
    }
    if (vailidation_flag) {
      
        userDatainfo?.emergencyContact ? updateProfile() : submitprofile()
    }
  };



  const updateProfile = () =>
  {
   
    let body = {
      address: [
        {
          city: addDetails.city,
          doorNumber: addDetails.houseNumber,
          pinCode: parseInt(addDetails.pincode),
          postOffice: addDetails.postOffice,
          state: addDetails.state,
          street: addDetails.address,
          type: 'local',
        },
        {
          city: addDetails.city1,
          doorNumber: addDetails.houseNumber1,
          pinCode: parseInt(addDetails.pincode1),
          postOffice: addDetails.postOffice1,
          state: addDetails.state1,
          street: addDetails.address1,
          type: 'local',
        },
      ],
      emergencyContact: {
        name: userDatainfo?.emergencyContact?.name,
        phNumber: userDatainfo?.emergencyContact?.phNumber,
        relation: userDatainfo?.emergencyContact?.relation,
      },
      alternateMobileNumbers: ['7886868583'],
      bloodGroup: userDatainfo?.bloodGroup,
      gender:userDatainfo?.gender,
      dob: userDatainfo?.dob,
    };

     StorageProvider.getObject('accessToken')
        .then(response => {
          setIsLoading(true);
          RestApiClient(
            methods.PUT,
            JSON.stringify(body),
            endPoints.EDIT_DRIVER_PROFILE_AND_ADDRESS,
            urlReqType.DMS,
            response.accesstoken,
          )
            .then(response => {
              setIsLoading(false);
              console.log(response, '-------response---------');
              if (response?.message) {
                if (response?.message == 'Success') {
                  if(checkbox)
                  {
                    StorageProvider.saveItem('sameAddress','true')
                  }
                 navigation.navigate('KYC Documents');
                 
                } else {
                  ToastAndroid.show(response?.message, ToastAndroid.SHORT);
                }
              }
            })
            .catch(error => {
              setIsLoading(false);
              console.log('API ERROR' + error);
            });
        })
        .catch(error => {
          console.log('error', error);
          Alert.alert('Error', 'Token not found');
        });
    
  }

  const submitprofile = () =>
  {
  
    let body = {
      address: [
        {
          city: addDetails.city,
          doorNumber: addDetails.houseNumber,
          pinCode: parseInt(addDetails.pincode),
          postOffice: addDetails.postOffice,
          state: addDetails.state,
          street: addDetails.address,
          type: 'local',
        },
        {
          city: addDetails.city1,
          doorNumber: addDetails.houseNumber1,
          pinCode: parseInt(addDetails.pincode1),
          postOffice: addDetails.postOffice1,
          state: addDetails.state1,
          street: addDetails.address1,
          type: 'local',
        },
      ],
      emergencyContact: {
        name: userData?.userName,
        phNumber: userData?.userMobileNo,
        relation: userData?.relation,
      },
      alternateMobileNumbers: ['7886868583'],
      bloodGroup: userData?.userBloodGroup,
      dob: '12/07/2000',
      gender:userData?.userGender
    };

   
      StorageProvider.getObject('accessToken')
        .then(response => {
          setIsLoading(true);
          RestApiClient(
            'POST',
            JSON.stringify(body),
            'driverManagement/driver/driver/enrol',
            'DMS',
            response.accesstoken,
          )
            .then(response => {
              setIsLoading(false);
              console.log(response, '-------response---------');
              if (response?.message) {
                if (response?.message == 'Success') {
                  if(checkbox)
                  {
                    StorageProvider.saveItem('sameAddress','true')
                  }
                  btnSubmitDocuments()
                
                  navigation.navigate('KYC Documents');

                } else {
                  console.log(response, '-------response address details---------');
                  ToastAndroid.show(response?.message, ToastAndroid.SHORT);
                }
              }
            })
            .catch(error => {
              setIsLoading(false);
              console.log('API ERROR' + error);
            });
        })
        .catch(error => {
          Alert.alert('Error', 'Token not found');
        });
    
  }

  const btnSubmitDocuments = async (token) => {
    StorageProvider.getObject('accessToken')
    .then(response => {
     
    console.log('profile uplaod line number 100') 
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'multipart/form-data');
      myHeaders.append('Accept', 'application/json');
      myHeaders.append('Authorization', 'Bearer ' + response.accesstoken);

      let profilePicData = new FormData();
      profilePicData.append('file', {
        uri: route?.params?.Profilepath,
        type: 'image/jpg',
        name: 'image.jpg',
      });

      var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: profilePicData,
        redirect: 'follow',
      };

      console.log('requestOptions',requestOptions)
      let url = urls.DMS_BASE_URL + 'driverManagement/driver/updateSelfProfile';
      fetch(url, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log('profile uplaod res 1234', result);
          setIsLoading(false);
        })
        .catch(error => {
          setIsLoading(false);
          console.log('profile uplaod line number 134',error)
        });
      })
  }; 


  const onChangesData = (data, type) => {
    if (type === 'pincode') {
      let reg = /^\d+$/;
      if (data.length <= 0) {
        setIsError({...isError, pincode: t('emptyPincode')});
      } else if (!reg.test(data)) {
        setIsError({...isError, pincode: t('validPincode')});
      } else if (data.length <= 5) {
        setIsError({...isError, pincode: t('minPincode')});
      } else {
        setAddDetails({...addDetails, pincode: data});
        setIsError({...isError, pincode: ''});
      }
    }

    if (type === 'pincode1') {
      let reg = /^\d+$/;
      if (data.length <= 0) {
        setIsError({...isError, pincode1: t('emptyPincode')});
      } else if (!reg.test(data)) {
        setIsError({...isError, pincode1: t('minPincode')});
      } else if (data.length <= 5) {
        setIsError({...isError, pincode1: t('minPincode')});
      } else {
        setAddDetails({...addDetails, pincode1: data});
        setIsError({...isError, pincode1: ''});
      }
    }

    if (type === 'city') {
      let reg = /^[a-zA-Z ]+$/;
      if (data.length <= 0) {
        setIsError({...isError, city: t('emptyCity')});
      } else if (!reg.test(data)) {
        setIsError({...isError, city: t('validCity')});
      } else if (data.length < 4) {
        setIsError({...isError, city: t('minCity')});
      } else {
        setAddDetails({...addDetails, city: data});
        setIsError({...isError, city: ''});
      }
    }

    if (type === 'city1') {
      let reg = /^[a-zA-Z ]+$/;
      if (data.length <= 0) {
        setIsError({...isError, city1: t('emptyCity')});
      } else if (!reg.test(data)) {
        setIsError({...isError, city1: t('validCity')});
      } else if (data.length < 4) {
        setIsError({...isError, city1: t('minCity')});
      } else {
        setAddDetails({...addDetails, city1: data});
        setIsError({...isError, city1: ''});
      }
    }

    if (type === 'state') {
      let reg = /^[a-zA-Z ]+$/;
      if (data.length <= 0) {
        setIsError({...isError, state: t('emptyState')});
      } else if (!reg.test(data)) {
        setIsError({...isError, state: t('validState')});
      } else if (data.length < 4) {
        setIsError({...isError, state: t('minLenState')});
      } else {
        setAddDetails({...addDetails, state: data});
        setIsError({...isError, state: ''});
      }
    }

    if (type === 'state1') {
      let reg = /^[a-zA-Z ]+$/;
      if (data.length <= 0) {
        setIsError({...isError, state1: t('emptyState')});
      } else if (!reg.test(data)) {
        setIsError({...isError, state1: t('validState')});
      } else if (data.length < 4) {
        setIsError({...isError, state1: t('minLenState')});
      } else {
        setAddDetails({...addDetails, state1: data});
        setIsError({...isError, state1: ''});
      }
    }

    if (type === 'address') {
      let reg = /^[a-zA-Z0-9\s,'-]*$/;
      if (data.length <= 0) {
        setIsError({...isError, address: t('emptyAdd')});
      } else if (data.length < 4) {
        setIsError({...isError, address: t('minLenAdd')});
      } else if (!reg.test(data)) {
        setIsError({...isError, address: t('validAdd')});
      } else {
        setAddDetails({...addDetails, address: data});
        setIsError({...isError, address: ''});
      }
    }

    if (type === 'address1') {
      let reg = /^[a-zA-Z0-9\s,'-]*$/;
      if (data.length <= 0) {
        setIsError({...isError, address1: t('emptyAdd')});
      } else if (data.length < 4) {
        setIsError({...isError, address1: t('minLenAdd')});
      } else if (!reg.test(data)) {
        setIsError({...isError, address1: t('validAdd')});
      } else {
        setAddDetails({...addDetails, address: data});
        setIsError({...isError, address1: ''});
      }
    }

    if (type === 'houseNumber') {
      let reg = /[1-9]\d*(?: ?(?:[a-z]|[/-] ?\d+[a-z]?))?$/;
      if (data.length <= 0) {
        setIsError({...isError, houseNumber: t('emptyHNo')});
      } else if (!reg.test(data)) {
        setIsError({...isError, houseNumber: t('validHNo')});
      } else {
        setAddDetails({...addDetails, houseNumber: data});
        setIsError({...isError, houseNumber: ''});
      }
    }

    if (type === 'houseNumber1') {
      let reg = /[1-9]\d*(?: ?(?:[a-z]|[/-] ?\d+[a-z]?))?$/;
      if (data.length <= 0) {
        setIsError({...isError, houseNumber1: t('emptyHNo')});
      } else if (!reg.test(data)) {
        setIsError({...isError, houseNumber1: t('validHNo')});
      } else {
        setAddDetails({...addDetails, houseNumber1: data});
        setIsError({...isError, houseNumber1: ''});
      }
    }

    if (type === 'postOffice') {
      let reg = /^[a-zA-Z0-9\s]*$/;
      if (data.length <= 0) {
        setIsError({...isError, postOffice: t('emptyPO')});
      } else if (!reg.test(data)) {
        setIsError({...isError, postOffice: t('validPO')});
      } else {
        setAddDetails({...addDetails, postOffice: data});
        setIsError({...isError, postOffice: ''});
      }
    }

    if (type === 'postOffice1') {
      let reg = /^[a-zA-Z0-9\s]*$/;
      if (data.length <= 0) {
        setIsError({...isError, postOffice1: t('emptyPO')});
      } else if (!reg.test(data)) {
        setIsError({...isError, postOffice1: t('validPO')});
      } else {
        setAddDetails({...addDetails, postOffice1: data});
        setIsError({...isError, postOffice1: ''});
      }
    }
  };

  

  const btnManageCheck = () => {
    if (checkbox) {
      setCheackbox(false);
      setAddDetails({
        ...addDetails,
        city1: '',
        state1: '',
        address1: '',
        pincode1: '',
        houseNumber1: '',
        postOffice1: '',
      });
      setIsError({
        ...isError,
        pincode1: t('emptyPincode'),
        city1: t('emptyCity'),
        state1: t('emptyState'),
        address1: t('emptyAdd'),
        houseNumber1: t('emptyHNo'),
        postOffice1: t('emptyPO'),
      });
    } else {
      StorageProvider.saveItem('sameAddress','true')
      setCheackbox(true);
      setAddDetails({
        ...addDetails,
        city1: addDetails.city,
        state1: addDetails.state,
        address1: addDetails.address,
        pincode1: addDetails.pincode,
        houseNumber1: addDetails.houseNumber,
        postOffice1: addDetails.postOffice,
      });
      setIsError({
        ...isError,
        city1: '',
        state1: '',
        address1: '',
        pincode1: '',
        houseNumber1: '',
        postOffice1: '',
      });
    }
    // setCheackbox(!checkbox);
  };


  const onChangeState = (state) => {
    let selectedIndex = stateArr.findIndex((st)=>st.stateName==state)
    console.log('selectedIndex',selectedIndex)
    let stateid = stateArr[selectedIndex].id;
    getCity(stateid,'state')
    setAddDetails({...addDetails, city: '',state: state}); 
    setIsError({...isError, city:  t('emptyCity'),state: ''});
  }
  const onChangeCity = (city) => {
    setAddDetails({...addDetails, city: city});
    setIsError({...isError, city: ''});
  }

  const onChangeState1 = (state) => {
    let selectedIndex = stateArr.findIndex((st)=>st.stateName==state)
    console.log('selectedIndex',selectedIndex)
    let stateid = stateArr[selectedIndex].id;
    getCity(stateid,'state1')
    setAddDetails({...addDetails, city1: '',state1: state}); 
    setIsError({...isError, city1:  t('emptyCity'),state1: ''});
  }
  const onChangeCity1 = (city) => {
    setAddDetails({...addDetails, city1: city});
    setIsError({...isError, city1: ''});
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header  onClick={backPress}  navigation={navigation} HeaderName={t('Address Details')} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.addressContainer}>
          <Text style={styles.addressHeading}>{t('Current Address')}</Text>
          {/* ===========House Number=========== */}
          <CustomTextInputEdit
            Inputheading={t('House Number')}
            placeholderTextColor={color.white_50}
            style={styles.cutomInput}
            autoCapitalize="words"
            autoFocused={false}
            showborder={true}
            keyboardAppearance={'dark'}
            placeHolder={t('Enter house number')}
            maxLength={10}
            value={addDetails.houseNumber}
            onFocus={e => {
              onChangesData(addDetails.houseNumber, 'houseNumber');
            }}
            onChangeText={values => {
              onChangesData(values, 'houseNumber');
              setAddDetails({...addDetails, houseNumber: values});
            }}
            isError={isError.houseNumber}
          />

          {/* ===========current street address=========== */}

          <CustomTextInputEdit
            Inputheading={t('Street Address')}
            placeholderTextColor={color.white_50}
            style={styles.cutomInput}
            autoFocused={false}
            showborder={true}
            autoCapitalize="words"
            keyboardAppearance={'dark'}
            placeHolder={t('Enter Street Address')}
            maxLength={100}
            value={addDetails.address}
            onFocus={e => {
              onChangesData(addDetails.address, 'address');
            }}
            onChangeText={values => {
              onChangesData(values, 'address');
              setAddDetails({...addDetails, address: values});
            }}
            isError={isError.address}
          />

          {/* ===========current post office & state=========== */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 5,
            }}>
            <View styles={{width:'50%'}}>
              <CustomTextInputEdit
              showborder={true}
                Inputheading={t('Post office')}
                placeholderTextColor={color.white_50}
                style={styles.smallInputContainer}
                autoFocused={false}
                autoCapitalize="words"
                keyboardAppearance={'dark'}
                placeHolder={t('Post office')}
                maxLength={20}
                value={addDetails.postOffice}
                onFocus={e => {
                  onChangesData(addDetails.postOffice, 'postOffice');
                }}
                onChangeText={values => {
                  onChangesData(values, 'postOffice');
                  setAddDetails({...addDetails, postOffice: values});
                }}
                isError={isError.postOffice}
              />
            </View>
            <View styles={{width: '50%'}}>
               <View style={styles.dropDownBox}>
                <Text style={styles.inputHeading}>{t('State')} *</Text>
                <View style={{marginTop: 4}}>
                  <DropdownComponent1
                    onFocus={() => {
                      onChangesData(addDetails.state, 'state');
                    }}
                    selectedValue={(addDetails.state=='')? t('SelectState'):addDetails.state}
                    onChange={values => {
                      onChangeState(values) 
                    }}
                    dropdownList={stateArr}
                    title={t('SelectState')}
                  />
                </View>
                {isError.state && (
                  <Text style={{color: 'red', fontFamily: ITALIC}}>
                    {isError.state}
                  </Text>
                )}
              </View> 
            </View>
          </View>

          {/* ===========city state pincode=========== */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 5,
            }}>
             <View styles={{ width: '50%'}}>
             <View style={styles.dropDownBox}>
                <Text style={styles.inputHeading}>{t('City')} *</Text>
                <View style={{marginTop: 4}}>
                  <DropdownComponent1
                    onFocus={() => {
                      onChangesData(addDetails.city, 'city');
                    }}
                    // disabale={(addDetails.state=='')? true:false}
                    disabale={
                      (addDetails.state=='')? true : false
                    }
                    selectedValue={(addDetails.city=='')?t('SelectCity'):addDetails.city}
                    onChange={values => {
                      onChangeCity(values)
                    }}
                    dropdownList={cityArr}
                    title={t('SelectCity')}
                  />
                </View>
                {isError.city && (
                  <Text style={{color: 'red', fontFamily: ITALIC}}>
                    {isError.city}
                  </Text>
                )}
              </View>
            </View> 

            <View styles={{width: '50%'}}>
              <CustomTextInputEdit
                Inputheading={t('Pincode')}
                placeholderTextColor={color.white_50}
                style={styles.smallInputContainer}
                autoFocused={false}
                autoCapitalize="words"
                showborder={true}
                keyboardType="number-pad"
                keyboardAppearance={'dark'}
                placeHolder={t('Pincode')}
                maxLength={6}
                value={addDetails.pincode}
                onFocus={e => {
                  onChangesData(addDetails.pincode, 'pincode');
                }}
                onChangeText={values => {
                  const cleanedText = values.replace(/[^0-9]/g, '');
                 
                  onChangesData(values, 'pincode');
                  setAddDetails({...addDetails, pincode: cleanedText});

                 // setAddDetails({...addDetails, pincode: values});
                }}
                isError={isError.pincode}
              />
            </View>
          </View>
        </View>

        {/*Permanent address  */}
        <View style={styles.addressContainer}>
          <Text style={styles.addressHeading}>{t('Permanent Address')}</Text>

          <View style={styles.checkboxContainer}>
            {checkbox ? (
              <TouchableOpacity
                onPress={() => {
                  btnManageCheck();
                }}>
                <Icons name="checkbox" size={24} color={color.purpleborder} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  btnManageCheck();
                }}>
                <Icons
                  name="square-outline"
                  size={24}
                  color={color.purpleborder}
                />
              </TouchableOpacity>
            )}

            <Text style={styles.label}>
              {' '}
              {t('Same as the Current Address')}
            </Text>
          </View>
          {/* ===========house Number1=========== */}
          <CustomTextInputEdit
            Inputheading={t('House Number')}
            placeholderTextColor={color.white_50}
            style={styles.cutomInput}
            autoFocused={false}
            isEditable={!checkbox}
            showborder={true}
            autoCapitalize="words"
            keyboardAppearance={'dark'}
            placeHolder={t('Enter house number')}
            maxLength={10}
            value={addDetails.houseNumber1}
            onFocus={e => {
              onChangesData(addDetails.houseNumber1, 'houseNumber1');
            }}
            onChangeText={values => {
              onChangesData(values, 'houseNumber1');
              setAddDetails({...addDetails, houseNumber1: values});
            }}
            isError={isError.houseNumber1}
          />

          {/* ===========current street address=========== */}

          <CustomTextInputEdit
            Inputheading={t('Street Address')}
            placeholderTextColor={color.white_50}
            style={styles.cutomInput}
            autoCapitalize="words"
            autoFocused={false}
            showborder={true}
            keyboardAppearance={'dark'}
            isEditable={!checkbox}
            placeHolder={t('Enter Street Address')}
            maxLength={100}
            value={addDetails.address1}
            onFocus={e => {
              onChangesData(addDetails.address1, 'address1');
            }}
            onChangeText={values => {
              onChangesData(values, 'address1');
              setAddDetails({...addDetails, address1: values});
            }}
            isError={isError.address1}
          />

          {/* ===========current post office & city=========== */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 5,
            }}>
            <View styles={{width: responsive_factor * 175}}>
              <CustomTextInputEdit
                Inputheading={t('Post office')}
                placeholderTextColor={color.white_50}
                style={styles.smallInputContainer}
                autoCapitalize="words"
                keyboardAppearance={'dark'}
                showborder={true}
                isEditable={!checkbox}
                autoFocused={false}
                placeHolder={t('Post office')}
                maxLength={20}
                value={addDetails.postOffice1}
                onFocus={e => {
                  onChangesData(addDetails.postOffice1, 'postOffice1');
                }}
                onChangeText={values => {
                  onChangesData(values, 'postOffice1');
                  setAddDetails({...addDetails, postOffice1: values});
                }}
                isError={isError.postOffice1}
              />
            </View>
            <View style={styles.dropDownBox}>
                <Text style={styles.inputHeading}>{t('State')} *</Text>
                <View style={{marginTop: 4}}>
                  <DropdownComponent1
                    onFocus={values => {
                      onChangesData(addDetails.state1, 'state1');
                    }}
                    disabale={checkbox}
                    selectedValue={(addDetails.state1=='')?t('SelectState'):addDetails.state1}
                    onChange={values => {
                      onChangeState1(values)
                      // onChangesData(values, 'state1');
                      // setAddDetails({...addDetails, state1: values});
                    }}
                    dropdownList={stateArr}
                    title={t('SelectState')}
                  />
                </View>
                {isError.state1 && (
                  <Text style={{color: 'red', fontFamily: ITALIC}}>
                    {isError.state1}
                  </Text>
                )}
              </View> 
          </View>

          {/* ===========current state pincode=========== */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 5,
            }}>
            <View styles={{width: responsive_factor * 178}}>
             <View style={styles.dropDownBox}>
                <Text style={styles.inputHeading}>{t('City')} *</Text>
                <View style={{marginTop: 4}}>
                  <DropdownComponent1
                    // disabale={checkbox}
                    onFocus={values => {
                      onChangesData(addDetails.city1, 'city1');
                    }}
                    disabale={
                      (addDetails.state1=='')? true : false
                    }
                    selectedValue={(addDetails.city1=='')?t('SelectCity'):addDetails.city1}
                    onChange={values => {
                      onChangeCity1(values)
                    }}

                    dropdownList={cityArr1}
                    title={t('SelectCity')}
                  />
                </View>
                {isError.city1 && (
                  <Text style={{color: 'red', fontFamily: ITALIC}}>
                    {isError.city1}
                  </Text>
                )}
              </View>
            </View> 

            <View styles={{width: responsive_factor * 175}}>
              <CustomTextInputEdit
                Inputheading={t('Pincode')}
                placeholderTextColor={color.white_50}
                style={styles.smallInputContainer}
                autoCapitalize="words"
                keyboardType="number-pad"
                keyboardAppearance={'dark'}
                autoFocused={false}
                placeHolder={t('Pincode')}
                maxLength={6}
                showborder={true}
                isEditable={!checkbox}
                value={addDetails.pincode1}
                onFocus={e => {
                  onChangesData(addDetails.pincode1, 'pincode1');
                }}
                onChangeText={values => {
                 
                  const cleanedText = values.replace(/[^0-9]/g, '');
                  onChangesData(values, 'pincode1');
                  setAddDetails({...addDetails, pincode1: cleanedText});

                }}
                isError={isError.pincode1}
              />
            </View>
          </View>
        </View>

        <View style={styles.btnContainer}>
          <CustomPressable
            text={`${t('SAVE & CONTINUE')} (3/4)`}
            props={value}
            btnWidth={Dimensions.get('screen').width / 1.2}
            route={'Verify'}
            isLoading={isLoading}
            onPress={() => {
              saveAndContinue();
            }}
            ErrorMessage={errorMessage}
            position={'relative'}
            bottom={0}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  label: {
    color: color.white,
    fontSize: 15,
    fontWeight: 'bold', 
    marginBottom: 5,
  },
  container: {
    backgroundColor: color.black_BG,
    flex: 1, 
  },
  scrollView: {
    paddingHorizontal: 30, 
  },
  addressContainer: {
    marginBottom: 20,
    marginTop: 20,
  },
  addressHeading: {
    color: color.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily: BOLD,
  },
  inputContainer: {
    // marginVertical:5
    marginTop: 15,
  },
  inputHeading: {
    color: color.white,
    fontSize: 14,
    fontFamily: BOLD,
    
    // paddingHorizontal: 10,
  },
  inputCity: {
    width: responsive_factor * 175,
    backgroundColor: color.Black_light,
    borderRadius: 10,
    borderColor: color.Border_color,
    height: responsive_factor * 54,
    borderWidth: 2,
    paddingHorizontal: 10,
    fontSize: 20,
    fontFamily: REGULAR,
    color: color.white,
  },
  smallInputContainer: {
    width: responsive_factor * 135,
    backgroundColor: color.Black_light,
    borderRadius: 10,
    height:46,
    fontSize: 16,
    fontFamily: REGULAR,
    color: color.white,
  },
  dropDownBox: {
    width: mobW/2 - 40,
    borderRadius: 10,
    height: responsive_factor * 60,
    fontSize: 20,
    fontFamily: REGULAR,
    color: color.white,
    marginTop: 15,
  },
  input: {
    backgroundColor: color.Black_light,
    borderRadius: 10,
    fontSize: 20,
    fontFamily: REGULAR,
    color: color.white,
    borderColor: color.Border_color,
    borderWidth: 2,
    paddingHorizontal: 10,
    height: responsive_factor * 54,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  cutomInput: {
    color: '#fff',
    fontSize: 16,
    fontFamily: REGULAR,
    borderRadius: 20,
    height: mobW * 0.14,
    width: '99%',
  },
  btnContainer: {
    marginTop: 10,
    paddingBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
