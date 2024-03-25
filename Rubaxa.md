# exercises

____________________________________________________________
## Решение некоторых задач http://rubaxa.github.io/playground/#romannumbers

### RLE-сжатие

```javascript
/**
 * Реализовать RLE-сжатие: AAAB -> A3B, BCCDDDAXXXX -> BC2D3AX4
 * @param  {string} value
 * @return {string}
 */
 
// 1 ВАРИАНТ
function rle(value) {
    if (value === '') {
        return '';
    }
    
    const charsArray = value.split('');
    let resultString = charsArray[0];
    charsArray.reduce((prevData, currChar) => {
        let {prevChar, lastCount} = prevData;
        if (prevChar !== currChar) {
            if (lastCount && lastCount > 1) {
                resultString += lastCount
            }
        
            resultString += currChar;
            lastCount = 1;
        } else {
            lastCount += 1;
        }
        
        return {prevChar: currChar, lastCount: lastCount || count}
    });
    
    return resultString;
}

// 2 ВАРИАНТ
function rle(value) {
    if (!value) {
        return ''
    }
    
    let prevIndex = 0;
    let currentIndex = prevIndex + 1;
    const lenght = value.length;
    
    let result = '';
    let counter = 1;
    
    
    while (prevIndex <= lenght) {
        if (value[prevIndex] === value[currentIndex]) {
            counter++;
        } else {
            result += value[prevIndex];
            
            if (counter > 1) {
                result += counter;
                counter = 1;
            }
        }
        
        prevIndex++;
        currentIndex++;
    }
    
    return result;
}

// 3 ВАРИАНТ
function rle(value) {
    if (!value) {
        return '';
    }
    
    let result = '';
    let counter = 1;
    
    for (let i = 0; i < value.length; i++) {
        if (value[i] === value[i + 1]) {
            counter++;
        } else {
            result += value[i];
            if (counter > 1) {
                result += counter;
            }
            counter = 1;
        }
    }
    
    return result;
}

console.log(rle('BCCDDDAXXXX'))
console.log(rle('AVVVBBBVVXDHJFFFFDDDDDDHAAAAJJJDDSLSSSDDDD'));
```


### Анаграммы
```javascript
/**
 * Получения двумерный массив анаграмм из произвольного массива слов
 * @param   {string[]} list
 * @returns {Array<[string, string]>}
 */
 
function sortedString(str) {
    return str.split('').sort().join('');
}

// 1 ВАРИАНТ
function getAnagrams(list) {
    const anagramMap = {};
    
    list.forEach((word) => {
        const sortedWord = sortedString(word);
        if (!anagramMap[sortedWord]) {
            anagramMap[sortedWord] = [word];
        } else {
            anagramMap[sortedWord].push(word);
        }
    });

    const resultArray = Object.values(anagramMap).filter((anagramGroup) => anagramGroup.length > 1);

    return resultArray;
}

// 2 ВАРИАНТ
function getAnagrams(list) {
    let resultArray = [];
    list.forEach((word, wordIndex) => {
        const sortedWord = sortedString(word);
        
        list.slice(wordIndex + 1).forEach((checkWord, checkWordIndex) => {
            const sortedCheckWord = sortedString(checkWord);
            
            if (sortedWord === sortedCheckWord) {
                resultArray.push([word, checkWord]);
            }
        });
    });
    
    return resultArray;
}



const inputList = [
	'кот', 'пила', 'барокко',
	'стоп', 'ток', 'кошка',
	'липа', 'коробка', 'пост',
];

// Проверка (лучше смотреть в консоль)
console.log(getAnagrams(inputList));
// [
//   ['кот', 'ток'],
//   ['пила', 'липа'],
//   ['барокко', 'коробка'],
//   ['стоп', 'пост'],
// ]

```


