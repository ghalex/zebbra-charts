import * as r from 'ramda'

export const kebabCase = r.pipe(r.toLower, r.split(' '), r.join('-'))
export const getCol = r.curry((col: string, df: any[]): any[] => r.map(r.prop(col), df))
