# Решение некоторых задач https://leetcode.com/studyplan/30-days-of-javascript/

____________________________________________________________

### Endless curry with Proxy
```js
function curry(fn) {
    return function curried(...args1) {
        const proxy = new Proxy(() => {}, {
            apply: (target, thisArg, args2) => {
                if (args2.length === 0) {
                    return fn(...args1);
                } else {
                    return curried(...args1, ...args2);
                }
            }
        });
        return proxy;
    };
}

function sum(...args) {
    return args.reduce((acc, val) => acc + Number(val), 0);
}

const csum = curry(sum);
console.log(csum(1)(2)(2)(4)(1)(1)());
```


### Undefined to NULL deep
```ts
type JSONValue = null | boolean | number | string | JSONValue[] | { [key: string]: JSONValue };
type Value = undefined | null | boolean | number | string | Value[] | { [key: string]: Value };

type Obj1 = Record<string, Value> | Array<Value>
type Obj2 = Record<string, JSONValue> | Array<JSONValue>

function isPlainObject(value) {
  return typeof value === 'object' && 
         value !== null && 
         Object.prototype.toString.call(value) === '[object Object]';
}
    
function undefinedToNull(obj: Obj1): Obj2 {
	const getItem = (input: Obj1 | Value) => {
        if (isPlainObject(input)) {
            for (const key in input as Obj1) {
                input[key] = getItem(input[key]);
            }

            return input as Obj2;
        } else if (Array.isArray(input)) {
            for (let i = 0; i < input.length; i++) {
                input[i] = getItem(input[i]);
            }
            
            return input as JSONValue[];
        } else {
            return input === undefined ? null : input
        }
    }

    return getItem(obj) as Obj2
};

/**
 * undefinedToNull({"a": undefined, "b": 3}) // {"a": null, "b": 3}
 * undefinedToNull([undefined, undefined]) // [null, null] 
 */

```


### Custom interval with formula
```ts

const customIntervalModule = (() => {
    let id = 0;
    const idsMap = new Map<number, NodeJS.Timeout>(); 

    function customInterval(fn: Function, delay: number, period: number): number {
        let count = 0;
        let thisId = id++;

        function interval() {
            const timerId = setTimeout(() => {
                fn();
                interval();
            }, delay + period * count);

            count++;
            idsMap.set(thisId, timerId);
        }

        interval();

        return thisId;
    }

    function customClearInterval(id: number): void {
        const timerId = idsMap.get(id);
        if (timerId) {
            clearTimeout(timerId);
            idsMap.delete(id);
        }
    }

    return {
        customInterval,
        customClearInterval
    };
})();

const customInterval = customIntervalModule.customInterval;
const customClearInterval = customIntervalModule.customClearInterval;



Input: delay = 50, period = 20, cancelTime = 225
Output: [50,120,210]

Explanation:
const t = performance.now()  
const result = []
        
const fn = () => {
	result.push(Math.floor(performance.now() - t))
}

const id = customInterval(fn, delay, period)        

setTimeout(() => {
    customClearInterval(id)
}, 225)

// 50 + 20 * 0 = 50 // 50ms - 1st function call
// 50 + 20 * 1 = 70 // 50ms + 70ms = 120ms - 2nd function call
// 50 + 20 * 2 = 90 // 50ms + 70ms + 90ms = 210ms - 3rd function call
```


### Objects diff
```ts
function objDiff(obj1: any, obj2: any): any {
    if (obj1 === obj2) return {};
    if (obj1 === null || obj2 === null) return [obj1, obj2];
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return [obj1, obj2];
    if (Array.isArray(obj1) !== Array.isArray(obj2)) return [obj1, obj2];

    const returnObject = {};
    for (const key in obj1) {
        if (key in obj2) {
            const subDiff = objDiff(obj1[key], obj2[key]);
            if (Object.keys(subDiff).length > 0) {
                returnObject[key] = subDiff;
            }
        }
    }
    return returnObject;
}

```


