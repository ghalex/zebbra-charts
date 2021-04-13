import { DefineComponent, Plugin } from 'vue'

declare const Lib: Exclude<Plugin['install'], undefined>
export default Lib

export const Chart: DefineComponent<{}, {}, any>
export const Layer: DefineComponent<{}, {}, any>
export const Line: DefineComponent<{}, {}, any>
export const Bar: DefineComponent<{}, {}, any>
export const Responsive: DefineComponent<{}, {}, any>
