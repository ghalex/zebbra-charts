<template>
  <div class="zb-chart">
    <svg :width="canvas.width" :height="canvas.height" :viewBox="`0 0 ${canvas.width} ${canvas.height}`">
      <slot name="layers" />
    </svg>
    <slot name="widgets" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, provide, watch } from 'vue'
import { ChartConfig, Data } from '@/types'
import { Chart } from '@/models'
// import { useChartConfig } from '@/hooks'

export default defineComponent({
  name: 'Chart',
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
    provide('chart', chart)

    watch(
      () => props.data,
      () => {
        chart.changeData(props.data)
      },
      { immediate: true }
    )

    onMounted(() => {
      console.log('mounted')
    })

    onUnmounted(() => {
      console.log('unmounted')
    })

    return { canvas: chart.canvas }
  }
})
</script>

<style>
.zb-chart svg {
  border: 1px solid red;
}
</style>