### Скобки
```js
/**
 * Проверка на сбалансированность фигурных скобкок
 * @param  {string}  input
 * @return {boolean}
 */
// 1 ВАРИАНТ
function isBalanced(input) {
    const leftBacket = '{';
    const rightBracket = '}';
    
    let leftBackets = [];
    let rightBrackets = [];
    
    input.split('').forEach((bracket) => {
        if (bracket === leftBacket) {
            leftBackets.push(bracket);
        } else if (bracket === rightBracket) {
            rightBrackets.push(bracket);
        } else {
            return false;
        }
    });

    return leftBackets.length === rightBrackets.length;
}

// 2 ВАРИАНТ
function isBalanced(input) {
    const stack = [];

    const left = '{';
    const right = '}';

    for (let char of input) {
        if (char === left) {
            stack.push(char);
        } else if (char === right) {
            if (stack.pop() !== left) {
                return false;
            }
        }
    }

    return stack.length === 0;
}

console.log('balanced:', isBalanced('{{}{}}{}')); // true
console.log('not balanced:', isBalanced('{}{{}')); // false
```


### Сжатие массива
```javascript
/** Сжатие целочисленного массива */
// 1 ВАРИАНТ
function zip(...values) {
    const newValues = values.sort((a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    });
        
    const resultArray = [];
    
    let openOfStack;
    let lastOfStack;
    newValues.push(0);
    values.reduce((prevNumb, nextNumb) => {
        if (prevNumb + 1 === nextNumb) {
            if (typeof openOfStack !== 'number') {
                console.log(prevNumb)
                openOfStack = prevNumb;
            }
        } else {
            lastOfStack = prevNumb;
            resultArray.push(
                typeof openOfStack === 'number' ? `${openOfStack}-${lastOfStack}` : lastOfStack
            );
            openOfStack = null;
        }
        return nextNumb;
    });
    
    return resultArray.join(',');
}

// 2 ВАРИАНТ
function zip(...values) {
    const array = values.sort((a, b) => a - b);
    console.log(array)
    let result = '';
    
    let temp = '';
    for (let i = 0; i < values.length; i++) {
        if (values[i] + 1 === values[i + 1]) {
            if (!temp.length) temp += values[i] + '-';
        } else {
            if (temp.length) {
                temp += values[i];
                result += temp + `${i === values.length - 1 ? '' : ','}`;
                
                temp = '';
            } else {
                result += values[i] + `${i === values.length - 1 ? '' : ','}`;
            }
        }
    }
    
    return result;
}

console.log(zip(3, 2, 1, 5, 6, -1, 10)); // "-1,1-3,5-6,10"

```


### Кастомный size у массива
```javascript
// Реализовать свойство `size`  у всех массивов,
// которое работало бы точно так же, как и `length`.

Object.defineProperty(Array.prototype, 'size', {
    get: function() { return this.length; },
    set: function(newLen) { this.length = newLen; }
});


// #1
console.log([0, 1].size); // 2

// #2
var arr = [0, 1, 2];
arr.size = 0;
console.log(arr); // []
```


### Debounce
```js
const debounce = (fn, ms) => {
  let timeout;
  return function () {
    const fnCall = () => { fn.apply(this, arguments) }
    clearTimeout(timeout);
    timeout = setTimeout(fnCall, ms)
  };
}

function onChange(e) {
  console.log(e.target.value);
}

onChange = debounce(onChange, 200);

document.getElementById('search').addEventListener('keyup', onChange);
```


### Найти пересечение двух массивов
```js
/**
 * Найти пересечение двух массивов
 * @param  {number[]} left
 * @param  {number[]} right
 * @return {number[]}
 */
function intersection(left, right) {
    const rightSet = new Set(right);
    return left.filter((num) => rightSet.has(num));
}

function intersection(left, right) {
    const leftSet = new Set(left);
    const rightSet = new Set(right);

    return [...leftSet].filter((num) => rightSet.has(num));
}

console.log(intersection(
	[1, 2, 3, 4, 5],
	[2, 8, 3]
));
```


