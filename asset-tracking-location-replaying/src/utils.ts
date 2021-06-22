import { EnhancedLocationUpdate, GeoJson } from './types';

/**
 * Suspends program execution for `sleepTimeInSeconds` seconds.
 * Utility wrapper for setTimeout that makes it possible to call it in the async/await fashion.
 */
export const wait = (sleepTimeInSeconds: number) =>
  new Promise((resolve) => setTimeout(resolve, sleepTimeInSeconds * 1000));

/**
 * Changes timestamps of all locations (main, intermediate, skipped) in the location update
 * so the main location time is equal to current time. All locations time differences are persisted.
 * Returns stringified location update message.
 */
export const adjustLocationTimestamps = (locationUpdateJsonString: string): string => {
  // We're using JSON.parse() and JSON.stringify() to create a deep copy and not modify the original object
  const modifiedLocationUpdate: EnhancedLocationUpdate = JSON.parse(locationUpdateJsonString);
  const currentTimeInSeconds = Date.now() / 1000;
  const mainLocationTimeInSeconds = modifiedLocationUpdate.location.properties.time;
  const calculateNewTime = (location: GeoJson) =>
    (location.properties.time = currentTimeInSeconds - (mainLocationTimeInSeconds - location.properties.time));
  modifiedLocationUpdate.intermediateLocations.forEach((location) => calculateNewTime(location));
  modifiedLocationUpdate.skippedLocations.forEach((location) => calculateNewTime(location));
  modifiedLocationUpdate.location.properties.time = currentTimeInSeconds;
  return JSON.stringify(modifiedLocationUpdate);
};
