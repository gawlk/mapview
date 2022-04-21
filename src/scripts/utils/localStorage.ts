export const getDisclosureOpenState = (key: string, defaultOpen?: boolean) => {
  const open = localStorage.getItem(key)
  return open === null || open === 'true' ? defaultOpen ?? true : false
}

export const setDisclosureOpenState = (key: string, open: boolean) =>
  localStorage.setItem(key, String(open))