### allSettled
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled
```ts
type FulfilledObj = {
    status: 'fulfilled';
    value: string;
}
type RejectedObj = {
    status: 'rejected';
    reason: string;
}
type Obj = FulfilledObj | RejectedObj;

function promiseAllSettled(functions: Function[]): Promise<Obj[]> {
    let count = 0;
    const len = functions.length;

    return new Promise((resolve) => {
        const results = new Array(len);

        for (let i = 0; i < len; i++) {
            functions[i]()
            .then((res) => {
                results[i] = {status: 'fulfilled', value: res};
                count++;
            }).catch((err) => {
                results[i] = {status:"rejected", reason:"Error"};
                count++;
            }).finally(() => {
	            if (count === len) resolve(results);
			});
        }
    });
};


/**
 * const functions = [
 *    () => new Promise(resolve => setTimeout(() => resolve(15), 100))
 * ]
 * const time = performance.now()
 *
 * const promise = promiseAllSettled(functions);
 *              
 * promise.then(res => {
 *     const out = {t: Math.floor(performance.now() - time), values: res}
 *     console.log(out) // {"t":100,"values":[{"status":"fulfilled","value":15}]}
 * })
 */
```



### [Promise Time Limit](https://leetcode.com/problems/promise-time-limit/)
```ts
type Fn = (...params: any[]) => Promise<any>;

function timeLimit(fn: Fn, t: number): Fn {
	return async function(...args) {
        return new Promise(async (resolve, reject) => {
            const timeoutId = setTimeout(() => {
                return reject('Time Limit Exceeded');
            }, t);

            try {
                const result = await fn(...args);
                return resolve(result);
            } catch(e) {
                return reject(e);
            } finally {
                clearTimeout(timeoutId);
            }
        })
    }
};

/**
 * const limited = timeLimit((t) => new Promise(res => setTimeout(res, t)), 100);
 * limited(150).catch(console.log) // "Time Limit Exceeded" at t=100ms
 */

function timeLimit(fn: Fn, t: number): Fn {
	return async function(...args) {
	    return new Promise((resolve, reject) => {
	      const timeout = setTimeout(() => {
	        reject("Time Limit Exceeded");
	      }, t);
	      
	      fn(...args)
	        .then(resolve)
	        .catch(reject)
	        .finally(() => clearTimeout(timeout));
	    })
  }
};

var timeLimit = function(fn, t) {
  return async function(...args) {
    const timeLimitPromise = new Promise((resolve, reject) => {
      setTimeout(() => reject("Time Limit Exceeded"), t)
    });
    const returnedPromise = fn(...args);
    return Promise.race([timeLimitPromise, returnedPromise]);
  }
};

```


### Debounce
```ts
type F = (...args: number[]) => void

function debounce(fn: F, t: number): F {
    let currentTimeoutId = null;

    return function(...args) {
        clearTimeout(currentTimeoutId);

        currentTimeoutId = setTimeout(() => {
            fn(...args);
        }, t);
    }
};

const debounce2 = (fn, ms) => {
  let timeout;
  
  return function () {
    const fnCall = () => {
	    fn.apply(this, arguments)
	}
    clearTimeout(timeout);
    timeout = setTimeout(fnCall, ms)
  };
}

/**
 * const log = debounce(console.log, 100);
 * log('Hello'); // cancelled
 * log('Hello'); // cancelled
 * log('Hello'); // Logged at t=100ms
 */
```


### PromiseAll
```ts
type Fn<T> = () => Promise<T>

function promiseAll<T>(functions: Fn<T>[]): Promise<T[]> {
    return new Promise((resolve, reject) => {
        const results = new Array(functions.length);
        let donePromisesCount = 0;
        
        functions.forEach(async (func, index) => {
            try {
                results[index] = await func();
                donePromisesCount++;
                if (donePromisesCount === functions.length) {
                    resolve(results);
                }
            } catch (e) {
                reject(e);
            }
        });
    })
};
```


### [Promise Pool](https://leetcode.com/problems/promise-pool/)
```ts
type F = () => Promise<any>;

async function promisePool(functions: F[], n: number): Promise<any> {
    return new Promise((resolve) => {
        if (functions.length === 0) {
            return resolve(Date.now());
        }

        const inputFuncs = [...functions];
        let unhandled = functions.length;
        let pool = n;

        const launchPromise = () => {
            if (inputFuncs.length > 0 && pool > 0) {
                pool--;
                const promise = inputFuncs.shift();
                promise().then(() => {
                    pool++;
                    unhandled--;
                    launchPromise();

                    if (unhandled === 0) {
                        resolve(Date.now());
                    }
                });
            }
        };

        for (let i = 0; i < n && i < functions.length; i++) {
            launchPromise();
        }
    })
};

/**
 * const sleep = (t) => new Promise(res => setTimeout(res, t));
 * promisePool([() => sleep(500), () => sleep(400)], 1)
 *   .then(console.log) // After 900ms
 */
```
