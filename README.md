# effector-localstorage
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors)

[![npm version](https://img.shields.io/npm/v/effector-localstorage.svg)](https://www.npmjs.com/package/effector-localstorage)

Minimalistic (111 B) module for [effector](https://github.com/zerobias/effector) that sync stores with `localStorage`.

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

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table>
  <tr>
    <td align="center"><a href="https://twitter.com/ilialesik"><img src="https://avatars2.githubusercontent.com/u/1270648?v=4" width="100px;" alt="Ilya Lesik"/><br /><sub><b>Ilya Lesik</b></sub></a><br /><a href="https://github.com/lessmess-dev/effector-localstorage/commits?author=ilyalesik" title="Code">💻</a></td>
    <td align="center"><a href="http://stackoverflow.com/users/388916/hubro"><img src="https://avatars0.githubusercontent.com/u/597206?v=4" width="100px;" alt="Tomas Sandven"/><br /><sub><b>Tomas Sandven</b></sub></a><br /><a href="https://github.com/lessmess-dev/effector-localstorage/commits?author=Hubro" title="Code">💻</a></td>
  </tr>
</table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!