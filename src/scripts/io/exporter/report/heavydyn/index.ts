import { heavydynDynatestExporter } from './dynatest'
import { heavydynF25Exporter } from './f25'
import { heavydynPDXExporter } from './pdx'
import { heavydynSwecoExporter } from './sweco'

export const heavydynReportExports = [
  heavydynDynatestExporter,
  heavydynF25Exporter,
  heavydynPDXExporter,
  heavydynSwecoExporter,
]
