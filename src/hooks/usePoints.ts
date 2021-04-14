import { ref, Ref, watch } from 'vue'
import { Point } from '@/types'
import * as r from 'ramda'
import useChart from './useChart'

interface Return {
  points: Ref<Point[]>
}

export default (dataKeys: [string, string]): Return => {
  const points = ref<Point[]>([])
  const chart = useChart()

  function updatePoints() {
    const [primaryKey, secondaryKey] = dataKeys
    const {
      scales: { primary, secondary },
      data
    } = chart

    const primaryVals = primary.map(data.map((d) => d[primaryKey])).filter((val) => !isNaN(val))
    const secondaryValues = secondary.map(data.map((d) => d[secondaryKey])).filter((val) => !isNaN(val))

    if (primaryVals.length === secondaryValues.length) {
      if (chart.config.direction === 'horizontal') {
        points.value = r.zipWith((x, y) => ({ x, y }), primaryVals, secondaryValues)
      } else {
        points.value = r.zipWith((x, y) => ({ x, y }), secondaryValues, primaryVals)
      }
    }
  }

  watch(
    chart.updates,
    () => {
      updatePoints()
    },
    { immediate: true }
  )

  return {
    points
  }
}
