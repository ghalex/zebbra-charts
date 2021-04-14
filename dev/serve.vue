<template>
  <div id="app">
    <div>
      <Chart :data="data" :axis="axis" :margin="margin" :direction="direction">
        <template #layers>
          <Grid strokeDasharray="2,2" />
          <Bar :dataKeys="['name', 'pl']" fill="red" />
          <Bar :dataKeys="['name', 'avg']" />
          <Line :dataKeys="['name', 'avg']" type="step" />
        </template>
      </Chart>
      <div>
        <button @click="add">Add Data</button>
        <button @click="updateConfig">Update Config</button>
      </div>
    </div>
    <div>
      <Chart
        :data="data2"
        :axis="{ primary: { type: 'linear', domain: ['0', 'dataMax'] } }"
        :margin="margin"
        :direction="direction"
      >
        <template #layers>
          <Grid strokeDasharray="2,2" />
          <Line :dataKeys="['nbOfTrades', 'pl']" type="monotone" />
        </template>
      </Chart>
      <div>
        <button @click="test">Test</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { plByMonth, trades } from '@/mockup'
import * as r from 'ramda'
export default defineComponent({
  name: 'App',
  setup() {
    const data = ref(plByMonth)
    const data2 = ref(r.sortBy(r.prop('nbOfTrades'), trades))

    console.log(data2.value)
    const direction = ref('horizontal')
    const margin = ref({
      left: 0,
      top: 20,
      right: 20,
      bottom: 0
    })

    const axis = ref({
      primary: {
        type: 'band',
        //tickValues: ['Jan', 'Feb', 'Jul'],
        format: (val: string) => {
          if (val === 'Feb') {
            return '😜'
          }

          return val
        }
      },
      secondary: {
        domain: ['dataMin -100', 'dataMax + 100'],
        type: 'linear',
        // ticks: 8,
        tickValues: [-800, 0, 500, 1500, 3000],
        format: (val: string) => {
          return val
        }
      }
    })

    function add() {
      const val = {
        name: 'Aug',
        pl: Math.random() * 3000,
        avg: Math.random() * 1000
      }

      data.value = [...data.value, val]
    }

    function updateConfig() {
      direction.value = direction.value === 'horizontal' ? 'vertical' : 'horizontal'
    }

    function test() {
      console.log('click me')
    }

    return { data, data2, axis, margin, direction, add, updateConfig, test }
  }
})
</script>
