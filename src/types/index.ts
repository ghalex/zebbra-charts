export interface Point {
  x: number
  y: number
}

export interface Margin {
  top: number
  right: number
  bottom: number
  left: number
}

export interface Size {
  width: number
  height: number
}

export interface Data {
  [key: string]: string | number
}

export type LayerType = 'bar' | 'line' | 'area' | 'points'

export interface Layer {
  dataKey: string
  props: any
}

export interface Canvas {
  x: number
  y: number
  width: number
  height: number
}

export interface ChartConfig {
  size: Size
  margin: Margin
  direction: 'horizontal' | 'vertical'
}