### Палиндром
```js
/**
 * Является ли строка палиндромом
 * @param  {string}  value
 * @return {boolean}
 */
 
 function isChar(char) {
     return char.toUpperCase() !== char.toLowerCase()
 }

// 1 ВАРИАНТ
function isPalindrome(value) {
    const str = value.toLowerCase();
    let start = 0;
    let end = str.length - 1;
    
    while (start < end) {
        const startChar = str[start];
        const endChar = str[end];
        
        if (!isChar(startChar)) {
            start++;
            continue;
        }
        
        if (!isChar(endChar)) {
            end--;
            continue;
        }
        
        if (startChar === endChar) {
            start++;
            end--;
            continue;
        } else {
            return false;
        }
    }
    
    return true;
}

// 2 ВАРИАНТ
function isPalindrome(value) {
    const str = value.toLowerCase().replace(/[^a-z]/g, '');
    const len = str.length;
    
    for (let i = 0; i < Math.floor(len / 2); i++) {
        if (str[i] !== str[len - i - 1]) {
            return false;
        }
    }
    
    return true;
}

console.log(isPalindrome('abcd')); // false
console.log(isPalindrome('A man a plan a canal Panama'));// true

```


### Обратная польская нотация
```js
/**
 * Реализовать функцию суммирования
 * @param  {string} input
 * @return {number}
 */
 
 function doOp(left, right, operation) {
     switch (operation) {
        case '+':
             return left + right;
        case '-':
             return left - right;
             
        case '*':
             return left * right;
             
        case '/':
             return left / right;
     }
 }
 
 
function calc(input) {
    const array = input.split(' ');
    const stack = [];
    
    array.forEach((item) => {
        if (Number(item)) {
            stack.push(Number(item));
        } else {
            const right = stack.pop();
            const left = stack.pop();
            stack.push(doOp(left, right, item))
        }
    })
    
    return stack.pop();
}


console.log(calc('4 7 + 1 -')); // (4 + 7) - 1 = 10
console.log(calc('3 6 8 * + 10 -')); // 3 + (6 * 8) - 10 = 41
```


### Получение свойства объекта
```js
/**
 * Получение свойства объекта
 * @param {object} src
 * @param {string} path
 */
// 1 ВАРИАНТ
function get(src, path) {
    const paths = path.split('.');
    
    let field = src;
    
    for (let i = 0; i < paths.length; i++) {
        const p = paths[i];
        
        if (p in field) {
            field = field[p];
        } else {
            return undefined;
        }
    }
    
    return field;
}

// 2 ВАРИАНТ (Лучшее решение)
function get(src, path) {
	if (typeof src !== 'object' || typeof path !== 'string') {
		return undefined;
	}
	
    return path.split('.').reduce((acc, currentValue) => {
        console.log(acc, currentValue)
        return acc && acc[currentValue];
    }, src);
}

var fixture = {
	foo: {
		bar: [
			{qux: 'bingo'},
		],
	},
};

// Проверка
console.log(get(fixture, 'foo.bar.0.qux') === 'bingo');
console.log(get(fixture, 'unknown.foo.bar'));
console.log(get(fixture, 'foo'));

```


### Пропущенное значение в не отсортированном массиве
```js
/**
 * Найти пропущеное значение в неотсортированном массиве.
 * @param  {number[]} values
 * @return {boolean}
 */
function missing(values) {
    const numbersSet = new Set(values);
    
    if (!numbersSet.size) {
        return undefined;
    }
    
    for (let i = 1; i < values.length + 1; i++) {
        if (!numbersSet.has(i)) {
            return i;
        }
    }
    
    return undefined;
}

console.log(missing([1, 4, 3])); // 2
console.log(missing([5, 1, 4, 2])); // 3
console.log(missing([1, 2, 3, 4])); // undefined
```


