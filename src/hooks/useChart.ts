import { Chart } from '@/models'
import { inject } from 'vue'

export default () => {
  const chart = inject<Chart>('chart', new Chart([], {}))
  return chart
}
