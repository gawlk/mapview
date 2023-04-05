import store from '/src/store'

import { heavydynDynatestExporter } from './dynatest'
import { heavydynF25Exporter } from './f25'
import { heavydynPDXExporter } from './pdx'
import { heavydynSwecoExporter } from './sweco'

const exporter = [
  heavydynF25Exporter,
  heavydynDynatestExporter,
  heavydynSwecoExporter,
]

export const heavydynReportExports = store.isProd
  ? exporter
  : [...exporter, heavydynPDXExporter]