### XMap
```js
/**
 * Реализовать свой Map
 * @constructor
 */
// 1 ВАРИАНТ
function XMap() {
    const keys = [];
    const values = [];

    return {
        set: (key, value) => {
            const index = keys.indexOf(key);
            if (index === -1) {
                keys.push(key);
                values.push(value);
            } else {
                values[index] = value;
            }
        },

        get: (key) => {
            const index = keys.indexOf(key);
            if (index === -1) {
                return undefined;
            }
            return values[index];
        },

        has: (key) => {
            return keys.indexOf(key) !== -1;
        },

        remove: (key) => {
            const index = keys.indexOf(key);
            if (index !== -1) {
                keys.splice(index, 1);
                values.splice(index, 1);
            }
        },
    };
}

// 2 ВАРИАНТ
function XMap() {
    const store = {};
    const objectKeys = new WeakMap();

    const getHash = (obj) => {
        if (objectKeys.has(obj)) {
            return objectKeys.get(obj);
        }

        const hash = Date.now() + Math.random().toString(36);
        objectKeys.set(obj, hash);
        return hash;
    };

    return {
        set: (key, value) => {
            if (typeof key === 'object') {
                const hash = getHash(key);
                store[hash] = value;
            } else {
                store[key] = value;
            }
        },
        
        get: (key) => {
            if (typeof key === 'object') {
                const hash = getHash(key);
                return store[hash];
            }
            return store[key];
        },
        
        has: (key) => {
            if (typeof key === 'object') {
                const hash = getHash(key);
                return store.hasOwnProperty(hash);
            }
            return store.hasOwnProperty(key);
        },
        
        remove: (key) => {
            if (typeof key === 'object') {
                const hash = getHash(key);
                delete store[hash];
            } else {
                delete store[key];
            }
        },
    }
}

// Проверка
const map = new XMap();
const objKey = {foo: true};

map.set(123, 'ok');
map.set(objKey, 'fail');
map.has(objKey) && map.set(objKey, 'wow');

console.log(map.get(123)); // "ok"
console.log(map.get(objKey)); // "wow"

map.remove(123);
console.log(map.has(123)); // false

```


### Перенос нулей в конец
```js
/**
 * Перенос нулей в конец массива
 * @param  {number[]} input
 * @return {number[]}
 */
function zsort(input) {
    let index = 0;
    for (let i = 0; i < input.length; i++) {
        if (input[i] !== 0) {
            input[index++] = input[i];
        }
    }
    
    // Второй проход: заполняем оставшиеся позиции нулями
    for (let i = index; i < input.length; i++) {
        input[i] = 0;
    }
    
    return input;
}


// Проверка
console.log(zsort([1, 0, 2, 3, 0, 4, 0])); // [1, 2, 3, 4, 0, 0, 0]
```


### Фибоначчи
```js
/**
 * Напишите функцию, которая возвращает n-ую запись в последовательности,
 * где n — это число, которое вы передаёте в качестве аргумента функции.
 * @param   {number} n
 * @returns {number}
 */
// Не рекурсия
function fibonacci1(n) {
    let left = 0;
    let right = 1;
    
    let temp = right;
    
    while (n > 0) {
        temp = right;
        right = left + right;
        left = temp;
        n--;
    }
    
    return left;
}

// Рекурсия
function fibonacci(n, memo = {}) {
    if (n in memo) return memo[n];
    if (n === 0) return 0;
    if (n <= 2) return 1;
    
    memo[n] = fibonacci(n-1, memo) + fibonacci(n-2, memo);
    console.log(n, memo)
    
    return memo[n];
}

console.log('3 ->', fibonacci(3)); // 2
console.log('7 ->', fibonacci(7)); // 13

// 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55

```


### Min max
```js
var inputData = '1, -5.8 или 10, хотя 34 + -5.3 и 73';


/**
 * Найти min/max в произвольной строке
 * @param   {String} входные данные
 * @returns {{min:Number, max:Number}}  объект
 */
function getMinMax(string) {
    const numbers = string.match(/-?\d+(\.\d+)?/g).map(Number);
    
    return {
        min: Math.min(...numbers),
        max: Math.max(...numbers),
    };
}


console.log(getMinMax(inputData));

```


