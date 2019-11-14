declare module "effector-localstorage" {
  interface Holder {
    init: (value?: any) => any
    onError: (handler: (err: any) => void) => Holder
    onChange: (event: (value: any) => any) => Holder
    (storeValue: any): Holder
  }

  export default function connectLocalStorage(key: string, storage?: Storage): Holder
}
