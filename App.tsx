import { Text, View } from '@/designs/core';
import CounterStats from './src/components/CounterStats';
import RingProgress from './src/components/RingProgress';
import { useState } from 'react';
import useHealthData from './src/hooks/useHealthData';

const STEPS_GOAL = 10_000;

export default function App() {
  const [date, setDate] = useState(new Date());
  const { steps, flights, distance } = useHealthData(date);
  
  const changeDate = (numDays: number) => {
    const currentDate = new Date(date); // Create a copy of the current date
    currentDate.setDate(currentDate.getDate() + numDays);
    console.log('New Date:', currentDate);
    setDate(currentDate); // Update the state variable
  };

  return (
    <View className='flex-1 justify-center bg-black p-5 w-screen gap-y-10'>
      <RingProgress progress={steps / STEPS_GOAL} />

      <View className='flex-row gap-20 gap-y-5 flex-wrap'>
        <View>
          <CounterStats label='Steps' value={steps} />
        </View>
        <View>
          <CounterStats label='Distance' value={distance} unit='km' />
        </View>
        <View>
          <CounterStats label='Flights Climbed' value={flights} />
        </View>
      </View>
    </View>
  );
}
