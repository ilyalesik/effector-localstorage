declare module "effector-localstorage" {
  interface Holder {
    init: (def?: any) => any
    onError: (handler: (err: any) => void) => Holder
    (storeValue: any): Holder
  }

  export default function connectLocalStorage(key: string): Holder
}
