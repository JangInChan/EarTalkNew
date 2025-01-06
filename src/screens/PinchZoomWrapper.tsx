/* import React from 'react';
import { Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';

const PinchZoomWrapper: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const MIN_SCALE = 1;
  const MAX_SCALE = 3;

  const calculateBounds = () => {
    const contentWidth = screenWidth * scale.value;
    const contentHeight = screenHeight * scale.value;

    const maxTranslateX = Math.max(0, (contentWidth - screenWidth) / 2);
    const maxTranslateY = Math.max(0, (contentHeight - screenHeight) / 2);

    return { maxTranslateX, maxTranslateY };
  };

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      if (!event || typeof event.scale !== 'number' || isNaN(event.scale) || event.scale <= 0) {
        return; // iOS 안정성 강화
      }
      const nextScale = scale.value * event.scale;
      scale.value = Math.max(MIN_SCALE, Math.min(MAX_SCALE, nextScale));
    })
    .onEnd(() => {
      scale.value = withSpring(Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale.value)), {
        damping: 10,
        stiffness: 100,
      });
      runOnJS(correctTranslation)();
    });

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (!event) return;
      const { maxTranslateX, maxTranslateY } = calculateBounds();

      const nextX = translateX.value + event.translationX;
      const nextY = translateY.value + event.translationY;

      translateX.value = Math.max(-maxTranslateX, Math.min(maxTranslateX, nextX));
      translateY.value = Math.max(-maxTranslateY, Math.min(maxTranslateY, nextY));
    });

  const correctTranslation = () => {
    const { maxTranslateX, maxTranslateY } = calculateBounds();

    translateX.value = Math.max(-maxTranslateX, Math.min(maxTranslateX, translateX.value));
    translateY.value = Math.max(-maxTranslateY, Math.min(maxTranslateY, translateY.value));
  };

  const animatedStyle = useAnimatedStyle(() => {
    const contentWidth = screenWidth * scale.value;
    const contentHeight = screenHeight * scale.value;

    const offsetX = contentWidth < screenWidth ? (screenWidth - contentWidth) / 2 : 0;
    const offsetY = contentHeight < screenHeight ? (screenHeight - contentHeight) / 2 : 0;

    return {
      transform: [
        { scale: scale.value },
        { translateX: translateX.value + offsetX },
        { translateY: translateY.value + offsetY },
      ],
    };
  });

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'white' }}>
      <GestureDetector gesture={Gesture.Simultaneous(pinchGesture, panGesture)}>
        <Animated.View style={[{ flex: 1 }, animatedStyle]}>{children}</Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default PinchZoomWrapper;
 */