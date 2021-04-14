import { AxisConfig, Data, ScaleType } from '@/types'
import { getCol } from '@/utils'
import { extent } from 'd3-array'
import { scaleBand, scaleLinear } from 'd3-scale'

export default class Scale {
  scale: any
  config: AxisConfig

  constructor(config: AxisConfig) {
    this.config = config
    this.createScale(config.type)
  }

  public createScale(type: ScaleType) {
    switch (type) {
      case 'band':
        this.scale = scaleBand()
        break

      case 'linear':
        this.scale = scaleLinear()
        break
    }
  }

  public changeConfig(config: AxisConfig) {
    this.createScale(config.type)
    this.config = config
  }

  public get type() {
    return this.config.type
  }

  public bandwidth() {
    if (this.type === 'band') {
      return this.scale.bandwidth()
    }

    return 0
  }

  public updateRange(range: [number, number]) {
    this.scale = this.scale.copy().range(range)
  }

  public updateDomain(data: Data[], keys: string[]) {
    const domain = this.config.type === 'band' ? this.categoryDomain(data, keys) : this.numericDomain(data, keys)
    this.scale = this.scale.copy().domain(domain)
  }

  public map<T>(values: T[]): number[] {
    const { type } = this.config

    if (type === 'band') {
      return values.map((val) => {
        return this.scale(val) + this.scale.bandwidth() / 2
      })
    }

    return values.map((val) => this.scale(val))
  }

  public ticks() {
    const { type } = this.config

    if (this.config.tickValues !== undefined) {
      return this.config.tickValues
    }

    if (type === 'band') {
      return this.scale.domain()
    }

    return this.scale.ticks(this.config.ticks || 5)
  }

  private categoryDomain(data: Data[], keys: string[]) {
    const values = keys.reduce((arr, key) => arr.concat(getCol(key, data)), [])
    return Array.from(new Set(values))
  }

  private numericDomain(data: Data[], keys: string[]) {
    const { domain } = this.config
    const values = keys.reduce((arr, key) => arr.concat(getCol(key, data)), [])
    const [dataMin, dataMax] = extent(Array.from(new Set(values)))
    const yMin = eval(`
      let dataMin = ${dataMin || 0}
      ${domain[0]}
    `)

    const yMax = eval(`
      let dataMax = ${dataMax || 0}
      ${domain[1]}
    `)

    return [yMin, yMax]
  }
}
