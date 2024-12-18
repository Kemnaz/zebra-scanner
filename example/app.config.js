// Get environment variables
const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';

// Function to get the unique package/bundle identifier for each environment
const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return 'expo.modules.zebrascanner.example'; // Development app identifier
  }

  if (IS_PREVIEW) {
    return 'expo.modules.zebrascanner.example.preview'; // Preview app identifier
  }

  return 'expo.modules.zebrascanner.example.prod'; // Production app identifier
};

// Function to get the app name for each environment
const getAppName = () => {
  if (IS_DEV) {
    return 'AssetHouse (Dev)';
  }

  if (IS_PREVIEW) {
    return 'AssetHouse (Preview)';
  }

  return 'AssetHouse'; // Production app name
};

export default {
  name: getAppName(),
  slug: 'AssetHouse',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: getUniqueIdentifier(), // Use dynamic identifier
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: getUniqueIdentifier(), // Use dynamic package name
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-router',
    // Add the expo-build-properties plugin
    [
      'expo-build-properties',
      {
        android: {
          usesCleartextTraffic: true, // Enable Cleartext Traffic for Android
        },
        ios: {
          // You can add additional iOS configurations here
        },
      },
    ],
  ],
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: '781a4afa-e7c6-4871-81e3-3b306319c335',
    },
  },
};
