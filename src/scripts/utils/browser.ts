export const getBrowser = () => {
  if (!navigator) return 'Unknown'

  if (
    (navigator.userAgent.indexOf('Opera') ||
      navigator.userAgent.indexOf('OPR')) !== -1
  ) {
    return 'Opera'
  }

  if (navigator.userAgent.indexOf('Chrome') !== -1) {
    return 'Chrome'
  }

  if (navigator.userAgent.indexOf('Safari') !== -1) {
    return 'Safari'
  }

  if (navigator.userAgent.indexOf('Firefox') !== -1) {
    return 'Firefox'
  }

  if (navigator.userAgent.indexOf('MSIE') !== -1) {
    return 'IE'
  }

  return 'Unknown'
}

export const isMobile = () =>
  (navigator.userAgent.match(/iPhone|iPad|iPod/i) ||
    navigator.userAgent.match(/Android/i)) !== null
