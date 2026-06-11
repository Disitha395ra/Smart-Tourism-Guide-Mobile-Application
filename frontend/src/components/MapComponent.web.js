import React from 'react';
import { View } from 'react-native';

export default function MapComponent({ style, coordinate, title }) {
  const mapSrc = `https://maps.google.com/maps?q=${coordinate.latitude},${coordinate.longitude}&z=15&output=embed`;
  
  return (
    <View style={style}>
      <iframe 
        title={title}
        src={mapSrc} 
        width="100%" 
        height="100%" 
        frameBorder="0" 
        style={{ border: 0, borderRadius: 12 }} 
        allowFullScreen="" 
        aria-hidden="false" 
        tabIndex="0"
      />
    </View>
  );
}
