import { ref, Ref, watch } from 'vue'
import { Point } from '@/types'
import useChart from './useChart'

interface Return {
  points: Ref<Point[]>
}

export default (dataKey: string): Return => {
  const points = ref<Point[]>([])
  const chart = useChart()

  function updatePoints() {
    const { bandScale, linearScale } = chart.scales
    const values = chart.data.map((d) => d[dataKey]) as number[]

    if (chart.config.direction === 'horizontal') {
      points.value = values.map((d, i) => {
        const p: Point = {
          x: (bandScale(i.toString()) || 0) + bandScale.bandwidth() / 2,
          y: linearScale(d)
        }

        return p
      })
    } else {
      points.value = values.map((d, i) => {
        const p: Point = {
          x: linearScale(d),
          y: (bandScale(i.toString()) || 0) + bandScale.bandwidth() / 2
        }

        return p
      })
    }

    console.log(points.value)
  }

  watch(chart.updates, () => {
    updatePoints()
  })

  // onMounted(() => {
  //   updatePoints()
  // })

  return {
    points
  }
}
