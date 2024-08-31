import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import AppleHealthKit, {
  HealthInputOptions,
  HealthKitPermissions,
} from 'react-native-health';

import {
  initialize,
  requestPermission,
  readRecords,
} from 'react-native-health-connect';
import { TimeRangeFilter } from 'react-native-health-connect/lib/typescript/types/base.types';

const permissions: HealthKitPermissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.Steps,
      AppleHealthKit.Constants.Permissions.FlightsClimbed,
      AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
      AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
    ],
    write: [],
  },
};

const useHealthData = (date: Date) => {
  const [hasPermissions, setHasPermissions] = useState(false);
  const [steps, setSteps] = useState(0);
  const [flights, setFlights] = useState(0);
  const [distance, setDistance] = useState(0);
  const [caloriesBurn, setCaloriesBurn] = useState(0);

  // iOS - HealthKit
  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }

    AppleHealthKit.isAvailable((err, isAvailable) => {
      if (err || !isAvailable) {
        console.log('Apple Health not available:', err);
        return;
      }

      AppleHealthKit.initHealthKit(permissions, (err) => {
        if (err) {
          console.log('Error getting permissions');
          return;
        }
        setHasPermissions(true);
      });
    });
  }, []);

  useEffect(() => {
    if (!hasPermissions || Platform.OS !== 'ios') {
      return;
    }

    const options: HealthInputOptions = {
      date: date.toISOString(),
      includeManuallyAdded: false,
    };

    AppleHealthKit.getStepCount(options, (err, results) => {
      if (err) {
        console.log('Error getting the steps');
        return;
      }
      setSteps(results.value);
    });

    AppleHealthKit.getFlightsClimbed(options, (err, results) => {
      if (err) {
        console.log('Error getting the flights climbed:', err);
        return;
      }
      setFlights(results.value);
    });

    AppleHealthKit.getDistanceWalkingRunning(options, (err, results) => {
      if (err) {
        console.log('Error getting the distance:', err);
        return;
      }
      setDistance(results.value);
    });

    AppleHealthKit.getActiveEnergyBurned(options, (err, results) => {
      if (err) {
        console.log('Error getting the active energy burned:', err);
        return;
      }

      const totalCaloriesBurned = results.reduce((sum, entry) => sum + entry.value, 0);
      setCaloriesBurn(totalCaloriesBurned);
    });

  }, [hasPermissions, date]);

  // Android - Health Connect
  const readSampleData = async () => {
    try {
      const isInitialized = await initialize();
      if (!isInitialized) {
        console.error("Health Connect initialization failed");
        return;
      }

      const permissionsGranted = await requestPermission([
        { accessType: 'read', recordType: 'Steps' },
        { accessType: 'read', recordType: 'Distance' },
        { accessType: 'read', recordType: 'FloorsClimbed' },
        { accessType: 'read', recordType: 'ActiveCaloriesBurned' },
      ]);

      if (!permissionsGranted) {
        console.error("Health Connect permissions denied");
        return;
      }

      setHasPermissions(true);

      const startTime = new Date(date);
      startTime.setHours(0, 0, 0, 0);

      const endTime = new Date(date);
      endTime.setHours(23, 59, 59, 999);

      const timeRangeFilter: TimeRangeFilter = {
        operator: 'between',
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      };

      const stepsData = await readRecords('Steps', { timeRangeFilter });
      const totalSteps = stepsData.records.reduce((sum, cur) => sum + cur.count, 0);
      setSteps(totalSteps);

      const distanceData = await readRecords('Distance', { timeRangeFilter });
      const totalDistance = distanceData.records.reduce(
        (sum, cur) => sum + cur.distance.inMeters,
        0
      );
      setDistance(totalDistance);

      const floorsClimbedData = await readRecords('FloorsClimbed', {
        timeRangeFilter,
      });
      const totalFloors = floorsClimbedData.records.reduce((sum, cur) => sum + cur.floors, 0);
      setFlights(totalFloors);

      const caloriesBurnedData = await readRecords('ActiveCaloriesBurned', {
        timeRangeFilter,
      });
      const totalCalories = caloriesBurnedData.records.reduce((sum, cur) => sum + cur.energy.inCalories, 0);
      setCaloriesBurn(totalCalories);

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
    caloriesBurn,
  };
};

export default useHealthData;
