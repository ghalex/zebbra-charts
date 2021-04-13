import { Canvas, Data, Domain } from '@/types'
import { extent } from 'd3-array'
import { ScaleBand, ScaleLinear, scaleBand, scaleLinear } from 'd3-scale'

export default class Scales {
  bandScale: ScaleBand<string>
  linearScale: ScaleLinear<number, number>
  domain: Domain

  constructor(domain: Domain) {
    this.bandScale = scaleBand()
    this.linearScale = scaleLinear()
    this.domain = domain
  }

  public updateRange(canvas: Canvas, direction: 'horizontal' | 'vertical') {
    if (direction === 'horizontal') {
      this.bandScale = this.bandScale.copy().range([canvas.x, canvas.width])
      this.linearScale = this.linearScale
        .copy()
        .range([canvas.height, canvas.y])
        .nice()
    } else {
      this.bandScale = this.bandScale.copy().range([canvas.y, canvas.height])
      this.linearScale = this.linearScale
        .copy()
        .range([canvas.x, canvas.width])
        .nice()
    }
  }

  public updateDomain(data: Data[], layersData: number[]) {
    this.updateBandDomain(data)
    this.updateLinearDomain(layersData)
  }

  private updateBandDomain(data: Data[]) {
    const domain = data.map((_: any, i: number) => i.toString())
    this.bandScale = this.bandScale.copy().domain(domain)
  }

  private updateLinearDomain(layersData: number[]) {
    const [dataMin, dataMax] = extent(layersData)
    const yMin = eval(`
      let dataMin = ${dataMin || 0}
      ${this.domain[0]}
    `)

    const yMax = eval(`
      let dataMax = ${dataMax || 0}
      ${this.domain[1]}
    `)

    const domain = [yMin, yMax]
    this.linearScale = this.linearScale.copy().domain(domain)
  }
}
