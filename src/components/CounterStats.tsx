import { View, Text } from '@/designs/core';

interface CounterStatsProps {
  label: string
  value: string
  unit?: string
}
const CounterStats = ({label, value, unit}: CounterStatsProps) => {
  return (
    <View>
      <Text className='text-white'>{label}</Text>
      <Text className='text-white text-3xl'>{value} {unit}</Text>
    </View>
  )
}

export default CounterStats