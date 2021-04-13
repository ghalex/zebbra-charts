import { inject } from 'vue'

export default () => {
  const mouse = inject('chartMouse', {
    index: -1,
    position: { x: 0, y: 0 },
    hover: false
  })
  return mouse
}
