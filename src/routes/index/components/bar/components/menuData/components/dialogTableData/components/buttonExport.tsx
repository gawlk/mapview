import { Button, convertTableElementsToStrings } from '/src/components'
import { downloadCSV } from '/src/scripts'

interface Props {
  tables: Accessor<HTMLDivElement | undefined>
}

export const ButtonExport = (props: Props) => {
  return (
    <Button
      color="orange"
      full
      leftIcon={IconTablerFileDownload}
      onClick={() => {
        const tables = props.tables()
        if (!tables) return

        const datasets = convertTableElementsToStrings(tables)

        if (Array.from(new Set(datasets.map((d) => d.length))).length > 1) {
          throw Error(`Arrays don't have the same length`)
        }

        downloadCSV('file.csv', datasets, true)
      }}
    >
      Export table data to CSV
    </Button>
  )
}
