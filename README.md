# effector-localstorage

[![npm version](https://img.shields.io/npm/v/effector-localstorage.svg)](https://www.npmjs.com/package/effector-localstorage)

Minimalistic (124 B) module for [effector](https://github.com/zerobias/effector) that sync stores with `localStorage`.

```javascript
import {createStore} from 'effector'
import connectLocalStorage from "effector-localstorage";


const counterLocalStorage = connectLocalStorage("counter")
  .onError((err) => console.log(err)) // setup error callback

const counter = createStore(counterLocalStorage.init() || 0) // initialize store with localStorage value
  .watch(counterLocalStorage.watcher) // update localStorage on every store change
  .on(increment, state => state + 1)
  .on(decrement, state => state - 1)
  .reset(resetCounter)
```


## Installation

Install it with yarn:

```
yarn add effector-localstorage
```

Or with npm:

```
npm i effector-localstorage --save
``` 

## Sponsored

<a href="https://lessmess.agency/?utm_source=effector-localstorage">
  <img src="https://lessmess.agency/badges/sponsored_by_lessmess.svg"
       alt="Sponsored by Lessmess" width="236" height="54">
</a>
