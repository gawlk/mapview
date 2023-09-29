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

        downloadCSV('file.csv', convertTableElementsToStrings(tables), true)
      }}
    >
      Export table data to CSV
    </Button>
  )
}