### Cols
```js
/**
 * Вывод чисел в колонках
 * @param   {Number}  max    от 0 до max
 * @param   {Number}  cols   количество колонок
 * @returns {String}
 */
function getRange(length, callback) {
    var values = [];

    for (var i = 0; i <= length; i++) {
        values.push(i);
    }

    callback(values);
}

var printNumbers = function (max, cols) {
    getRange(max, function (values) {
        let arrayofarrays = [];
        let tempArray = [];
        
        const rows = Math.ceil(max / cols);
        
        for (let i = 0; i < values.length; i++) {
            if (tempArray.length === rows || i + 1 === values.length) {
                arrayofarrays.push(tempArray);
                tempArray = [];
                tempArray.push(values[i]);
            } else {
                tempArray.push(values[i]);
            }
        }
        
        console.log('arrayofarrays', arrayofarrays)
        
        let arrayofarrays2 = [];
        tempArray = [];
        
        let index = 0;
        
        while (arrayofarrays2.length < rows) {
	        for (let i = 0; i < arrayofarrays.length; i++) {
            if (tempArray.length === cols) {
                arrayofarrays2.push(tempArray);
                index++;
                
                tempArray = [];
                tempArray.push(arrayofarrays[i][index])
            } else {
                tempArray.push(arrayofarrays[i][index])
            }
        }
        }
        
        console.log('arrayofarrays2', arrayofarrays2)
    });
};

console.log(printNumbers(12, 3));
/*
Пример работы:
0 4 8
1 5 9
2 6 10
3 7 11
*/


```


 ------------------------------------------------------------------------

#общее


### Async reduce
```javascript
/**
 * Асинхронный reduce
 * @param  {any[]}    input
 * @param  {Function} iterator
 * @param  {any} initialValue
 * @return {Promise}
 */
// 1 ВАРИАНТ
function asyncReduce(input, iterator, initialValue) {
    return Promise.all(
        input.reduce(
            (acc, elem) => {
                return iterator(acc, elem())
                
            },
            initialValue,
        )
    );
}

// 2 ВАРИАНТ
function asyncReduce(input, iterator, initialValue) {
    return Promise.all(
        input.reduce(
            (acc, elem) => {
                console.log('acc :', acc);
                console.log('elem: ', elem)
                return iterator(acc, elem())
                
            },
            [Promise.resolve(...initialValue)],
        )
    );
}

// 3 ВАРИАНТ
async function asyncReduce(input, iterator, initialValue) {
    return input.reduce(async (accPromise, currentFunc) => {
        const acc = await accPromise;
        const currentValue = await currentFunc();
        return iterator(acc, currentValue);
    }, Promise.resolve(initialValue));
}


// 4 ВАРИАНТ
async function asyncReduce(input, iterator, initialValue) {
  let accumulator = initialValue;

  for (let i = 0; i < input.length; i++) {
    accumulator = await iterator(accumulator, await input[i]());
  }

  return accumulator;
}


let a = () => Promise.resolve('a');
let b = () => Promise.resolve('b');
let c = () => new Promise(resolve => setTimeout(() => resolve('c'), 100));

asyncReduce(
	[a, c, b],
	(acc, value) => [...acc, value],
	['d']
).then(results => {
	console.log(results); // ['d', 'a', 'c', 'b'];
});

```


### WATERFALL
```js
function waterfall(...functions) {
    let counter = 0;
    
    function next(result) {
        if (counter === functions.length) {
            return;
        }
        
        const fn = functions[counter++];
        if (fn.length === 1) {
            const value = fn(result);
            next(value);
        } else {
            fn(result, next);
        }
    }
    
    const firstResult = functions[counter++]();
    next(firstResult);
}


waterfall(
	function () {
		return 10;
	},
	function (val, done) {
		setTimeout(function () {
		    console.log('done', val)
			done(val + 5);
		}, 100);
	},
	function (val) {
		return val * 2;
	},
	function (val) {
		console.log('CONSOLE LOG', val); // 30
	}
);

```

