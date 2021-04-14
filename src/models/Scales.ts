import { Canvas, ChartAxis, Data, Direction } from '@/types'
import * as r from 'ramda'
import Scale from './Scale'

export default class Scales {
  primary: Scale
  secondary: Scale
  config: ChartAxis

  constructor(config: ChartAxis) {
    this.config = config
    this.primary = new Scale(config.primary)
    this.secondary = new Scale(config.secondary)
  }

  public changeConfig(config: ChartAxis) {
    this.config = config
    this.primary.changeConfig(config.primary)
    this.secondary.changeConfig(config.secondary)
  }

  public updateRange(canvas: Canvas, direction: Direction) {
    if (direction === 'horizontal') {
      this.primary.updateRange([canvas.x, canvas.width])
      this.secondary.updateRange([canvas.height, canvas.y])
    } else {
      this.primary.updateRange([canvas.y, canvas.height])
      this.secondary.updateRange([canvas.x, canvas.width])
    }
  }

  public updateDomain(data: Data[], keys: Array<[string, string]>) {
    const getRow = (idx: number): string[] => r.uniq(r.map((v) => r.nth(idx, v) || '', keys)).filter((x) => x !== '')

    this.primary.updateDomain(data, getRow(0))
    this.secondary.updateDomain(data, getRow(1))
  }
}
