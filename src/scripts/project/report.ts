export const createReport = (
  name: string,
  dataSettings: DataSettings
): Report => {
  return {
    name,
    images: [],
    points: [],
    line: undefined,
    dataSettings,
  }
}
