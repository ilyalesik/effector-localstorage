import type { Store, Event, Effect } from 'effector'

declare module 'effector-localstorage' {
  export default function persist<T>(config: {
    store: Store<T>
    key: string
    def?: T
    fail?: Event<any> | Effect<any, any>
    sync?: boolean
  }): void
}
