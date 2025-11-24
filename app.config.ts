export default ({ config }: { config: any }) => ({
  ...config,
  extra: {
    // Expose environment variables to 
    apiBase: process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:3000',
  },
});