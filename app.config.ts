export default ({ config }: { config: any }) => ({
  ...config,
  extra: {
    // Expose environment variables to the 
    apiBase: process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:3000',
  },
});