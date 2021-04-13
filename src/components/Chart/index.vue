<template>
  <div class="zb-chart">
    <svg
      :width="size.width"
      :height="size.height"
      :viewBox="`0 0 ${size.width} ${size.height}`"
      @mousemove="onMouseMove"
      @mouseout="onMouseOut"
    >
      <slot name="layers" />
      <axis :type="direction === 'horizontal' ? 'band' : 'linear'" position="bottom" />
      <axis :type="direction === 'horizontal' ? 'linear' : 'band'" position="left" />
    </svg>
    <slot name="widgets" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, provide, watch, ref, reactive } from 'vue'
import { ChartConfig, Data } from '@/types'
import { Chart } from '@/models'
import { pointer } from 'd3-selection'
import Axis from '../Axis/index.vue'

export default defineComponent({
  name: 'Chart',
  components: { Axis },
  props: {
    data: {
      type: Object as () => Data[],
      default: []
    },
    config: {
      type: Object as () => Partial<ChartConfig>,
      default: {}
    }
  },
  setup(props) {
    const chart = new Chart(props.data, props.config)
    const size = ref({ width: 500, height: 400 })
    const direction = ref(props.config.direction)
    const mouse = reactive({
      index: -1,
      position: { x: 0, y: 0 },
      hover: false
    })

    provide('chart', chart)
    provide('chartMouse', mouse)

    // Data change
    watch(
      () => props.data,
      () => {
        chart.changeData(props.data)
      },
      { immediate: true }
    )

    // Config change
    watch(
      () => props.config,
      () => {
        chart.changeConfig(props.config)

        size.value = chart.config.size
        direction.value = chart.config.direction
      }
    )

    onMounted(() => {
      console.log('mounted')
    })

    onUnmounted(() => {
      console.log('unmounted')
    })

    function onMouseOut() {
      mouse.index = -1
      mouse.hover = false
    }

    function onMouseMove(e: MouseEvent) {
      mouse.hover = true
      mouse.position = { x: pointer(e)[0], y: pointer(e)[1] }

      const { bandScale } = chart.scales
      const band = bandScale.bandwidth()

      let delta = mouse.position.x - chart.canvas.x

      if (chart.config.direction === 'vertical') {
        delta = mouse.position.y - chart.canvas.y
      }

      mouse.index = Math.round((delta + band / 2) / band) - 1
    }

    return { size, direction, onMouseMove, onMouseOut }
  }
})
</script>

<style>
.zb-chart svg {
  border: 1px solid red;
}
</style>
