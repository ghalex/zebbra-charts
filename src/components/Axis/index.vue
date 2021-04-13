<template>
  <g v-if="position === 'bottom'" :class="`layer-axis-x`" ref="el" :transform="`translate(0, ${canvas.height})`" />
  <g v-else :class="`layer-axis-y`" ref="el" :transform="`translate(${canvas.x}, 0)`" />
</template>

<script lang="ts">
import * as r from 'ramda'
import { computed, defineComponent, ref, watch } from 'vue'
import { select } from 'd3-selection'
import { axisBottom, axisLeft } from 'd3-axis'
import { format } from 'd3-format'
import { useChart } from '@/hooks'

export default defineComponent({
  name: 'Axis',
  props: {
    type: {
      type: String as () => 'band' | 'linear',
      default: 'band'
    },
    position: {
      type: String as () => 'bottom' | 'left',
      default: 'bottom'
    },
    dataKey: {
      type: String,
      default: 'name'
    },
    ticks: {
      type: Number,
      default: -1
    },
    tickValues: {
      type: Array,
      default: () => null
    },
    format: {
      type: [String, Function],
      default: ',.0f'
    }
  },
  setup(props) {
    const el = ref(null)
    const chart = useChart()
    const formatFn = r.is(String, props.format) ? format(props.format as string) : (props.format as any)
    const axis = computed(() => {
      return props.position === 'bottom' ? axisBottom : axisLeft
    })
    const canvas = computed(() => {
      return chart.canvas
    })

    function drawBandAxis() {
      if (chart.data.length > 0) {
        const { bandScale } = chart.scales
        const ax: any = axis.value(bandScale).tickFormat((_, index: number) => {
          return chart.data.map((val) => val[props.dataKey])[index] as string
        })

        select(el.value).call(ax)
      }
    }

    function drawLinearAxis() {
      if (chart.data.length > 0) {
        const { linearScale } = chart.scales
        const ax: any = axis.value(linearScale).tickFormat(formatFn)

        if (props.ticks > -1) {
          ax.ticks(props.ticks)
        } else if (props.tickValues) {
          ax.tickValues(props.tickValues)
        } else {
          ax.ticks(Math.round(chart.canvas.height / 60))
        }

        select(el.value).call(ax)
        return ax
      }

      return null
    }

    function draw() {
      if (props.type === 'band') {
        drawBandAxis()
      }

      if (props.type === 'linear') {
        drawLinearAxis()
      }
    }

    watch(
      () => props.type,
      () => {
        draw()
      }
    )

    watch(chart.updates, () => {
      draw()
    })

    return { el, canvas }
  }
})
</script>
