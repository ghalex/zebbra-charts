import * as r from 'ramda'
import { Canvas, ChartConfig, Data, Layer } from '@/types'
import { getCol } from '@/utils'
import { Scales } from '.'
import { ref, Ref } from 'vue'

const defaultConfig: ChartConfig = {
  size: { width: 500, height: 400 },
  margin: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  direction: 'horizontal'
}

export default class Chart {
  data: Data[]
  layers: Layer[]
  config: ChartConfig
  scales: Scales
  updates: Ref<number> = ref(0)

  constructor(data: Data[], config: Partial<ChartConfig>) {
    this.data = []
    this.layers = []
    this.config = { ...defaultConfig, ...config }
    this.scales = new Scales()

    this.changeData(data)
  }

  get canvas(): Canvas {
    const { margin, size } = this.config
    return {
      x: margin.left,
      y: margin.top,
      width: size.width - margin.right,
      height: size.height - margin.bottom
    }
  }

  public addLayer(layer: Layer) {
    this.layers = [...this.layers, layer]
    this.update()
  }

  public removeLayer(layer: Layer) {
    const idx = this.layers.findIndex((l) => l.dataKey === layer.dataKey)

    if (idx > -1) {
      this.layers.slice(idx, 1)
    }

    this.update()
  }

  public changeData(data: Data[]) {
    this.data = data
    this.update()
  }

  public changeConfig(config: Partial<ChartConfig>) {
    this.config = { ...this.config, ...config }
    this.update()
  }

  public dataKeys(): string[] {
    return r.uniq(getCol('dataKey', this.layers))
  }

  public layersData() {
    const values = this.dataKeys().reduce((arr, key) => arr.concat(getCol(key, this.data)), [])
    return Array.from(new Set(values))
  }

  public update() {
    const layersData = this.layersData()

    this.scales.updateRange(this.canvas, this.config.direction)
    this.scales.updateDomain(this.data, layersData)

    this.updates.value += 1
  }
}
