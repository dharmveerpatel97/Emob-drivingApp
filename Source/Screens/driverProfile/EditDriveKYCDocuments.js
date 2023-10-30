import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  Platform,
  Alert,
  ToastAndroid,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import {responsive_factor} from '../../constant/auth';
import CustomPressable from '../customComp/CustomPressable';
import DatePickerComponent from '../component/DatePickerComponent';

import {color, fontstyles} from '../../utils/color';
import Header from '../customComp/Header';
import ImagePicker from 'react-native-image-crop-picker';
import {BOLD, REGULAR} from '../../utils/fonts';
import {endPoints, urls} from '../../utils/config';

import moment from 'moment';
import {getDateFormat} from '../../utils/commonFunction';
import {t} from 'i18next';

import CustomTextInputEdit from '../component/CustomTextInputEdit';

const mobW = Dimensions.get('screen').width;
export default function EditDriveKYCDocuments({navigation, route}) {
  const userDetails = route?.params?.userDetails;

  const [isLoading, setIsLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  const [pickerType, setPickerType] = useState('');
  const [documentPickerFlag, setDocumentPickerFlag] = useState(false);

  const [dlIssueDatePickerFlag, setDLIssueDatePickerFlag] = useState(false);
  const [dlExpiryDatePickerFlag, setDLExpiryDatePickerFlag] = useState(false);

  const [pvd_min_date, setPVDMinDate] = useState(new Date());
  const [dl_min_date, setDLMinDate] = useState(new Date());

  const [pvdIssueDatePickerFlag, setPVDIssueDatePickerFlag] = useState(false);
  const [pvdExpiryDatePickerFlag, setPVDExpiryDatePickerFlag] = useState(false);

  const [kycData, setKYCData] = useState({
    aadharNo: '',
    drivingLicenseNo: '',
    licenceIssueDate: 'DD-MM-YYYY',
    licenceExpiryDate: 'DD-MM-YYYY',
    licenceImage: '',
    policeVerificationIssueDate: 'DD-MM-YYYY',
    policeVerificationExpiryDate: 'DD-MM-YYYY',
    policeVerificationImage: '',
  });

  const [isError, setIsError] = useState({
    aadharNo: '',
    drivingLicenseNo: '',
    licenceIssueDate: '',
    licenceExpiryDate: '',
    policeVerificationIssueDate: '',
    policeVerificationExpiryDate: '',
    policeVerificationImage: '',
    licenceImage: '',
  });

  useEffect(() => {
    console.log('====================================');
    console.log('userDetails-----', userDetails);
    console.log('====================================');
    if (userDetails) {
      if (userDetails?.drivingLicence) {
        console.log('moment(new Date()).format("DD/MM/YYYY")');
        let data = {
          path: userDetails?.drivingLicence?.url,
        };
        setKYCData(prev => {
          return {
            ...prev,
            drivingLicenseNo: userDetails?.drivingLicence?.number,
            licenceIssueDate: userDetails?.drivingLicence?.issuedOn,
            licenceExpiryDate: moment(
              userDetails?.drivingLicence?.expiry,
            ).format('DD-MM-YYYY'),
            licenceImage: data,
          };
        });
      }
      if (userDetails?.policeVerification) {
        let data = {
          path: userDetails?.policeVerification?.url,
        };
        setKYCData(prev => {
          return {
            ...prev,
            policeVerificationIssueDate:
              userDetails?.policeVerification?.issuedOn,
            policeVerificationExpiryDate: moment(
              userDetails?.policeVerification?.expiry,
            ).format('DD-MM-YYYY'),
            policeVerificationImage: data,
          };
        });
      }
    }
  }, [userDetails]);

  const PickImageFromGallery = () => {
    try {
      ImagePicker.openPicker({
        cropping: true,
      }).then(image => {
        console.log(image, 'image');
        setDocImageUrl(image);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const OpenCamera = () => {
    ImagePicker.openCamera({
      cropping: true,
    }).then(image => {
      console.log(image);
      setDocImageUrl(image);
    });
  };

  const setDocImageUrl = imageUrl => {
    if (pickerType === 'licenceImage') {
      setDocumentPickerFlag(false);
      onChangesData(imageUrl, 'licenceImage');
    }
    if (pickerType === 'policeVerificationImage') {
      onChangesData(imageUrl, 'policeVerificationImage');
      setDocumentPickerFlag(false);
    }
  };

  const PickerModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={documentPickerFlag}
        onRequestClose={() => {
          setDocumentPickerFlag(!documentPickerFlag);
        }}>
        <TouchableOpacity
          onPress={() => setDocumentPickerFlag(!documentPickerFlag)}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.8)',
          }}>
          <View style={{position: 'absolute', bottom: 20}}>
            <Pressable
              onPress={() => OpenCamera()}
              style={{
                opacity: 1,
                backgroundColor: color.Blue_light,
                marginHorizontal: 20,
                borderRadius: 14,
                width: Dimensions.get('screen').width / 1.1,
                // margin: 20,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  padding: 14,
                  fontSize: 20,
                  color: color.white,
                }}>
                {t('Camera')}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => PickImageFromGallery()}
              style={{
                opacity: 1,
                backgroundColor: color.Blue_light,
                marginHorizontal: 20,
                borderRadius: 14,
                width: Dimensions.get('screen').width / 1.1,
                margin: 20,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  padding: 14,
                  color: color.white,
                  fontSize: 20,
                }}>
                {t('Gallery')}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setDocumentPickerFlag(!documentPickerFlag)}
              style={{
                opacity: 1,
                backgroundColor: color.purpleborder,
                marginHorizontal: 20,
                borderRadius: 14,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: color.white,
                  padding: 14,
                  fontSize: 20,
                }}>
                {t('Cancel')}
              </Text>
            </Pressable>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  const onChangesData = (data, type) => {
    // if (type === 'aadharNo') {
    //   let reg = /^\d+$/;
    //   if (data.length <= 0) {
    //     setIsError({...isError, aadharNo: '**Aadhar number is required'});
    //   } else if (!reg.test(data)) {
    //     setIsError({...isError, aadharNo: '**Enter valid aadhar number'});
    //   } else if (data.length <= 15) {
    //     setIsError({
    //       ...isError,
    //       aadharNo: '**Aadhar length should be at least 16 characters',
    //     });
    //   } else {
    //     setKYCData({...kycData, aadharNo: data});
    //     setIsError({...isError, aadharNo: ''});
    //   }
    // }
    if (type === 'drivingLicenseNo') {
      if (data.length <= 0) {
        setIsError({
          ...isError,
          drivingLicenseNo: t('emptyDL'),
        });
      } else if (data.length < 9 || data.length > 20) {
        setIsError({
          ...isError,
          drivingLicenseNo: t('lengthDL'),
        });
      } else {
        setKYCData({...kycData, drivingLicenseNo: data});
        setIsError({...isError, drivingLicenseNo: ''});
      }
    }
    if (type === 'licenceIssueDate') {
      if (data == 'DD-MM-YYYY') {
        setIsError({...isError, licenceIssueDate: t('emptyIssueDate')});
      } else {
        setKYCData({...kycData, licenceIssueDate: data});
        setIsError({...isError, licenceIssueDate: ''});
      }
    }
    if (type === 'licenceExpiryDate') {
      if (data == 'DD-MM-YYYY') {
        setIsError({
          ...isError,
          licenceExpiryDate: t('emptyExpiryDate'),
        });
      } else {
        setKYCData({...kycData, licenceExpiryDate: data});
        setIsError({...isError, licenceExpiryDate: ''});
      }
    }
    if (type === 'policeVerificationIssueDate') {
      if (data == 'DD-MM-YYYY') {
        setIsError({
          ...isError,
          policeVerificationIssueDate: t('emptyIssueDate'),
        });
      } else {
        setKYCData({...kycData, policeVerificationIssueDate: data});
        setIsError({...isError, policeVerificationIssueDate: ''});
      }
    }
    if (type === 'policeVerificationExpiryDate') {
      if (data == 'DD-MM-YYYY') {
        setIsError({
          ...isError,
          policeVerificationExpiryDate: t('emptyExpiryDate'),
        });
      } else {
        setKYCData({...kycData, policeVerificationExpiryDate: data});
        setIsError({...isError, policeVerificationExpiryDate: ''});
      }
    }
    if (type === 'licenceImage') {
      if (!data) {
        setIsError({...isError, licenceImage: t('emptyImage')});
      } else {
        setKYCData({...kycData, licenceImage: data});
        setIsError({...isError, licenceImage: ''});
      }
    }
    if (type === 'policeVerificationImage') {
      if (data.length <= 0) {
        setIsError({
          ...isError,
          policeVerificationImage: t('emptyImage'),
        });
      } else {
        setKYCData({...kycData, policeVerificationImage: data});
        setIsError({...isError, policeVerificationImage: ''});
      }
    }
  };

  const onPVDIssueDateConfirm = date => {
    console.log('onPVDIssueDateConfirm', date);
    let date12 = getDateFormat(date, 'DD-MM-YYYY');
    let date11 = getDateFormat(date, 'YYYY-MM-DD');
    setPVDMinDate(date11);
    setPVDIssueDatePickerFlag(false);
    onChangesData(date12, 'policeVerificationIssueDate');
  };

  const onPVDExpiryDateConfirm = date => {
    console.log('onPVDExpiryDateConfirm', date);
    let date12 = getDateFormat(date, 'DD-MM-YYYY');
    setPVDExpiryDatePickerFlag(false);
    onChangesData(date12, 'policeVerificationExpiryDate');
  };

  const onDLIssueDateConfirm = date => {
    console.log('onPVDIssueDateConfirm', date);
    let date12 = getDateFormat(date, 'DD-MM-YYYY');
    let date11 = getDateFormat(date, 'YYYY-MM-DD');

    setDLIssueDatePickerFlag(false);
    setDLMinDate(date11);
    onChangesData(date12, 'licenceIssueDate');
  };

  const onDLExpiryDateConfirm = date => {
    console.log('onPVDExpiryDateConfirm', date);
    let date12 = getDateFormat(date, 'DD-MM-YYYY');
    setDLExpiryDatePickerFlag(false);
    onChangesData(date12, 'licenceExpiryDate');
  };

  const getImageNameFromUrl = url => {
    const parts = url.split('/');
    const imageName = parts[parts.length - 1];
    const imageName1 = imageName.split('?');
    return imageName1[0];
  };

  const btnSubmitAllDocuments = async () => {
    let vailidation_flag = true;
    // if (!kycData?.aadharNo) {
    //   vailidation_flag = false;
    //   setIsError(prev => {
    //     return {...prev, aadharNo: '**Aadhar is required'};
    //   });
    // }
    if (!kycData?.drivingLicenseNo) {
      vailidation_flag = false;
      setIsError(prev => {
        return {
          ...prev,
          drivingLicenseNo: t('emptyDL'),
        };
      });
    }
    if (kycData?.licenceIssueDate === 'DD-MM-YYYY') {
      vailidation_flag = false;
      setIsError(prev => {
        return {...prev, licenceIssueDate: t('emptyIssueDate')};
      });
    }
    if (kycData?.licenceExpiryDate === 'DD-MM-YYYY') {
      vailidation_flag = false;
      setIsError(prev => {
        return {...prev, licenceExpiryDate: t('emptyExpiryDate')};
      });
    }
    if (!kycData?.licenceImage) {
      vailidation_flag = false;
      setIsError(prev => {
        return {...prev, licenceImage: t('emptyImage')};
      });
    }
    if (kycData?.policeVerificationIssueDate === 'DD-MM-YYYY') {
      vailidation_flag = false;
      setIsError(prev => {
        return {
          ...prev,
          policeVerificationIssueDate: t('emptyIssueDate'),
        };
      });
    }
    if (kycData?.policeVerificationExpiryDate === 'DD-MM-YYYY') {
      vailidation_flag = false;
      setIsError(prev => {
        return {
          ...prev,
          policeVerificationExpiryDate: t('emptyExpiryDate'),
        };
      });
    }
    if (!kycData?.policeVerificationImage) {
      vailidation_flag = false;
      setIsError(prev => {
        return {...prev, policeVerificationImage: t('emptyImage')};
      });
    }

    if (vailidation_flag) {
      setIsLoading(true);
      let accessToken = '';
      await StorageProvider.getObject('accessToken').then(responce => {
        accessToken = responce.accesstoken;
        console.log('res', responce.accesstoken);
      });

      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'multipart/form-data');
      myHeaders.append('Accept', 'application/json');
      myHeaders.append('Authorization', 'Bearer ' + accessToken);

      let pvdformdata = new FormData();
      pvdformdata.append('type', 'pvd');
      pvdformdata.append('number', '');
      pvdformdata.append('issuedOn', kycData.policeVerificationIssueDate);
      pvdformdata.append('expiry', kycData.policeVerificationExpiryDate);

      pvdformdata.append('file', {
        uri: kycData.policeVerificationImage.path,
        type: 'image/jpg',
        name: 'image.jpg',
      });

      let dlformdata = new FormData();
      dlformdata.append('type', 'dl');
      dlformdata.append('number', kycData.drivingLicenseNo);
      dlformdata.append('issuedOn', kycData.licenceIssueDate);
      dlformdata.append('expiry', kycData.licenceExpiryDate);
      dlformdata.append('file', {
        uri: kycData.licenceImage.path,
        type: 'image/jpg',
        name: 'image.jpg',
      });

      // let adhformdata = new FormData();
      // adhformdata.append('type', 'adh');
      // adhformdata.append('number', parseInt(kycData.aadharNo));
      // adhformdata.append('file', {
      //   uri: kycData.licenceImage.path,
      //   type: 'image/jpg',
      //   name: 'image.jpg',
      // });

      console.log('dlformdata', dlformdata);
      console.log('pvdformdata', pvdformdata);
      // console.log('adhformdata', adhformdata);

      let url = urls.DMS_BASE_URL + endPoints.EDIT_DRIVER_KYC_DETAILS;
      var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: pvdformdata,
        redirect: 'follow',
      };
      var requestOptionsdl = {
        method: 'PUT',
        headers: myHeaders,
        body: dlformdata,
        redirect: 'follow',
      };
      // var requestOptionsadh = {
      //   method: 'PUT',
      //   headers: myHeaders,
      //   body: adhformdata,
      //   redirect: 'follow',
      // };

      console.log('====================================');
      // console.log('adhformdata', adhformdata);
      console.log('====================================');
      console.log('====================================');
      console.log('dlformdata', dlformdata);
      console.log('====================================');

      // return false;
      // adh doc upload
      // fetch(url, requestOptionsadh)
      //   .then(response => response.json())
      //   .then(result => {
      //     console.log('adhar upload res', result);
      //     if (result?.message === 'Success') {
      // dl================================
      fetch(url, requestOptionsdl)
        .then(response => response.json())
        .then(result => {
          console.log('document upload res', result);
          if (result?.message === 'Success') {
            //=============== pvd doc upload================================================
            fetch(url, requestOptions)
              .then(response => response.json())
              .then(result => {
                console.log('pvd res', result);
                setIsLoading(false);
                if (result?.message === 'Success') {
                  navigation.goBack();
                  ToastAndroid.show('Updated successfully', ToastAndroid.SHORT);
                  setIsEditable(false);
                } else {
                  Alert.alert(t('errorOccuredPoliceVerification'));
                }
              })
              .catch(error => {
                setIsLoading(false);
                console.log(error, 'error pvd');
                Alert.alert(t('errorOccuredPoliceVerification'));
              });
            //=============== pvd doc upload================================================
          } else {
            setIsLoading(false);
            Alert.alert(t('errorOccuredDrivingLicence'));
          }
        })
        .catch(error => {
          setIsLoading(false);
          console.log(error, 'error dl');
          Alert.alert(t('errorOccuredDrivingLicence'));
        });

      //driving licence================================================================
      //   } else {
      //     setIsLoading(false);
      //     Alert.alert('Unable to upload aadhar number,Please try again');
      //   }
      // })
      // .catch(error => {
      //   setIsLoading(false);
      //   console.log(error, 'error adh');
      //   Alert.alert('Unable to upload aadhar number,Please try again');
      // });
    }
  };

  let textInputRef = useRef('');
  const btnEditable = () => {
    setIsEditable(true);
    setTimeout(() => {
      textInputRef.current.focus();
    }, 0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        navigation={navigation}
        HeaderName={t('KYC Document')}
        rightIcon={!isEditable}
        rightClick={btnEditable}
      />
      <ScrollView style={{paddingHorizontal: 30}}>
        {/*================ aadhar number=========== */}
        {/* <View style={{marginVertical: 10}}>
          <CustomTextInput
            Inputheading={t('Aadhar Card No.')}
            placeholderTextColor={'#fff'}
            style={styles.cutomInput}
            autoCapitalize="words"
            keyboardAppearance={'dark'}
            isEditable={isEditable}
            placeHolder={'xxxx xxxx xxxx'}
            maxLength={16}
            value={kycData.aadharNo}
            onFocus={e => {
              onChangesData(kycData.aadharNo, 'aadharNo');
            }}
            onChangeText={values => {
              onChangesData(values, 'aadharNo');
              setKYCData({...kycData, aadharNo: values});
            }}
            isError={isError.aadharNo}
          />
          <View
            style={{
              height: 2,
              width: '100%',
              backgroundColor: '#ffffff80',
              marginTop: 25,
            }}
          />
        </View> */}

        {/*================ Driving licence number=========== */}

        <CustomTextInputEdit
          Inputheading={t('Driving licence no')}
          ref={textInputRef}
          showborder={isEditable}
          placeholderTextColor={color.white_50}
          style={styles.cutomInput}
          autoCapitalize="words"
          keyboardAppearance={'dark'}
          placeHolder="RJ-13/DLC/12/123456"
          isEditable={isEditable}
          editCallback={() => editCallback()}
          maxLength={20}
          value={kycData.drivingLicenseNo}
          onFocus={e => {
            onChangesData(kycData.drivingLicenseNo, 'drivingLicenseNo');
          }}
          onChangeText={values => {
            onChangesData(values, 'drivingLicenseNo');
            setKYCData({...kycData, drivingLicenseNo: values});
          }}
          isError={isError.drivingLicenseNo}
        />
        {/*================ Driving licence issue date=========== */}
        <View>
          <DatePickerComponent
            labels={t('Issued on')}
            disabled={!isEditable}
            showborder={isEditable}
            dateShow={kycData.licenceIssueDate}
            maximumDate={new Date()}
            pickerOpen={() => {
              onChangesData(kycData.licenceIssueDate, 'licenceIssueDate');
              setDLIssueDatePickerFlag(!dlIssueDatePickerFlag);
            }}
            datePickerFlag={dlIssueDatePickerFlag}
            onCancel={() => {
              setDLIssueDatePickerFlag(false);
            }}
            onConfirm={date => onDLIssueDateConfirm(date)}
            isError={isError.licenceIssueDate}
          />
        </View>
        {/*================ Driving licence expiry date=========== */}
        <View>
          <DatePickerComponent
            labels={t('Licence expiry')}
            showborder={isEditable}
            disabled={!isEditable}
            dateShow={kycData.licenceExpiryDate}
            pickerOpen={() => {
              setDLExpiryDatePickerFlag(true);
              onChangesData(kycData.licenceExpiryDate, 'licenceExpiryDate');
            }}
            isError={isError.licenceExpiryDate}
            minimumDate={new Date(dl_min_date)}
            date={new Date(dl_min_date)}
            datePickerFlag={dlExpiryDatePickerFlag}
            onCancel={() => setDLExpiryDatePickerFlag(false)}
            onConfirm={date => onDLExpiryDateConfirm(date)}
          />
        </View>

        {/*================ Driving licence image=========== */}
        <View>
          <Text style={styles.labels}>{t('Upload Driving Licence')}*</Text>
          {kycData.licenceImage == 0 ? (
            <TouchableOpacity
              disabled={!isEditable}
              onPress={() => {
                setDocumentPickerFlag(true);
                setPickerType('licenceImage');
                onChangesData(kycData.licenceImage, 'licenceImage');
              }}
              style={[
                styles.documentContainer,
                {borderColor: isEditable ? color.purpleborder : color.black_medum},
              ]}>
              <Image
                style={{
                  height: responsive_factor * 60,
                  width: responsive_factor * 60,
                  marginEnd: 10,
                }}
                resizeMode={'contain'}
                source={require('../../Assests/image/Otp/uploadIcon.png')}
              />
              <View>
                <Text
                  style={{
                    color: color.white,
                    fontSize: 16,
                    fontFamily: REGULAR,
                  }}>
                  {t('Choose file to')}{' '}
                  <Text
                    style={{
                      textDecorationLine: 'underline',
                      color: color.Blue_light,
                    }}>
                    {t('upload')}
                  </Text>
                </Text>
                <Text style={{color: color.white, fontSize: 12, opacity: 0.3}}>
                  {t('Support')} : JPG, JPEG (max. 5.0 MB)
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View
              style={{
                backgroundColor: color.Black_light,
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
                padding: Platform.OS == 'android' ? 6 : 14,
                paddingVertical: 26,
                borderRadius: 10,
                borderWidth: 1.5,
                borderStyle: 'dashed',
                justifyContent: 'center',
                borderColor: isEditable ? color.purpleborder : color.black_medum
              }}>
              <View style={{width: '30%', paddingHorizontal: 10}}>
                <Image
                  style={{width: 70, height: 50}}
                  source={{uri: kycData.licenceImage.path}}
                />
              </View>
              <View
                style={{
                  width: '65%',
                  marginHorizontal: 10,
                  flexDirection: 'column',
                }}>
                <Text
                  style={{
                    color: color.white,
                    fontSize: 14,
                    fontFamily: REGULAR,
                  }}>
                  {getImageNameFromUrl(kycData.licenceImage.path)}
                </Text>
                {isEditable && (
                  <TouchableOpacity
                    onPress={() => {
                      setDocumentPickerFlag(true);
                      setPickerType('licenceImage');
                      onChangesData(kycData.licenceImage, 'licenceImage');
                    }}>
                    <Text
                      style={{
                        marginTop: 5,
                        textDecorationLine: 'underline',
                        color: color.Blue_light,
                      }}>
                      {'Change'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {isError.licenceImage && (
            <Text style={{color: 'red'}}>{isError.licenceImage}</Text>
          )}
          <View
            style={{
              height: 2,
              width: '100%',
              backgroundColor: '#ffffff80',
              marginTop: 25,
            }}
          />
        </View>

        {/*================ Police verification issued on*=========== */}
        <View style={{}}>
          <DatePickerComponent
            disabled={!isEditable}
            showborder={isEditable}
            labels={t('Police verification issued on')}
            dateShow={kycData.policeVerificationIssueDate}
            maximumDate={new Date()}
            pickerOpen={() => {
              setPVDIssueDatePickerFlag(true);
              onChangesData(
                kycData.policeVerificationIssueDate,
                'policeVerificationIssueDate',
              );
            }}
            datePickerFlag={pvdIssueDatePickerFlag}
            onCancel={() => {
              setPVDIssueDatePickerFlag(false);
            }}
            onConfirm={date => onPVDIssueDateConfirm(date)}
            isError={isError.policeVerificationIssueDate}
          />
        </View>

        {/*================ Police verification expiry*=========== */}
        <DatePickerComponent
          disabled={!isEditable}
          showborder={isEditable}
          labels={t('Police verification expiry')}
          dateShow={kycData.policeVerificationExpiryDate}
          pickerOpen={() => {
            setPVDExpiryDatePickerFlag(true);
            onChangesData(
              kycData.policeVerificationExpiryDate,
              'policeVerificationExpiryDate',
            );
          }}
          isError={isError.policeVerificationExpiryDate}
          date={new Date(pvd_min_date)}
          minimumDate={new Date(pvd_min_date)}
          datePickerFlag={pvdExpiryDatePickerFlag}
          onCancel={() => setPVDExpiryDatePickerFlag(false)}
          onConfirm={date => onPVDExpiryDateConfirm(date)}
        />

        {/*================ Police verification image=========== */}
        <View style={{marginVertical: 10}}>
          <Text style={styles.labels}>
            {t('Upload Police Verification Certificate')}
            {'*'}
          </Text>
          {kycData.policeVerificationImage == 0 ? (
            <TouchableOpacity
              disabled={!isEditable}
              onPress={() => {
                // if (kycData.policeVerificationImage.length == 0) {
                setDocumentPickerFlag(true);
                setPickerType('policeVerificationImage');
                onChangesData(
                  kycData.policeVerificationImage,
                  'policeVerificationImage',
                );
                // }
                // else {
                //   navigation.navigate('ImageView', {
                //     path: kycData.policeVerificationImage.path,
                //   });
                // }
              }}
              style={[
                styles.documentContainer,
                {  borderColor: isEditable ? color.purpleborder : color.black_medum},
                
              ]}>
              <Image
                style={{
                  height: responsive_factor * 60,
                  width: responsive_factor * 60,
                  marginEnd: 10,
                }}
                resizeMode={'contain'}
                source={require('../../Assests/image/Otp/uploadIcon.png')}
              />
              <View>
                <Text
                  style={{
                    color: color.white,
                    fontSize: 16,
                    fontFamily: REGULAR,
                  }}>
                  {t('Choose file to')}{' '}
                  <Text
                    style={{
                      textDecorationLine: 'underline',
                      color: color.Blue_light,
                    }}>
                    {t('upload')}
                  </Text>
                </Text>
                <Text style={{color: color.white, fontSize: 12, opacity: 0.3}}>
                  {t('Support')} : JPG, JPEG (max. 5.0 MB)
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View
              style={{
                backgroundColor: color.Black_light,
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
                padding: Platform.OS == 'android' ? 6 : 14,
                paddingVertical: 26,
                borderRadius: 10,
                borderWidth: 1.5,
                borderStyle: 'dashed',
                justifyContent: 'center',
                borderColor: isEditable ? color.purpleborder : color.black_medum,
              }}>
              <View style={{width: '30%', paddingHorizontal: 10}}>
                <Image
                  style={{width: 70, height: 50}}
                  source={{uri: kycData.policeVerificationImage.path}}
                />
              </View>
              <View
                style={{
                  width: '65%',
                  marginHorizontal: 10,
                  flexDirection: 'column',
                }}>
                <Text
                  style={{
                    color: color.white,
                    fontSize: 14,
                    fontFamily: REGULAR,
                  }}>
                  {getImageNameFromUrl(kycData.policeVerificationImage.path)}
                </Text>
                {isEditable && (
                  <TouchableOpacity
                    onPress={() => {
                      // if (kycData.policeVerificationImage.length == 0) {
                      setDocumentPickerFlag(true);
                      setPickerType('policeVerificationImage');
                      onChangesData(
                        kycData.policeVerificationImage,
                        'policeVerificationImage',
                      );
                    }}>
                    <Text
                      style={{
                        marginTop: 5,
                        textDecorationLine: 'underline',
                        color: color.Blue_light,
                      }}>
                      {'Change'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {isError.policeVerificationImage && (
            <Text style={{color: 'red'}}>
              {isError.policeVerificationImage}
            </Text>
          )}
        </View>
        {isEditable && (
          <CustomPressable
            text={t('SAVE')}
            btnWidth={Dimensions.get('screen').width / 1.2}
            route={'Verify'}
            onPress={() => {
              btnSubmitAllDocuments();
            }}
            isLoading={isLoading}
            position={'relative'}
            bottom={0}
          />
        )}
        {/* </View> */}
      </ScrollView>
      <PickerModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.black_BG,
    flex: 1,

    paddingVertical: 20,
  },
  labels: {
    color: color.white,
    fontSize: fontstyles.InputHeadingSize,
    fontFamily: BOLD,
    paddingHorizontal: 5,
    marginVertical: 10,
  },
  inputFieldContainer: {
    backgroundColor: color.Black_light,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: mobW * 0.14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: color.purpleborder,
    paddingHorizontal: 9,
  },
  inputField: {
    fontSize: 20,
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
