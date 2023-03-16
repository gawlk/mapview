export const convertPRJZToBasePoint = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jsonPoint: any,
  index: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  json: any
): JSONBasePoint => {
  return {
    version: 1,
    id: jsonPoint.Point.ID,
    number: index + 1,
    index,
    date: jsonPoint.Point.Date,
    coordinates: {
      lng: jsonPoint.Point.Longitude,
      lat: jsonPoint.Point.Latitude,
    },
    settings: {
      version: 1,
      isVisible: true,
    },
    information: [
      {
        version: 1,
        label: 'Comment',
        value: jsonPoint.Point.Comment || '',
        settings: {
          version: 1,
          readOnly: true,
        },
      },
    ],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: json.ExportedData.Points.map((exportedData: any): JSONDataValue => {
      return {
        version: 1,
        label: exportedData.Name,
        value: jsonPoint.Point[exportedData.Name],
      }
    }),
    drops: [],
  }
}
