<template>
  <div id="app">
    <Chart :data="data" :config="config">
      <template #layers>
        <Line dataKey="pl" stroke="red" />
        <Line dataKey="avg" />
      </template>
    </Chart>
    <div>
      <button @click="add">Add Data</button>
      <button @click="updateConfig">Update Config</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { plByMonth } from '@/mockup'
import { ChartConfig } from '@/types'

export default defineComponent({
  name: 'App',
  setup() {
    const data = ref(plByMonth)
    const config = ref<Partial<ChartConfig>>({
      margin: {
        left: 40,
        top: 20,
        right: 20,
        bottom: 20
      },
      direction: 'horizontal'
    })

    function add() {
      const val = {
        name: 'Aug',
        pl: Math.random() * 1000,
        avg: Math.random() * 300
      }

      data.value = [...data.value, val]
    }

    function updateConfig() {
      const newConfig: Partial<ChartConfig> = {
        ...config.value,
        direction: config.value.direction === 'horizontal' ? 'vertical' : 'horizontal'
      }

      config.value = newConfig
    }

    return { data, config, add, updateConfig }
  }
})
</script>
