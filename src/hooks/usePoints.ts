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
    const { x, y } = chart.scales
    const values = chart.data.map((d) => d[dataKey]) as number[]

    points.value = values.map((d, i) => {
      const p: Point = {
        x: (x(i.toString()) || 0) + x.bandwidth() / 2,
        y: y(d)
      }

      return p
    })

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
