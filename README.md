# effector-localstorage

[![npm version](https://img.shields.io/npm/v/effector-localstorage.svg)](https://www.npmjs.com/package/effector-localstorage)

Minimalistic (130 B) module for [effector](https://github.com/zerobias/effector) that sync stores with `localStorage`.

```javascript
import {createStore, createEvent} from 'effector'
import connectLocalStorage from "effector-localstorage";

const increment = createEvent('increment')
const decrement = createEvent('decrement')
const resetCounter = createEvent('reset counter')

const counterLocalStorage = connectLocalStorage("counter")
  .onError((err) => console.log(err)) // setup error callback

const counter = createStore(counterLocalStorage.init(0)) // initialize store with localStorage value
  .on(increment, state => state + 1)
  .on(decrement, state => state - 1)
  .reset(resetCounter)
  
counter.watch(counterLocalStorage) // update localStorage on every store change
```
View example at [codesandbox](https://codesandbox.io/s/effector-localstorage-85czp) or [repository](/example).

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
