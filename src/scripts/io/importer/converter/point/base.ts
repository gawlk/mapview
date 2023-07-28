export const convertPRJZToBasePoint = (
  jsonPoint: RecordAny,
  index: number,
  json: JSONAny
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
    data: json.ExportedData.Points.map(
      (exportedData: RecordAny): JSONDataValue => ({
        version: 1,
        label: exportedData.Name,
        value: jsonPoint.Point[exportedData.Name],
      })
    ),
    drops: [],
  }
}
