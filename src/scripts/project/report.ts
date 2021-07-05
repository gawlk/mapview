export const createReport = (name: string, dataSettings: {}): Report => {
  return {
    name,
    images: [],
    points: [],
    dataSettings,
  }
}
