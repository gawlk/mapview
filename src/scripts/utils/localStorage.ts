export const getDisclosureOpenState = (key: string) => {
  const open = localStorage.getItem(key)
  return open === null || open === 'true' ? true : false
}

export const setDisclosureOpenState = (key: string, open: boolean) =>
  localStorage.setItem(key, String(open))
