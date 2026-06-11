import React from 'react';
import MapView, { Marker } from 'react-native-maps';

export default function MapComponent({ style, initialRegion, coordinate, title }) {
  return (
    <MapView style={style} initialRegion={initialRegion}>
      <Marker coordinate={coordinate} title={title} />
    </MapView>
  );
}
