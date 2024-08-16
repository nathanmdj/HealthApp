import React, { useEffect } from 'react';
import { View } from '@/designs/core';
import { Circle, Svg, Linecap } from 'react-native-svg';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';

interface RingProgressProps {
  radius?: number;
  strokeWidth?: number;
  progress: number;
}

interface CircleProps {
  r: number;
  cx: number;
  cy: number;
  originX: number;
  originY: number;
  fill: string;
  strokeWidth: number;
  stroke: string;
  strokeLinecap: Linecap;
  rotation: number;
}
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const RingProgress = ({
  radius = 100,
  strokeWidth = 20,
  progress,
}: RingProgressProps) => {
  const innerRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * innerRadius;
  const fill = useSharedValue(0.5);

  useEffect(() => {
    fill.value = withTiming(progress, { duration: 500 });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDasharray: [circumference * fill.value, circumference],
  }));

  // Common circle properties
  const circleProps: CircleProps = {
    r: innerRadius,
    cx: radius,
    cy: radius,
    originX: radius,
    originY: radius,
    fill: 'transparent',
    strokeWidth,
    stroke:"green",
    strokeLinecap:"round",
    rotation: -90
  };

  return (
    <View
      style={{
        width: radius * 2,
        height: radius * 2,
        alignSelf: 'center',
      }}
    >
      <Svg width={radius * 2} height={radius * 2}>
        <Circle
          {...circleProps}
          opacity={0.5}
        />
        <AnimatedCircle
          animatedProps={animatedProps}
          {...circleProps}
         
        />
      </Svg>
    </View>
  );
};

export default RingProgress;
