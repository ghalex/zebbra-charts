import { ref, watch } from 'vue'
import { Rectangle } from '@/types'
import useChart from './useChart'

export default (dataKey: string, props = { maxWidth: 100 }): any => {
  const bars = ref<Rectangle[]>([])
  const chart = useChart()

  function updateBars() {
    const gap = 10
    const values = chart.data.map((d) => d[dataKey]) as number[]
    const { bandScale, linearScale } = chart.scales
    const maxWidth = Math.min(bandScale.bandwidth() - gap, props.maxWidth)

    // const barLayers = layers.value.filter((l) => l.type === 'bar')
    const index = 0 // barLayers.findIndex((l) => l.dataKey === dataKey)
    const barWidth = maxWidth // barLayers.length > 0 ? maxWidth / barLayers.length : maxWidth
    const diff = (bandScale.bandwidth() - gap - maxWidth) / 2

    bars.value = values.map((val, i) => {
      let r: Rectangle
      if (val >= 0) {
        if (chart.config.direction === 'horizontal') {
          r = {
            x: diff + (bandScale(i.toString()) || 0) + index * barWidth + gap / 2,
            y: linearScale(val),
            width: barWidth,
            height: linearScale(0) - linearScale(val),
            props: { x: i, y: val, data: chart.data[i] }
          }
        } else {
          console.log(linearScale(0))
          r = {
            x: linearScale(0),
            y: diff + (bandScale(i.toString()) || 0) + index * barWidth + gap / 2,
            width: linearScale(val) - linearScale(0),
            height: barWidth,
            props: { x: i, y: val, data: chart.data[i] }
          }
        }
      } else {
        if (chart.config.direction === 'horizontal') {
          r = {
            x: diff + (bandScale(i.toString()) || 0) + index * barWidth + gap / 2,
            y: linearScale(0),
            width: barWidth,
            height: linearScale(val) - linearScale(0),
            props: { x: i, y: val, data: chart.data }
          }
        } else {
          r = {
            x: linearScale(val),
            y: diff + (bandScale(i.toString()) || 0) + index * barWidth + gap / 2,
            width: linearScale(0) - linearScale(val),
            height: barWidth,
            props: { x: i, y: val, data: chart.data }
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
