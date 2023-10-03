import { Button, convertTableElementsToStrings } from '/src/components'
import { downloadTSV } from '/src/scripts'
import { store } from '/src/store'

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

        downloadTSV(
          `${store.selectedReport?.name.toString() || 'file'}.tsv`,
          convertTableElementsToStrings(tables),
          true,
        )
      }}
    >
      Export table data to CSV
    </Button>
  )
}
