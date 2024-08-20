import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import {
  initialize,
  requestPermission,
  readRecords,
} from 'react-native-health-connect';
import { TimeRangeFilter } from 'react-native-health-connect/lib/typescript/types/base.types';

const useHealthData = (date: Date) => {
  const [hasPermissions, setHasPermissions] = useState(false);
  const [steps, setSteps] = useState(0);
  const [flights, setFlights] = useState(0);
  const [distance, setDistance] = useState(0);

  // Android - Health Connect
  const readSampleData = async () => {
    try {
      // Initialize the client
      const isInitialized = await initialize();
      if (!isInitialized) {
        console.error("Health Connect initialization failed");
        return;
      }

      // Request permissions
      const permissionsGranted = await requestPermission([
        { accessType: 'read', recordType: 'Steps' },
        { accessType: 'read', recordType: 'Distance' },
        { accessType: 'read', recordType: 'FloorsClimbed' },
      ]);

      if (!permissionsGranted) {
        console.error("Health Connect permissions denied");
        return;
      }

      setHasPermissions(true);

      const timeRangeFilter: TimeRangeFilter = {
        operator: 'between',
        startTime: new Date(date.setHours(0, 0, 0, 0)).toISOString(),
        endTime: new Date(date.setHours(23, 59, 59, 999)).toISOString(),
      };

      // Read steps data
      const stepsData = await readRecords('Steps', { timeRangeFilter });
      const totalSteps = stepsData.records.reduce((sum, cur) => sum + cur.count, 0);
      setSteps(totalSteps);

      // Read distance data
      const distanceData = await readRecords('Distance', { timeRangeFilter });
      const totalDistance = distanceData.records.reduce(
        (sum, cur) => sum + cur.distance.inMeters,
        0
      );
      setDistance(totalDistance);

      // Read floors climbed data
      const floorsClimbedData = await readRecords('FloorsClimbed', {
        timeRangeFilter,
      });
      const totalFloors = floorsClimbedData.records.reduce((sum, cur) => sum + cur.floors, 0);
      setFlights(totalFloors);

    } catch (error) {
      console.error("Error reading health data:", error);
    }
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      readSampleData();
    }
  }, [date]);

  return {
    hasPermissions,
    steps,
    flights,
    distance,
  };
};

export default useHealthData;
