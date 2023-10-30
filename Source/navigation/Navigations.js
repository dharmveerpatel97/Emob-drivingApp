// import React, { Component } from 'react';
import * as React from 'react';
import {
  View, 
  Image, 
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import Home from '../Screens/Dashboard/Home';
import {createDrawerNavigator} from '@react-navigation/drawer'; 
import CustomDrawer from './CustomDrawer';
import MapboxExample from '../Screens/Dashboard/Mapbox';
import Legal from '../Screens/LegalScreen/Legal';
import Notification from '../Screens/Dashboard/Notification';
import Myplans from '../Screens/MyPlansandMyEV/Myplans';
import Myvehicle from '../Screens/MyPlansandMyEV/Myvehicle';
import Setting from '../Screens/SettingScreen/Setting';
import {useTranslation} from 'react-i18next';
import MyRides from '../Screens/driverTrips/MyRides';
import Dashboard from '../Screens/Dashboard/Dashboard';
import Support from '../Screens/HelpSupport/Support';
import BookNow from '../Screens/OperationHub/BookNow';
import Operation_otp from '../Screens/OperationHub/Operation_otp';

import NewTrip from '../Screens/AddNewTrip/NewTrip';
import WaytoOperationHub from '../Screens/OperationHub/WaytoOperationHub';
import WayHub from '../Screens/OperationHub/WayHub';
import VerificationProcess from '../Screens/driverProfile/VerificationProcess';
import {useDispatch, useSelector} from 'react-redux';
import {getDriverProfileInfo} from '../Redux/appSlice';
const Drawer = createDrawerNavigator();

function MyDrawer() {
  const app = useSelector(state => state.app);
  const {t} = useTranslation();

  return (
    <SafeAreaView style={{flex: 1}}>
      <Drawer.Navigator
        initialRouteName={navigateRouteName}
        screenOptions={{
          drawerStyle: {
            width: 290,
          },
        }}
        drawerContent={props => <CustomDrawer {...props} />}>
          <Drawer.Screen
            name="Home"
         // component={Home}
         component={ app?.driverAllocationStatus?.status == 'accepting' ? MapboxExample :Home}
          // component={Dashboard}
          options={{
            drawerItemStyle: {
              width: '110%',
              borderBottomColor: '#10281C',
              borderBottomWidth: 1,
              marginLeft: -1,
            },
            drawerLabel: t('drawer_Dashboard'),
            headerShown: false,
            drawerIcon: () => (
              <View style={styles.iconContainer}>
                <Image
                  source={require('../Assests/image/dashboard.png')}
                  style={styles.icons}
                />
              </View>
            ),
            drawerLabelStyle: styles.drawerLabelStyle,
            headerTintColor: '#FFF',
          }}
        />
        {/* <Drawer.Screen
          name="home"
          // component={Home}
          component={Dashboard}
          options={{
            drawerItemStyle: {
              width: '110%',
              borderBottomColor: '#10281C',
              borderBottomWidth: 1,
              marginLeft: -1,
            },
            drawerLabel: t('drawer_Dashboard'),
            headerShown: false,
            drawerIcon: () => (
              <View style={styles.iconContainer}>
                <Image
                  source={require('../Assests/image/dashboard.png')}
                  style={styles.icons}
                />
              </View>
            ),
            drawerLabelStyle: styles.drawerLabelStyle,
            headerTintColor: '#FFF',
          }}
        /> */}

        <Drawer.Screen
          name="MyTrips"
          component={MyRides}
          options={{
            drawerItemStyle: {
              width: '110%',
              borderBottomColor: '#10281C',
              borderBottomWidth: 1,
              marginLeft: -1,
            },
            headerShown: false,
            drawerLabel: t('drawer_My_Trips'),
            drawerIcon: () => (
              <View style={styles.iconContainer}>
                <Image
                  source={require('../Assests/image/mytrips.png')}
                  style={styles.icons}
                />
              </View>
            ),
            drawerLabelStyle: styles.drawerLabelStyle,
          }}
        />
         <Drawer.Screen
            name="MyPlans"
            component={Myplans}
            options={{
              drawerItemStyle:{width:'110%',borderBottomColor:'#10281C',borderBottomWidth:1,marginLeft:-1},
              drawerLabel: t('drawer_Plans'),
              headerShown:false,
              drawerIcon: () => (
                <View style={styles.iconContainer}>
                  <Image
                    source={require('../Assests/image/rupee.png')}
                    style={styles.icons}
                  />
                </View>
              ),
              drawerLabelStyle:styles.drawerLabelStyle,
            }}
          /> 
        {/* <Drawer.Screen
            name="My Charging"
            component={Home}
            options={{ 
              drawerItemStyle:{width:'110%',borderBottomColor:'#10281C',borderBottomWidth:1,marginLeft:-1},
              drawerLabel: t('drawer_My_Charging'),
              drawerIcon: () => (
                <View style={styles.iconContainer}>
                  <Image
                    source={require('../Assests/image/charging.png')}
                    style={styles.icons}
                  />
                </View>
              ),
              drawerLabelStyle: styles.drawerLabelStyle,
            }}
          /> */}

        <Drawer.Screen
          name="MyEV"
          component={Myvehicle}
          options={{
            drawerItemStyle: {
              width: '110%',
              borderBottomColor: '#10281C',
              borderBottomWidth: 1,
              marginLeft: -1,
            },
            drawerLabel: t('drawer_Myev'),
            headerShown: false,
            drawerIcon: () => (
              <View style={styles.iconContainer}>
                <Image
                  source={require('../Assests/image/myev.png')}
                  style={styles.icons}
                />
              </View>
            ),
            drawerLabelStyle: styles.drawerLabelStyle,
          }}
        />

        <Drawer.Screen
          name="Notifications"
          component={Notification}
          options={{
            drawerItemStyle: {
              width: '110%',
              borderBottomColor: '#10281C',
              borderBottomWidth: 1,
              marginLeft: -1,
            },
            drawerLabel: t('drawer_Notifications'),
            headerShown: false,
            drawerIcon: () => (
              <View style={styles.iconContainer}>
                <Image
                  source={require('../Assests/image/notification.png')}
                  style={styles.icons}
                />
              </View>
            ),
            drawerLabelStyle: styles.drawerLabelStyle,
          }}
        />
        <Drawer.Screen
          name="Settings"
          component={Setting}
          options={{
            drawerItemStyle: {
              width: '110%',
              borderBottomColor: '#10281C',
              borderBottomWidth: 1,
              marginLeft: -1,
            },
            drawerLabel: t('drawer_Settings'),
            headerShown: false,
            drawerIcon: () => (
              <View style={styles.iconContainer}>
                <Image
                  source={require('../Assests/image/settings.png')}
                  style={styles.icons}
                />
              </View>
            ),
            drawerLabelStyle: styles.drawerLabelStyle,
          }}
        />
        <Drawer.Screen
          name="Support"
          component={Support}
          options={{
            drawerItemStyle: {
              width: '110%',
              borderBottomColor: '#10281C',
              borderBottomWidth: 1,
              marginLeft: -1,
            },
            drawerLabel: t('drawer_Support'),
            headerShown: false,
            drawerIcon: () => (
              <View style={styles.iconContainer}>
                <Image
                  source={require('../Assests/image/support.png')}
                  style={styles.icons}
                />
              </View>
            ),
            drawerLabelStyle: styles.drawerLabelStyle,
          }}
        />
        <Drawer.Screen
          name="Legal"
          component={Legal}
          options={{
            drawerItemStyle: {
              width: '110%',
              borderBottomColor: '#10281C',
              borderBottomWidth: 1,
              marginLeft: -1,
            },
            drawerLabel: t('drawer_Legal'),
            headerShown: false,
            drawerIcon: () => (
              <View style={styles.iconContainer}>
                <Image
                  source={require('../Assests/image/Legal.png')}
                  style={styles.icons}
                />
              </View>
            ),
            drawerLabelStyle: styles.drawerLabelStyle,
          }}
        />
        <Drawer.Screen
          name="mapbox"
          component={MapboxExample}
          options={{
            headerShown: false,
            drawerLabel: () => null,
            drawerLabelStyle: {display: 'none'},
            title: null,
            drawerIcon: () => null,
            drawerItemStyle: {display: 'none'},
          }}
        />
        {/* <Drawer.Screen
            name="VerificationProcess"
            component={VerificationProcess}
            options={{
              headerShown: false,
              drawerLabel: () => null,
              drawerLabelStyle: {display: 'none'},
              title: null,
              drawerIcon: () => null,
              drawerItemStyle: {display: 'none'},
            }}
          /> */}

        <Drawer.Screen
          name="WaytoOperationHub"
          component={WaytoOperationHub}
          options={{
            headerShown: false,
            drawerLabel: () => null,
            drawerLabelStyle: {display: 'none'},
            title: null,
            drawerIcon: () => null,
            drawerItemStyle: {display: 'none'},
          }}
        />
        <Drawer.Screen
          name="WayHub"
          component={WayHub}
          options={{
            headerShown: false,
            drawerLabel: () => null,
            drawerLabelStyle: {display: 'none'},
            title: null,
            drawerIcon: () => null,
            drawerItemStyle: {display: 'none'},
          }}
        />
      
        <Drawer.Screen
          name="BookNow"
          component={BookNow}
          options={{
            headerShown: false,
            drawerLabel: () => null,
            drawerLabelStyle: {display: 'none'},
            title: null,
            drawerIcon: () => null,
            drawerItemStyle: {display: 'none'},
          }}
        />
        <Drawer.Screen
          name="Operation_otp"
          component={Operation_otp}
          options={{
            headerShown: false,
            drawerLabel: () => null,
            drawerLabelStyle: {display: 'none'},
            title: null,
            drawerIcon: () => null,
            drawerItemStyle: {display: 'none'},
          }}
        />
    
        <Drawer.Screen
          name="NewTrip"
          component={NewTrip}
          options={{
            headerShown: false,
            drawerLabel: () => null,
            drawerLabelStyle: {display: 'none'},
            title: null,
            drawerIcon: () => null,
            drawerItemStyle: {display: 'none'},
          }}
        />
      </Drawer.Navigator>
    </SafeAreaView>
  );
}

export default MyDrawer;

const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: '#10281C',
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  icons: {
    height: 16,
    width: 16,
    resizeMode: 'contain',
  },
  drawerLabelStyle: {
    color: '#fff',
    fontSize: 14,
  },
});
