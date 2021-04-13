<template>
  <div class="zb-chart">
    <svg :width="size.width" :height="size.height" :viewBox="`0 0 ${size.width} ${size.height}`">
      <slot name="layers" />
      <x-axis />
    </svg>
    <slot name="widgets" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, provide, watch } from 'vue'
import { ChartConfig, Data } from '@/types'
import { Chart } from '@/models'
import XAxis from '../XAxis/index.vue'

export default defineComponent({
  name: 'Chart',
  components: { XAxis },
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

    return { size: chart.config.size }
  }
})
</script>

<style>
.zb-chart svg {
  border: 1px solid red;
}
</style>
