import Constants from "expo-constants";

export const getServerUrl = (): string => {
  const environment = process.env.EXPO_PUBLIC_ENVIRONMENT || 'production';
  
  console.log('🌐 getServerUrl - Environment:', environment);
  console.log('🌐 Available env vars:');
  console.log('  - EXPO_PUBLIC_DEV_SERVER_URL:', process.env.EXPO_PUBLIC_DEV_SERVER_URL);
  console.log('  - EXPO_PUBLIC_TEST_SERVER_URL:', process.env.EXPO_PUBLIC_TEST_SERVER_URL);
  console.log('  - EXPO_PUBLIC_PROD_SERVER_URL:', process.env.EXPO_PUBLIC_PROD_SERVER_URL);
  
  let serverUrl: string;
  
  switch (environment) {
    case 'development':
      serverUrl = process.env.EXPO_PUBLIC_DEV_SERVER_URL || 'http://localhost:3000';
      break;
    case 'test':
      serverUrl = process.env.EXPO_PUBLIC_TEST_SERVER_URL || 'https://kasa-test-393925206417.europe-west1.run.app';
      break;
    case 'production':
    default:
      serverUrl = process.env.EXPO_PUBLIC_PROD_SERVER_URL || 'https://backend-393925206417.europe-west1.run.app';
      break;
  }
  
  console.log('🌐 Final server URL:', serverUrl);
  return serverUrl;
};
