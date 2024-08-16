
import { Text, View } from '@/designs/core';
import CounterStats from './src/components/CounterStats';
import RingProgress from './src/components/RingProgress';

export default function App() {
  return (
    <View className='flex-1 justify-center bg-black p-5 w-screen gap-y-10'>
      <RingProgress progress={0.4} />

      <View className='flex-row gap-20 gap-y-5 flex-wrap'>
        <View>
          <CounterStats label='Steps' value={2313} />
        </View>
        <View>
          <CounterStats label='Distance' value={2} unit='km'/>
        </View>
        <View>
          <CounterStats label='Flights Climbed' value={2}/>
        </View>
      </View>
    </View>
  );
}
