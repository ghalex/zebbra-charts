import { Canvas, ChartConfig, Data, Layer, LayerType } from '@/types'
import { Scales } from '.'
import * as r from 'ramda'
import { ref, Ref } from 'vue'
import { getCol } from '@/utils'

const defaultConfig: ChartConfig = {
  size: { width: 500, height: 400 },
  margin: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  direction: 'horizontal',
  axis: {
    primary: {
      domain: ['dataMin', 'dataMax'],
      type: 'band'
    },
    secondary: {
      domain: ['dataMin', 'dataMax'],
      type: 'linear'
    }
  }
}

export default class Chart {
  data: Data[]
  layers: Layer[]
  config: ChartConfig
  scales: Scales
  updates: Ref<number> = ref(0)

  constructor(data: Data[], config: Partial<ChartConfig>) {
    this.data = data
    this.layers = []
    this.config = r.mergeDeepLeft(
      r.pickBy((p) => p !== undefined, config),
      defaultConfig
    ) as any
    this.scales = new Scales(this.config.axis)

    console.log('chart created')
  }

  get canvas(): Canvas {
    const { margin, size } = this.config
    const axisSpace = { x: 40, y: 20 }
    return {
      x: margin.left + axisSpace.x,
      y: margin.top,
      width: size.width - margin.right,
      height: size.height - margin.bottom - axisSpace.y
    }
  }

  public changeData(data: Data[]) {
    this.data = data
    this.update('data')
  }

  public changeConfig(config: Partial<ChartConfig>) {
    this.config = r.mergeDeepLeft(
      r.pickBy((p) => p !== undefined, config),
      this.config
    ) as any
    this.scales.changeConfig(this.config.axis)

    this.update('config')
  }

  public addLayer(layer: Layer) {
    this.layers.push(layer)
    this.update('layers')
  }

  public removeLayer(id: string) {
    this.layers = this.layers.filter((l) => l.id !== id)
    this.update('layers')
  }

  public getLayers(type?: LayerType) {
    if (type) {
      return this.layers.filter((l) => l.type === type)
    }
    return this.layers
  }

  public getData(keys: string[]): number[] {
    return keys.reduce((arr, key) => arr.concat(getCol(key, this.data)), [])
  }

  public getKeys(idx: number = -1) {
    const keys = this.layers.map((l) => l.dataKeys)

    if (idx === -1) {
      return keys
    }

    return getCol(idx, keys)
  }

  public update(_: string) {
    this.scales.updateRange(this.canvas, this.config.direction)
    this.scales.updateDomain(this.data, this.getKeys())

    this.updates.value += 1
    // console.log('update from:', from)
  }
}
