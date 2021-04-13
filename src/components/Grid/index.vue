<template>
  <g
    v-if="data.length"
    class="layer-grid"
    stroke="black"
    stroke-opacity="0.15"
    stroke-width="1"
    :stroke-dasharray="strokeDasharray"
  >
    <g class="grid-x" v-if="!hideX">
      <line v-for="(y, i) in xLines" :key="i" :x1="canvas.x" :y1="y" :x2="canvas.width" :y2="y" />
    </g>
    <g class="grid-y" v-if="!hideY">
      <line v-for="(x, i) in yLines" :key="i" :x1="x" :y1="canvas.y" :x2="x" :y2="canvas.height" />
    </g>
    <g>
      <line :x1="canvas.x" :y1="canvas.y" :x2="canvas.width" :y2="canvas.y" />
      <line :x1="canvas.width - 1" :y1="canvas.y" :x2="canvas.width - 1" :y2="canvas.height" />
    </g>
  </g>
</template>

<script lang="ts">
import { useChart } from '@/hooks'
import { Canvas, Data } from '@/types'
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'Grid',
  props: {
    strokeDasharray: {
      type: String,
      default: () => '3 3'
    },
    hideX: {
      type: Boolean,
      default: false
    },
    hideY: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const chart = useChart()
    const data = ref<Data[]>([])
    const canvas = ref<Canvas | null>(null)
    const xLines = ref<number[]>([])
    const yLines = ref<number[]>([])

    function updateXLines() {
      const { bandScale, linearScale } = chart.scales

      if (chart.config.direction === 'horizontal') {
        const ticks = linearScale.ticks(Math.round(chart.canvas.height / 60))
        xLines.value = ticks.map((v) => linearScale(v))
      } else {
        xLines.value = chart.data.map((_, i) => (bandScale(i.toString()) || 0) + bandScale.bandwidth() / 2)
      }
    }

    function updateYLines() {
      const { bandScale, linearScale } = chart.scales
      if (chart.config.direction !== 'horizontal') {
        const ticks = linearScale.ticks(Math.round(chart.canvas.height / 60))
        yLines.value = ticks.map((v) => linearScale(v))
      } else {
        yLines.value = chart.data.map((_, i) => (bandScale(i.toString()) || 0) + bandScale.bandwidth() / 2)
      }
    }

    watch(chart.updates, () => {
      data.value = chart.data
      canvas.value = chart.canvas

      updateXLines()
      updateYLines()
    })

    return { data, canvas, xLines, yLines }
  }
})
</script>
