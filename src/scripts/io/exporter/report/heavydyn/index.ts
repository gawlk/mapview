import { heavydynDynatestExporter } from './dynatest'
import { heavydynF25Exporter } from './f25'
import { heavydynPDXExporter } from './pdx'
import { heavydynSwecoExporter } from './sweco'

import env from '/src/env'

export const heavydynReportExports = [
  heavydynF25Exporter,
  heavydynDynatestExporter,
  heavydynSwecoExporter,
  ...(env.isProd ? [] : [heavydynPDXExporter]),
]

export {
  heavydynDynatestExporter,
  heavydynF25Exporter,
  heavydynPDXExporter,
  heavydynSwecoExporter,
}
