const env = {
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.VITE_CONTEXT === 'production',
  isHTTPS: location.protocol === 'https:',
  context: import.meta.env.VITE_CONTEXT as string,
}

export default env