<template>
  <Layer type="line" :dataKey="dataKey" :color="stroke">
    <path
      :d="d"
      fill="none"
      class="path"
      :stroke="stroke"
      :stroke-width="strokeWidth"
      stroke-linejoin="round"
      stroke-linecap="round"
    />
    <g v-if="dot">
      <circle
        :fill="i === mouse.index ? dotActiveProps.fill : dotProps.fill"
        :stroke="i === mouse.index ? dotActiveProps.stroke : dotProps.stroke"
        :stroke-width="dotProps.strokeWidth"
        :r="i === mouse.index ? dotActiveProps.r : dotProps.r"
        v-for="(c, i) in points"
        :key="i"
        :cx="c.x"
        :cy="c.y"
      />
    </g>
  </Layer>
</template>

<script lang="ts">
import { computed, defineComponent, watch, ref } from 'vue'
import { line, curveLinear, curveStepAfter, curveNatural, curveMonotoneX, curveMonotoneY } from 'd3-shape'
import { Point } from '@/types'
import { useChart, useMouse, usePoints } from '@/hooks'
import Layer from '../Layer/index.vue'

export default defineComponent({
  name: 'Line',
  components: { Layer },
  props: {
    stroke: {
      type: String,
      default: '#8884d8'
    },
    strokeWidth: {
      type: Number,
      default: 2
    },
    dot: {
      type: Object,
      default: () => ({
        r: 3
      })
    },
    activeDot: {
      type: Object,
      default: () => ({
        r: 5
      })
    },
    dataKey: {
      type: String,
      default: 'value'
    },
    type: {
      type: String as () => 'normal' | 'step' | 'natural' | 'monotone',
      default: () => 'normal'
    }
  },
  setup(props) {
    const mouse = useMouse()
    const chart = useChart()
    const d = ref<string | null>('')
    const lineType = {
      normal: curveLinear,
      natural: curveNatural,
      step: curveStepAfter,
      monotone: curveMonotoneX
    }

    const { points } = usePoints(props.dataKey)

    function updateLine() {
      let type = lineType[props.type]

      if (props.type === 'monotone' && chart.config.direction === 'vertical') {
        type = curveMonotoneY
      }

      d.value = line<Point>()
        .x((p) => p.x)
        .y((p) => p.y)
        .curve(type)(points.value)
    }

    const dotProps = computed(() => ({
      stroke: props.stroke,
      strokeWidth: props.strokeWidth,
      fill: 'white',
      r: 3,
      ...props.dot
    }))

    const dotActiveProps = computed(() => ({
      ...dotProps.value,
      ...props.activeDot
    }))

    watch(points, () => updateLine())
    watch(chart.updates, () => updateLine())

    return { d, mouse, points, dotProps, dotActiveProps }
  }
})
</script>

<style scoped>
/* .path {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: dash 1s linear forwards;
}

@keyframes dash {
  to {
    stroke-dashoffset: 0;
  }
} */
</style>
