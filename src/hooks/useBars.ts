import * as r from 'ramda'
import { Ref, ref, watch } from 'vue'
import { Rectangle } from '@/types'
import useChart from './useChart'

export interface BarsReturn {
  bars: Ref<Rectangle[]>
}

export default (dataKeys: [string, string], props = { maxWidth: 100 }): BarsReturn => {
  const bars = ref<Rectangle[]>([])
  const chart = useChart()

  function updateBars() {
    const gap = 10
    const [primaryKey, secondaryKey] = dataKeys
    const { primary, secondary } = chart.scales
    const bandScale = primary.type === 'band' ? primary : secondary
    const linearScale = primary.type === 'band' ? secondary : primary

    const primaryVals = chart.data.map((d) => d[primaryKey]) as number[]
    const secondaryVals = chart.data.map((d) => d[secondaryKey]) as number[]

    const maxWidth = Math.min(bandScale.bandwidth() - gap, props.maxWidth)
    const barLayers = chart.getLayers('bar')
    const index = barLayers.findIndex((l) => l.dataKeys.join(',') === dataKeys.join(','))
    const barWidth = barLayers.length > 0 ? maxWidth / barLayers.length : maxWidth
    const diff = (bandScale.bandwidth() - gap - maxWidth) / 2

    bars.value = r.zip(primaryVals, secondaryVals).map(([a, b], i) => {
      let r: Rectangle
      if (chart.config.direction === 'horizontal') {
        if (b > 0) {
          r = {
            x: diff + bandScale.scale(a) + index * barWidth + gap / 2,
            y: linearScale.scale(b),
            width: barWidth,
            height: linearScale.scale(0) - linearScale.scale(b),
            props: { x: a, y: b, data: chart.data[i] }
          }
        } else {
          r = {
            x: diff + bandScale.scale(a) + index * barWidth + gap / 2,
            y: linearScale.scale(0),
            width: barWidth,
            height: linearScale.scale(b) - linearScale.scale(0),
            props: { x: a, y: b, data: chart.data[i] }
          }
        }
      } else {
        if (b > 0) {
          r = {
            x: linearScale.scale(0),
            y: diff + bandScale.scale(a) + index * barWidth + gap / 2,
            width: linearScale.scale(b) - linearScale.scale(0),
            height: barWidth,
            props: { x: a, y: b, data: chart.data[i] }
          }
        } else {
          r = {
            x: linearScale.scale(b),
            y: diff + bandScale.scale(a) + index * barWidth + gap / 2,
            width: linearScale.scale(0) - linearScale.scale(b),
            height: barWidth,
            props: { x: a, y: b, data: chart.data[i] }
          }
        }
      }

      return r
    })
  }

  watch(chart.updates, () => updateBars())

  return {
    bars
  }
}
