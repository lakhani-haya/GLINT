export default ({ config }: { config: any }) => ({
  ...config,
  extra: {
    // Expose enviro
    apiBase: process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:3000',
  },
});