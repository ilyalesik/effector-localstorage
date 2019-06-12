import React from "react";
import ReactDOM from "react-dom";

import {createStore, createEvent} from 'effector'
import connectLocalStorage from "../";
import {useStore} from "effector-react";

const increment = createEvent('increment')
const decrement = createEvent('decrement')
const resetCounter = createEvent('reset counter')

const counterLocalStorage = connectLocalStorage("counter")
    .onError((err) => console.log(err))

const counter = createStore(counterLocalStorage.init() || 0)
    .on(increment, state => state + 1)
    .on(decrement, state => state - 1)
    .on(resetCounter, () => null)

counter.watch(counterLocalStorage)

const App = () => {
    const result = useStore(counter);

    return <div>
        <p>Count: {result}</p>
        <button onClick={increment}>+1</button>
        <button onClick={decrement}>-1</button>
        <button onClick={resetCounter}>reset</button>
    </div>
};


if (root) {
    ReactDOM.render(
        <App />,
        document.getElementById("root")
    );
}
