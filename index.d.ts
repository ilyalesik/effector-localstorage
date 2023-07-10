import type { Store, Unit } from 'effector'

declare module 'effector-nanostorage' {
  export default function persist<T>(config: {
    store: Store<T>
    key: string
    def?: T
    fail?: Unit<any>
    sync?: boolean
  }): void
}
