import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.empresa.pontofácil',
  appName: 'Ponto Fácil',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'photos', 'storage']
    },
    Geolocation: {
      permissions: ['location']
    },
    Filesystem: {
      permissions: ['storage']
    }
  }
};

export default config;
