<template>
  <g :class="`layer-${type}`">
    <slot />
  </g>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from 'vue'
import { useChart } from '@/hooks'

export default defineComponent({
  name: 'Layer',
  props: {
    type: {
      type: String,
      required: true
    },
    dataKey: {
      type: String,
      default: 'value'
    },
    color: {
      type: String
    }
  },
  setup(props) {
    const chart = useChart()
    // const { addLayer } = useLayers()

    onMounted(() => {
      chart.addLayer({ dataKey: props.dataKey, props: {} })
    })

    onUnmounted(() => {
      chart.removeLayer({ dataKey: props.dataKey, props: {} })
    })
    return {}
  }
})
</script>
