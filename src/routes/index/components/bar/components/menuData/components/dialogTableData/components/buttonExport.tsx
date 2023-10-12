import { Button, convertTableElementsToStrings } from '/src/components'
import { useAppState } from '/src/index'
import { downloadTSV } from '/src/scripts'
import { store } from '/src/store'

interface Props {
  tables: Accessor<HTMLDivElement | undefined>
}

export const ButtonExport = (props: Props) => {
  const { t } = useAppState()

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
      {t('Export table data to TSV')}
    </Button>
  )
}
