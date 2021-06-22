export type EnhancedLocationUpdate = {
  location: GeoJson;
  skippedLocations: GeoJson[];
  intermediateLocations: GeoJson[];
  type: string;
};

export type GeoJson = {
  type: string;
  geometry: GeoJsonGeometry;
  properties: GeoJsonProperties;
};

export type GeoJsonGeometry = {
  type: string;
  coordinates: number[];
};

export type GeoJsonProperties = {
  accuracyHorizontal: number;
  bearing: number;
  speed: number;
  time: number;
};

export type ConfigurationFileData = {
  source: string;
  sourceCredentials: string;
  sourceTrackableId: string;
  destinationCredentials?: string;
  destinationTrackableId?: string;
  adjustTimestamps?: boolean;
  loop?: boolean;
  historyStartTime?: number;
  historyFinishTime?: number;
};

export type AblyCredentialsFileData = {
  ablyApiKey: string;
};
