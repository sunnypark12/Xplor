import React from 'react';
import { Platform } from 'react-native';
import WebImpl from './WebGlobe.web';
import NativeImpl from './WebGlobe.native';

const WebGlobe: React.FC = () => {
  return Platform.OS === 'web' ? <WebImpl /> : <NativeImpl />;
};

export default WebGlobe;


