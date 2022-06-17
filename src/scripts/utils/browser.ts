import { isIOS } from '@vueuse/core'

export const getBrowser = () => {
  if (navigator) {
    if (
      (navigator.userAgent.indexOf('Opera') ||
        navigator.userAgent.indexOf('OPR')) != -1
    ) {
      return 'Opera'
    } else if (navigator.userAgent.indexOf('Chrome') != -1) {
      return 'Chrome'
    } else if (navigator.userAgent.indexOf('Safari') != -1) {
      return 'Safari'
    } else if (navigator.userAgent.indexOf('Firefox') != -1) {
      return 'Firefox'
    } else if (navigator.userAgent.indexOf('MSIE') != -1) {
      return 'IE'
    } else {
      return 'Unknown'
    }
  } else {
    return 'Unknown'
  }
}

export const isMobile = () =>
  (navigator.userAgent.match(/iPhone|iPad|iPod/i) ||
    navigator.userAgent.match(/Android/i)) !== null
