import {
  View as ReactNativeView,
  Text as ReactNativeText,
  Button as ReactNativeButton,
  Image as ReactNativeImage,
  ImageBackground as ReactNativeImageBackground,
  TouchableOpacity as ReactNativeTouchableOpacity,
  FlatList as ReactNativeFlatList,
  Animated as AnimatedNative,
  SafeAreaView as ReactNativeSafeAreaView,
  Easing as ReactNativeEasing,
  TextInput as ReactNativeTextInput,
} from "react-native";

import { styled } from "nativewind";


export const View = styled(ReactNativeView);
export const Text = styled(ReactNativeText);
export const TextInput = styled(ReactNativeTextInput);
export const Button = styled(ReactNativeButton);
export const Image = styled(ReactNativeImage);
export const ImageBackground = styled(ReactNativeImageBackground);
export const TouchableOpacity = styled(ReactNativeTouchableOpacity);
export const FlatList = styled(ReactNativeFlatList);
export const Animated = styled(AnimatedNative.View);
export const Easing = ReactNativeEasing;
export const SafeAreaView = styled(ReactNativeSafeAreaView);
