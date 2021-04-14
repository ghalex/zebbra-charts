import { Ref, ref } from 'vue'

export default class MyClass {
  updates: Ref<number> = ref(0)

  constructor(_: any, __: any) {
    console.log('created')
  }
}
