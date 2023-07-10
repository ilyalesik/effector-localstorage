import type { Store, Unit } from 'effector'

declare module 'effector-localstorage' {
  export default function persist<T>(config: {
    store: Store<T>
    key: string
    def?: T
    fail?: Unit<any>
    sync?: boolean
  }): void
}
