import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Text, View, AccessibilityInfo, Image } from 'react-native';
 
// Components
import SwipeThumb from '../../components/SwipeThumb';

// Styles
import styles from './styles';

// Constants
import {
  DISABLED_RAIL_BACKGROUND_COLOR,
  DISABLED_THUMB_ICON_BACKGROUND_COLOR,
  DISABLED_THUMB_ICON_BORDER_COLOR,
  RAIL_BACKGROUND_COLOR,
  RAIL_BORDER_COLOR,
  RAIL_FILL_BACKGROUND_COLOR,
  RAIL_FILL_BORDER_COLOR,
  SWIPE_SUCCESS_THRESHOLD,
  THUMB_ICON_BACKGROUND_COLOR,
  THUMB_ICON_BORDER_COLOR,
  TITLE_COLOR,
} from '../../constants';
import LinearGradient from 'react-native-linear-gradient';

const SwipeButton = props => {
  const [layoutWidth, setLayoutWidth] = useState(0);
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
  const [isUnmounting, setIsUnmounting] = useState(false);

  /**
   * Retrieve layoutWidth to set maximum swipeable area.
   * Correct layout width will be received only after first render but we need it before render.
   * So render SwipeThumb only if layoutWidth > 0
   */
  const onLayoutContainer = async e => {
    if (isUnmounting || layoutWidth) {
      return;
    }
    setLayoutWidth(e.nativeEvent.layout.width);
  };

  useEffect(() => {
    const handleScreenReaderToggled = isEnabled => {
      if (isUnmounting || screenReaderEnabled === isEnabled) {
        return;
      }
      setScreenReaderEnabled(isEnabled);
    };
    setIsUnmounting(false);
    const subscription = AccessibilityInfo.addEventListener('change', handleScreenReaderToggled);

    AccessibilityInfo.isScreenReaderEnabled().then(isEnabled => {
      if (isUnmounting) {
        return;
      }
      setScreenReaderEnabled(isEnabled);
    });

    return () => {
      setIsUnmounting(true);
      subscription.remove();
    };
  }, [isUnmounting, screenReaderEnabled]);

  const {
    containerStyles,
    disabled,
    disabledRailBackgroundColor,
    disabledThumbIconBackgroundColor,
    disabledThumbIconBorderColor,
    disableResetOnTap,
    enableReverseSwipe,
    forceReset,
    height,
    onSwipeFail,
    onSwipeStart,
    onSwipeSuccess,
    railBackgroundColor,
    railBorderColor,
    railFillBackgroundColor,
    railFillBorderColor,
    railStyles,
    resetAfterSuccessAnimDelay,
    resetAfterSuccessAnimDuration,
    shouldResetAfterSuccess,
    swipeSuccessThreshold,
    thumbIconBackgroundColor,
    thumbIconBorderColor,
    thumbIconComponent,
    thumbIconImageSource,
    thumbIconStyles,
    thumbIconWidth,
    title,
    titleColor,
    titleFontSize,
    titleMaxFontScale,
    titleStyles,
    width,
    gradientColor,
  } = props;
  return (
    <LinearGradient
    start={{x: 0, y: 0}}
    end={{x: 1, y: 1}}
    colors={gradientColor}
    style={[
      styles.container,
      {
        ...containerStyles,
        // backgroundColor: '#69A0F3',
        borderColor: railBorderColor,
        ...(width ? { width } : {}),
        borderRadius:10,
        justifyContent:"center",
      },
    ]}
    onLayout={onLayoutContainer}
 >
      <View
        maxFontSizeMultiplier={titleMaxFontScale}
        ellipsizeMode={'tail'}
        numberOfLines={1}
        importantForAccessibility={
          screenReaderEnabled ? 'no-hide-descendants' : ''
        }
        style={[
          styles.title,
          {
            color: titleColor,
            fontSize: titleFontSize,
            ...titleStyles,
          },
        ]}>
        <Image style={{width:22,height:20}} resizeMode='contain' source={require('../../../assets/arrow.png')}/>
        <Text style={{color: titleColor}}>{title} </Text>
        {/* {title} */}
        <Image style={{width:22,height:20}} resizeMode='contain' source={require('../../../assets/arrow.png')}/>
      </View>
        {/* </View> */}
      {layoutWidth > 0 && (
        <SwipeThumb
          disabled={disabled}
          disabledThumbIconBackgroundColor={disabledThumbIconBackgroundColor}
          disabledThumbIconBorderColor={disabledThumbIconBorderColor}
          disableResetOnTap={disableResetOnTap}
          enableReverseSwipe={enableReverseSwipe}
          forceReset={forceReset}
          layoutWidth={layoutWidth}
          onSwipeFail={onSwipeFail}
          onSwipeStart={onSwipeStart}
          onSwipeSuccess={onSwipeSuccess}
          railFillBackgroundColor={railFillBackgroundColor}
          railFillBorderColor={railFillBorderColor}
          railStyles={railStyles}
          resetAfterSuccessAnimDelay={resetAfterSuccessAnimDelay}
          resetAfterSuccessAnimDuration={resetAfterSuccessAnimDuration}
          screenReaderEnabled={screenReaderEnabled}
          shouldResetAfterSuccess={shouldResetAfterSuccess}
          swipeSuccessThreshold={swipeSuccessThreshold}
          thumbIconBackgroundColor={thumbIconBackgroundColor}
          thumbIconBorderColor={thumbIconBorderColor}
          thumbIconComponent={thumbIconComponent}
          thumbIconHeight={height}
          thumbIconImageSource={thumbIconImageSource}
          thumbIconStyles={thumbIconStyles}
          thumbIconWidth={thumbIconWidth}
          title={title}
          gradientColor={gradientColor}
        />
      )}
 
    </LinearGradient>
  );
};

