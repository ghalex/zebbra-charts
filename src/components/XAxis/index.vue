<template>
  <g :class="`layer-axis-x`" ref="el" :transform="`translate(0, ${height})`" />
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { select } from 'd3-selection'
import { axisBottom } from 'd3-axis'
import { useChart } from '@/hooks'

export default defineComponent({
  name: 'XAxis',
  props: {
    dataKey: {
      type: String,
      default: 'name'
    },
    domain: {
      type: Object as () => [string, string],
      default: () => ['dataMin', 'dataMax']
    }
  },
  setup(props) {
    const el = ref(null)
    const chart = useChart()
    const height = computed(() => {
      return chart.canvas.height
    })

    function drawAxis() {
      if (chart.data.length > 0) {
        const { bandScale } = chart.scales
        const ax: any = axisBottom(bandScale).tickFormat((_, index: number) => {
          return chart.data.map((x) => x[props.dataKey])[index] as string
        })

        select(el.value).call(ax)
      }
    }

    watch(chart.updates, () => {
      drawAxis()
    })

    return { el, height }
  }
})
</script>
