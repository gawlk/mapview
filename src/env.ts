export const env = {
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.VITE_CONTEXT === 'production',
  isTest: import.meta.env.MODE === 'test',
  isHTTPS: window.location.protocol === 'https:',
  context: import.meta.env.VITE_CONTEXT as string,
}
