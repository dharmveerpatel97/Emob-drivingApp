import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
  Alert,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {responsive_factor} from '../../constant/auth';
import {color, fontstyles} from '../../utils/color';
import Icons from 'react-native-vector-icons/dist/Ionicons';
import Header from '../customComp/Header';
import {BOLD, ITALIC, REGULAR} from '../../utils/fonts';
import RestApiClient from '../../network/RestApiClient';
import StorageProvider from '../../Session/StorageProvider';
import CustomPressable from '../customComp/CustomPressable';
import {endPoints, methods, urlReqType} from '../../utils/config';
import {useTranslation} from 'react-i18next';
import CustomTextInputEdit from '../component/CustomTextInputEdit';
import { useDispatch } from 'react-redux';
import { getCityByState, getState } from '../../Redux/appSlice';
import DropdownComponentEdit from '../customComp/customDropDownEdit';
const mobW = Dimensions.get('screen').width;

export default function EditDriverAddress({navigation, route}) {
  const userDetails = route?.params?.userDetails;
  const {t} = useTranslation();
  const [checkbox, setCheackbox] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [isEditable, setIsEditable] = useState(false);
  const [stateArr, setStateArr] = useState([]);
  const [cityArr, setCityArr] = useState([]);
  const [cityArr1, setCityArr1] = useState([]);
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
  useEffect(() => {
    StorageProvider.getItem('sameAddress').then(res => {
      setCheackbox(true)
    }); 
    console.log('userDetails---', userDetails);
    if (userDetails) {
      if (userDetails?.address[1]) {
        setAddDetails({
          ...addDetails,
          pincode: userDetails?.address[0].pinCode.toString(),
          city: userDetails?.address[0].city,
          state: userDetails?.address[0].state,
          address: userDetails?.address[0].street,
          houseNumber: userDetails?.address[0].doorNumber,
          postOffice: userDetails?.address[0].postOffice,

          pincode1: userDetails?.address[1].pinCode.toString(),
          city1: userDetails?.address[1].city,
          state1: userDetails?.address[1].state,
          address1: userDetails?.address[1].street,
          houseNumber1: userDetails?.address[1].doorNumber,
          postOffice1: userDetails?.address[1].postOffice,
        });
      } else {
        setAddDetails({
          ...addDetails,
          pincode: userDetails?.address[0].pinCode.toString(),
          city: userDetails?.address[0].city,
          state: userDetails?.address[0].state,
          address: userDetails?.address[0].street,
          houseNumber: userDetails?.address[0].doorNumber,
          postOffice: userDetails?.address[0].postOffice,
        });
      }
      if(JSON.stringify(userDetails?.address[0]) === JSON.stringify(userDetails?.address[1])){
        setCheackbox(true)
      } 
    }
  }, [userDetails]);

  useState(()=>{
    dispatch(getState()).then((res)=>{
      if(res?.payload?.states){
        let states = res.payload.states.map((state)=>{
          return {id:state.id, stateName:state?.stateName, enabled:state.enabled,name:state.stateName}
        }) 
        if(userDetails?.address[1]?.state){
          let state1Id = states.findIndex((item,index)=>item.stateName.toLocaleLowerCase()==userDetails?.address[1]?.state.toLocaleLowerCase())
          console.log('userDetails?.address[1]?.state',userDetails?.address[1]?.state.toLocaleLowerCase())
          console.log('userDetails?.address[1]?.state state1Id',state1Id)
          getCity(states[state1Id].id,'state1')
        }
        if(userDetails?.address[0]?.state){
          let stateId = states.findIndex((item,index)=>item.stateName.toLocaleLowerCase()==userDetails?.address[0]?.state.toLocaleLowerCase())
          console.log('userDetails?.address[0]?.state',userDetails?.address[0]?.state.toLocaleLowerCase())
          console.log('userDetails?.address[0]?.state state1Id',stateId)
          getCity(states[stateId].id,'state')
        }
        setStateArr(states)
      }
      console.log('state list success',res)
    }).catch((error)=>{
      console.log('state list error',error)
    })
  },[])

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
      console.log('city list success',res)
    }).catch((error)=>{
      console.log('city list error',error)
    })
  }

  const saveAndContinue = () => {
  
    let vailidation_flag = true;
    if (!addDetails?.pincode) {
      vailidation_flag = false;
      setIsError(prev => {
        return {...prev, pincode: t('emptyPincode')};
      });
    }

    if (!addDetails?.city) {
      vailidation_flag = false;
      setIsError(prev => {
        return {...prev, city: t('emptyCity')};
      });
    }

    if (!addDetails?.state) {
      vailidation_flag = false;
      setIsError(prev => {
        return {...prev, state: t('emptyState')};
      });
    }

    if (!addDetails?.address) {
      vailidation_flag = false;
      setIsError(prev => {
        return {...prev, address: t('emptyAdd')};
      });
    }

    if (!addDetails?.pincode1) {
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

    if (!addDetails?.address1) {
      vailidation_flag = false;
      setIsError(prev => {
        return {...prev, address1: t('emptyAdd')};
      });
    }

    if (!addDetails?.houseNumber) {
      vailidation_flag = false;
      setIsError(prev => {
        return {...prev, houseNumber: t('emptyHNo')};
      });
    }

    if (!addDetails?.houseNumber1) {
      vailidation_flag = false;
      setIsError(prev => {
        return {...prev, houseNumber1: t('emptyHNo')};
      });
    }

    if (!addDetails?.postOffice) {
      vailidation_flag = false;
      setIsError(prev => {
        return {...prev, postOffice: t('emptyPO')};
      });
    }

    if (!addDetails?.postOffice1) {
      vailidation_flag = false;
      setIsError(prev => {
        return {...prev, postOffice1: t('emptyPO')};
      });
    }

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
        name: userDetails?.emergencyContact?.name,
        phNumber: userDetails?.emergencyContact?.phNumber,
        relation: userDetails?.emergencyContact?.relation,
      },
      alternateMobileNumbers: ['7886868583'],
      bloodGroup: userDetails?.bloodGroup,
      gender:userDetails?.gender,
      dob: userDetails?.dob,
    };

    if (vailidation_flag) {
    
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
                  navigation.goBack();
                  ToastAndroid.show(t('uploadSucc'), ToastAndroid.SHORT);
                  setIsEditable(false);
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
          Alert.alert(t('error'), t('tokenNotFound'));
        });
    }
  };

  const onChangesData = (data, type) => {
    console.log("meghhhhhh",data)
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
      if (data?.length <= 0) {
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
      if (data?.length <= 0) {
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

  let textInputRef = useRef('');
  const btnEditable = () => {
    setIsEditable(true);
    setTimeout(()=>{
      textInputRef.current.focus()
    },0)
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
      <View style={{height:10}}></View>
      <Header
        navigation={navigation}
        
        HeaderName={t('Address Details')}
        rightIcon={!isEditable}
        rightClick={btnEditable}
      />
      <ScrollView style={styles.scrollView}>
        <View style={styles.addressContainer}>
          <Text style={styles.addressHeading}>{t('Current Address')}</Text>

          {/* ===========House Number=========== */}
          <CustomTextInputEdit
            Inputheading={t('House Number')}
            ref={textInputRef}
            placeholderTextColor={'#D3D3D3'}
            style={styles.cutomInput}
            autoCapitalize="words"
            keyboardAppearance={'dark'}
            isEditable={isEditable}
            placeHolder={t('Enter house number')}
            maxLength={10}
            showborder={isEditable}
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
            placeholderTextColor={'#D3D3D3'}
            style={styles.cutomInput}
            autoCapitalize="words"
            keyboardAppearance={'dark'}
            placeHolder={t('Enter Street Address')}
            maxLength={100}
            autoFocus={true}
            showborder={isEditable}
            isEditable={isEditable}
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

          {/* ===========current post office & city=========== */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 5,
            }}>
             <View styles={{width:'50%'}}>
              <CustomTextInputEdit
                Inputheading={t('Post office')}
                placeholderTextColor={'#D3D3D3'}
                style={styles.smallInputContainer}
                autoCapitalize="words"
                keyboardAppearance={'dark'}
                placeHolder={t('Post office')}
                isEditable={isEditable}
                maxLength={20}
                showborder={isEditable}
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

            <View styles={{width:'50%'}}>
               <View style={styles.dropDownBox}>
                <Text style={styles.inputHeading}>{t('State')}*</Text>
                <View style={{marginTop: 4}}>
                  <DropdownComponentEdit
                  showborder={isEditable}
                   disabale={!isEditable}
                    onFocus={() => {
                      onChangesData(addDetails.state, 'state');
                    }}
                    selectedValue={(addDetails.state=='')?t('SelectState'):addDetails.state}
                    onChange={values => {
                      onChangeState(values) 
                    }}
                    dropdownList={stateArr}
                    title={t('SelectState')}
                  />
                </View>
                {isError.state && (
                  <Text style={{color: 'red', fontFamily: 'Roboto-Medium',paddingHorizontal: 5}}>
                    {isError.state}
                  </Text>
                )}
              </View> 
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
                <Text style={styles.inputHeading}>{t('City')}*</Text>
                <View style={{marginTop: 4}}>
                  <DropdownComponentEdit
                   showborder={isEditable}
                   disabale={!isEditable}
                    onFocus={() => {
                      onChangesData(addDetails.city, 'city');
                    }}
                    selectedValue={(addDetails.city=='')?t('SelectCity'):addDetails.city}
                    onChange={values => {
                      onChangeCity(values)
                    }}
                    dropdownList={cityArr}
                    title={t('SelectCity')}
                  />
                </View>
                {isError.city && (
                  <Text style={{color: 'red', fontFamily: 'Roboto-Medium',paddingHorizontal: 5}}>
                    {isError.city}
                  </Text>
                )}
              </View>
            </View> 

            <View styles={{width:'50%'}}>
              <CustomTextInputEdit
                Inputheading={t('Pincode')}
                placeholderTextColor={'#D3D3D3'}
                style={styles.smallInputContainer}
                autoCapitalize="words"
                keyboardAppearance={'dark'}
                placeHolder={t('Pincode')}
                maxLength={6}
                showborder={isEditable}
                isEditable={isEditable}
                value={addDetails.pincode}
                onFocus={e => {
                  onChangesData(addDetails.pincode, 'pincode');
                }}
                onChangeText={values => {
                  onChangesData(values, 'pincode');
                  setAddDetails({...addDetails, pincode: values});
                }}
                isError={isError.pincode}
              />
            </View>
          </View>
        </View>

        {/*============Permanent address==========*/}
        <View style={styles.addressContainer}>
          <Text style={[styles.addressHeading,{marginTop:-5}]}>{t('Permanent Address')}</Text>
{isEditable ? 
          <View style={styles.checkboxContainer}>
            {checkbox ? (
              <TouchableOpacity
                disabled={!isEditable}
                onPress={() => {
                  btnManageCheck();
                  // btnManageCheck()
                  // dispatch({type: 'notsameascurrentaddress'});
                  // console.log(addressDetails);
                  // setCheackbox(!checkbox);
                }}>
                <Icons name="checkbox" size={24} color={color.purpleborder} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                disabled={!isEditable}
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
              {t('Same as current address')}
            </Text>
          </View>
          : null }

          {/*=============house Number1=========== */}
          <CustomTextInputEdit
            Inputheading={t('House Number')}
            placeholderTextColor={'#D3D3D3'}
            style={styles.cutomInput}
            autoCapitalize="words"
            keyboardAppearance={'dark'}
            placeHolder={t('Enter house number')}
            maxLength={10}
            showborder={isEditable}
            isEditable={isEditable}
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
            placeholderTextColor={'#D3D3D3'}
            style={styles.cutomInput}
            autoCapitalize="words"
            isEditable={isEditable}
            keyboardAppearance={'dark'}
            placeHolder={t('Enter Street Address')}
            maxLength={100}
            showborder={isEditable}
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
            <View styles={{width:'50%'}}>
              <CustomTextInputEdit
                Inputheading={t('Post office')}
                placeholderTextColor={'#D3D3D3'}
                style={styles.smallInputContainer}
                autoCapitalize="words"
                keyboardAppearance={'dark'}
                placeHolder={t('Post office')}
                isEditable={isEditable}
                maxLength={20}
                showborder={isEditable}
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
                <Text style={styles.inputHeading}>{t('State')}*</Text>
                <View style={{marginTop: 4}}>
                  <DropdownComponentEdit
                   showborder={isEditable}
                    onFocus={values => {
                      onChangesData(addDetails.state1, 'state1');
                    }}
                    disabale={!isEditable}
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
                  <Text style={{color: 'red', fontFamily: 'Roboto-Medium',paddingHorizontal: 5}}>
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
                <View styles={{width:'50%'}}>
             <View style={styles.dropDownBox}>
                <Text style={styles.inputHeading}>{t('City')}*</Text>
                <View style={{marginTop: 4}}>
                  <DropdownComponentEdit
                   showborder={isEditable}
                    disabale={!isEditable}
                    onFocus={values => {
                      onChangesData(addDetails.city1, 'city1');
                    }}
                    selectedValue={(addDetails.city1=='')?t('SelectCity'):addDetails.city1}
                    onChange={values => {
                      // onChangesData(values, 'city1');
                      // setAddDetails({...addDetails, city1: values});
                      onChangeCity1(values)
                    }}

                    dropdownList={cityArr1}
                    title={t('SelectCity')}
                  />
                </View>
                {isError.city1 && (
                  <Text style={{color: 'red', fontFamily: 'Roboto-Medium',paddingHorizontal: 5}}>
                    {isError.city1}
                  </Text>
                )}
              </View>
            </View> 

            <View styles={{width: responsive_factor * 175}}>
              <CustomTextInputEdit
                Inputheading={t('Pincode')}
                placeholderTextColor={'#D3D3D3'}
                style={styles.smallInputContainer}
                autoCapitalize="words"
                keyboardAppearance={'dark'}
                placeHolder={t('Pincode')}
                maxLength={6}
                
                value={addDetails.pincode1}
                isEditable={isEditable}
                showborder={isEditable}
                onFocus={e => {
                  onChangesData(addDetails.pincode1, 'pincode1');
                }}
                onChangeText={values => {
                  onChangesData(values, 'pincode1');
                  setAddDetails({...addDetails, pincode1: values});
                }}
                isError={isError.pincode1}
              />
            </View>
          </View>
        </View>
        {isEditable && (
          <View style={styles.btnContainer}>
            <CustomPressable
              text={`${t('SAVE & CONTINUE')} (3/4)`}
              // props={value}
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
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  label: {
    color: color.white,
    fontSize: 14,
    fontFamily:REGULAR,
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
  dropDownBox: {
    width: mobW/2 - 40,
    borderRadius: 10,
    height: 50,
    fontSize: 20,
    fontFamily: REGULAR,
    color: color.white,
    marginTop: 15,
  },
  addressHeading: {
    color: color.white,
    fontSize: 18,
    fontFamily:'Roboto-Medium'
  },
  inputContainer: {
    marginTop: 15,
  },
  inputHeading: {
   color: color.white,
    fontSize: 14,paddingHorizontal: 5,
    fontFamily: BOLD,

  },
  inputCity: {
    width: responsive_factor * 175,
    backgroundColor: color.Black_light,
    borderRadius: 10,
    borderColor: color.Border_color,
    height: 50,
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
    height: 46,
    fontSize: 16,
    fontFamily: REGULAR,
    color: color.white,
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
    height: 50,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginTop: 15,
  },
  cutomInput: {
    color: '#fff',
    fontSize: 16,
    fontFamily: REGULAR,
    fontWeight: 'normal',
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