SwipeButton.defaultProps = {
  containerStyles: {},
  disabled: false,
  disabledRailBackgroundColor: DISABLED_RAIL_BACKGROUND_COLOR,
  disabledThumbIconBackgroundColor: DISABLED_THUMB_ICON_BACKGROUND_COLOR,
  disabledThumbIconBorderColor: DISABLED_THUMB_ICON_BORDER_COLOR,
  disableResetOnTap: false,
  height: 50,
  railBackgroundColor: RAIL_BACKGROUND_COLOR,
  railBorderColor: RAIL_BORDER_COLOR,
  railFillBackgroundColor: RAIL_FILL_BACKGROUND_COLOR,
  railFillBorderColor: RAIL_FILL_BORDER_COLOR,
  swipeSuccessThreshold: SWIPE_SUCCESS_THRESHOLD,
  thumbIconBackgroundColor: THUMB_ICON_BACKGROUND_COLOR,
  thumbIconBorderColor: THUMB_ICON_BORDER_COLOR,
  thumbIconStyles: {},
  title: 'Swipe to submit',
  titleColor: TITLE_COLOR,
  titleFontSize: 20,
  titleStyles: {},
};

SwipeButton.propTypes = {
  containerStyles: PropTypes.object,
  disable: PropTypes.bool,
  disabledRailBackgroundColor: PropTypes.string,
  disabledThumbIconBackgroundColor: PropTypes.string,
  disabledThumbIconBorderColor: PropTypes.string,
  disableResetOnTap: PropTypes.bool,
  enableReverseSwipe: PropTypes.bool,
  forceReset: PropTypes.func,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onSwipeFail: PropTypes.func,
  onSwipeStart: PropTypes.func,
  onSwipeSuccess: PropTypes.func,
  railBackgroundColor: PropTypes.string,
  railBorderColor: PropTypes.string,
  railFillBackgroundColor: PropTypes.string,
  railFillBorderColor: PropTypes.string,
  railStyles: PropTypes.object,
  resetAfterSuccessAnimDelay: PropTypes.number,
  resetAfterSuccessAnimDuration: PropTypes.number,
  shouldResetAfterSuccess: PropTypes.bool,
  swipeSuccessThreshold: PropTypes.number, // Ex: 70. Swipping 70% will be considered as successful swipe
  thumbIconBackgroundColor: PropTypes.string,
  thumbIconBorderColor: PropTypes.string,
  thumbIconComponent: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.node,
    PropTypes.func,
  ]),
  thumbIconImageSource: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  thumbIconStyles: PropTypes.object,
  thumbIconWidth: PropTypes.number,
  title: PropTypes.string,
  titleColor: PropTypes.string,
  titleFontSize: PropTypes.number,
  titleMaxFontScale: PropTypes.number,
  titleStyles: PropTypes.object,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default SwipeButton;
