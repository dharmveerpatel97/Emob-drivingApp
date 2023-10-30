import React from 'react';
import {Dimensions, Platform} from 'react-native';

export const responsive_factor = Dimensions.get('window').width * 0.0025;

export const AuthContext = React.createContext();

export const fonts = {
  ExtraBold: 'Montserrat-ExtraBold',
  Bold: 'Montserrat-Bold',
  SemiBold: 'Montserrat-SemiBold',
  medium: 'Montserrat-Medium',
  Regular: 'Montserrat-Regular',
};

export const shadow = {
  shadowColor: '#001A0F',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
};

export const shadow0 = {
  shadowColor: '#001A0F',
  shadowOffset: {
    width: 0,
    height: 0,
  },
  shadowOpacity: 0,
  shadowRadius: 0,
  elevation: 0,
};

export const shadowSmall = {
  shadowColor: '#001A0F',
  shadowOffset: {
    width: 0,
    height: 0.2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 1.84,
  elevation: 3,
};

// TO CALCULATE DATE,MONTH ,HOUR,SECONDS

export const DAYS_OF_WEEK_SMALL = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
export const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat'];

export const MONTHS_OF_YEAR = [
  'Jan',
  'Feb',
  'March',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const MONTHS_OF_YEAR_FULL = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const dateFromNow = dateStr => {
  var strSplitDate = String(dateStr).split(' ');
  var date = new Date(strSplitDate[0]);
  // var date = new Date(dateStr);
  console.warn('check darte', date, dateStr);
  const currentDate = new Date();

  if (
    date.getUTCDate() === currentDate.getUTCDate() &&
    date.getUTCMonth() === currentDate.getUTCMonth() &&
    date.getUTCFullYear() === currentDate.getUTCFullYear()
  ) {
    const hours = Math.floor(Math.abs(date - currentDate) / 36e5);

    if (hours === 0) {
      const minutes = Math.round(
        ((Math.abs(date - currentDate) % 86400000) % 3600000) / 60000,
      );
      return minutes <= 1 ? 'a while ago' : `${minutes} minutes ago.`;
    } else {
      return `${Math.floor(hours)} hour ago`;
    }
  } else {
    if (
      date.getUTCFullYear() < currentDate.getUTCFullYear() ||
      daysBetween(date, currentDate) > 6
    ) {
      return `${date.getDate()} ${
        MONTHS_OF_YEAR[date.getMonth()]
      } ${date.getFullYear()}`;
    } else {
      return `${date.getDate()} ${
        DAYS_OF_WEEK[date.getDay()]
      } at ${getHoursFromDate(date)}`;
    }
  }
};
const daysBetween = (date1, date2) => {
  const ONE_DAY_ON_SECONDS = 1000 * 60 * 60 * 24;
  const date1Ms = date1.getTime();
  const date2Ms = date2.getTime();

  const differenceMs = date2Ms - date1Ms;
  return Math.round(differenceMs / ONE_DAY_ON_SECONDS);
};

export const getHoursFromDate = date => {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return hours + ':' + minutes + ' ' + ampm;
};
