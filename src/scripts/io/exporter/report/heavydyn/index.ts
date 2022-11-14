import { heavydynDynatestExporter } from './dynatest'
import { heavydynF25Exporter } from './f25'
import { heavydynPDXExporter } from './pdx'
import { heavydynSwecoExporter } from './sweco'

export const heavydynReportExports = [
  heavydynF25Exporter,
  heavydynDynatestExporter,
  heavydynSwecoExporter,
  heavydynPDXExporter,
]
