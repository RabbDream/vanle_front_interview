
# 1. let与const
### 1.1  不存在变量提升,即变量可以在声明之前使用,值为undefined
```h
// var 的情况
console.log(foo); // 输出undefined
var foo = 2;

// let 的情况
console.log(bar); // 报错ReferenceError
let bar = 2;
```

### 1.2  暂时性死区,只要块级作用域内存在let命令,它所声明的变量就绑定这个
```h
var tmp = 123;

if (true) {
  tmp = 'abc'; // ReferenceError
  let tmp;
}
```

### 1.3 不允许重复声明,不允许在相同作用域内,重复声明同一个变量
```h
// 报错
function func() {
  let a = 10;
  let a = 1;
}

function func(arg) {
  let arg;
}
func() // 报错
```

### 1.4  块级作用域,块级作用域都是单独的,内层作用域可以定义外层作用域的同名变量
```h
let a = "2"
if(true){
  let a = "1"
  console.log(a) //1
}
console.log(a)  //2
```

### 1.5  const声明一个只读的常量,一旦被声明,就必须立即初始化,并且不能被修改.但是const的实质是变量指向的那个内存地址所保存的数据不得变动,对应简单类型而言,内存地址等同常量,而对于复合类型而言,内存地址保存的只是一个指向实际数据的指针,该地址指向的数据是可变的
```h
const foo = {};

// 为 foo 添加一个属性，可以成功
foo.prop = 123;
foo.prop // 123

// 将 foo 指向另一个对象，就会报错
foo = {}; // TypeError: "foo" is read-only
```

# 2. 解构赋值
解构赋值的规则是，只要等号右边的值不是对象或数组，就先将其转为对象。由于undefined和null无法转为对象，所以对它们进行解构赋值，都会报错。

### 2.1 数组解构赋值,只要等号右边的数据具有Iterator接口,都可以采用数组形式的解构赋值

```h
let [x, y, z] = new Set(['a', 'b', 'c']);
x // "a"
```

在对解构赋值指定默认值时,判断一个位置是否有值用的是===,只有当一个数组成员严格等于undefined时,默认值才会生效.如果默认值是一个表达式,那么这个表达式是惰性求值的,即只有在用到的时候,才会求值
```h
let [x = 1] = [undefined];
x // 1

let [x = 1] = [null];
x // null

function f() {                       
  console.log('aaa'); 
}
let [x = f()] = [1];
// 只有当等号右侧严格等于undefined时,才会对函数f进行求值

let [x = 1, y = x] = [1, 2]; // x=1; y=2
let [x = y, y = 1] = [];     // ReferenceError: y is not defined
```

### 2.2 对象的解构赋值,对象的解构赋值的内部机制,是先找到同名属性,然后再赋值给对应的变量.真正被赋值的是后者,而不是前者
```h
let { foo, bar } = { foo: 'aaa', bar: 'bbb' };
foo // "aaa"
bar // "bbb"

let obj = { first: 'hello', last: 'world' };
let { first: f, last: l } = obj;
f // 'hello'
l // 'world'

let obj = {
  p: [
    'Hello',
    { y: 'World' }
  ]
};

let { p, p: [x, { y }] } = obj;
// 第二个p是模式,不会赋值,第一个p才是变量
x // "Hello"
y // "World"
p // ["Hello", {y: "World"}]

var {x = 3} = {x: undefined};
x // 3
var {x = 3} = {x: null};
x // null

let arr = [1, 2, 3];
let {0 : first, [arr.length - 1] : last} = arr;
first // 1
last // 3
```

### 2.3 字符串的解构赋值,对字符串进行解构赋值时,字符串被转换成了一个类似数组的对象
```h
const [a, b, c, d, e] = 'hello';
a // "h"
b // "e"
c // "l"
d // "l"
e // "o"
```

### 2.4 数值和布尔值的解构赋值,解构赋值时,如果等号右边是数值和布尔值,则会先转为对象
```h
let {toString: s} = 123;
s === Number.prototype.toString // true

let {toString: s} = true;
s === Boolean.prototype.toString // true
```

### 2.5 圆括号问题,解构赋值没办法知道一个式子到底是模式还是表达式,必须等到解析到等号才知道.所以尽量不要使用圆括号
```h
// 不能使用圆括号的情况
// 1.变量声明语句
// 全部报错
let [(a)] = [1];
let {x: (c)} = {};
let ({x: c}) = {};
// 2.函数参数
// 报错
function f([(z)]) { return z; }
// 报错
function f([z,(x)]) { return x; }
//  3.赋值语句的模式
// 全部报错
({ p: a }) = { p: 42 };
([a]) = [5];

// 可以使用圆括号的情况
// 赋值语句的非模式部分,可以使用圆括号
[(b)] = [3]; // 正确
({ p: (d) } = {}); // 正确
[(parseInt.prop)] = [3]; // 正确
```

# 3. 字符串
### 3.1 新增了对Unicode的支持,可以识别超过0xffff的数值
```h
'\z' === 'z'  // true
'\172' === 'z' // true
'\x7A' === 'z' // true
'\u007A' === 'z' // true
'\u{7A}' === 'z' // true es6新增,用于识别超过0xffff的数值
```

### 3.2 ES6为字符串添加了Iterator,使得字符串可以被for...of循环遍历,可以识别大于0xffff的码点,传统的for循环无法识别这样的码点
```h
let text = String.fromCodePoint(0x20BB7);

for (let i = 0; i < text.length; i++) {
  console.log(text[i]);
}
// " "
// " "

for (let i of text) {
  console.log(i);
}
// "𠮷"
```

### 3.3 模板字符串
```
function fn(){
  return 1
}
let a=2
let str = `this is ${fn()}+${a}` // this is 1+2
```

### 3.4 字符串的新增方法
```h
// ES5的String.fromCodePoint()无法识别码点大于0xFFFF的字符
String.fromCharCode(0x20BB7)   // "ஷ"

// ES6提供String.fromCodePoint()可以识别码点大于0xFFFF的字符
String.fromCodePoint(0x20BB7)   // "𠮷"

// String.raw()返回一个斜杠都被转义的字符串
String.raw`Hi\n${2+3}!`   // 实际返回 "Hi\\n5!"，显示的是转义后的结果 "Hi\n5!"

// codePointAt()能够正确处理4个字节存储的字符,返回一个字符的码点
// 对应unicode码点大于OxFFFF的字符,JavaScript会认为它们是两个字符,字符串长度会误判为2,而且charAt()方法无法读取整个字符,charCodeAt()方法只能分别返回前两个字节和后两个字节的值
let s = "𠮷";
s.length // 2
s.charAt(0) // ''
s.charAt(1) // ''
s.charCodeAt(0) // 55362
s.charCodeAt(1) // 57271
s.codePointAt(0) // 134071
s.codePointAt(1) // 57271

// normailze()用来将字符的不同表示方法统一为同样的形式
'\u01D1'==='\u004F\u030C' //false  Ǒ === Ǒ
'\u01D1'.normalize() === '\u004F\u030C'.normalize() //true

// includes:返回布尔值,表示十分找到了参数字符串
// startsWith():返回布尔值,表示参数字符串是否在原字符串的头部
// endsWith():返回布尔值,表示参数字符串是否在原字符串的尾部
let s = 'Hello world!';
s.startsWith('Hello') // true
s.endsWith('!') // true
s.includes('o') // true

//使用第二个参数n时,endsWith的行为与其他两个方法有所不同。它针对前n个字符，而其他两个方法针对从第n个位置直到字符串结束
s.startsWith('world', 6) // true
s.endsWith('Hello', 5) // true
s.includes('Hello', 6) // false

// repeat()方法返回一个新字符串,表示将原字符串重复n次
"x".repeat(3) // "xxx"
'na'.repeat(0) // ""
'na'.repeat(2.9) // "nana"   参数如果是小数,会被取整
'na'.repeat(Infinity) // RangeError Infinity会报错
'na'.repeat(-1) // RangeError 负数会报错
'na'.repeat(NaN) // "" 参数NaN等同于0
'na'.repeat(-0.9)  // ""  参数是0到-1之间的小数,等同于0,因为会先进行取整运算
'na'.repeat('na') // ""  参数是字符串,会先转换为数字
'na'.repeat('3') // "nanana"

//padStart()当字符串不够指定长度,用于头部补全
//padEnd()当字符串不够指定长度,用于尾部补全
'x'.padStart(5, 'ab') // 'ababx'
'x'.padEnd(5, 'ab') // 'xabab'
'xxx'.padStart(2, 'ab') // 'xxx'
'xxx'.padEnd(2, 'ab') // 'xxx'
'abc'.padStart(10, '0123456789')
'x'.padStart(4) // '   x'

// trimStart()用于消除字符串头部的空格,trinEnd()用于消除尾部的空格
const s = '  abc  ';
s.trim() // "abc"
s.trimStart() // "abc  "
s.trimEnd() // "  abc"

// matchAll()返回一个正则表达式在当前字符串的所有匹配
const string = 'test1test2test3';
const regex = /t(e)(st(\d?))/g;

for (const match of string.matchAll(regex)) {
  console.log(match);
}
// ["test1", "e", "st1", "1", index: 0, input: "test1test2test3"]
// ["test2", "e", "st2", "2", index: 5, input: "test1test2test3"]
// ["test3", "e", "st3", "3", index: 10, input: "test1test2test3"]

// replaceAll()替换所有的匹配
'aabbcc'.replaceAll('b', '_') // 'aa__cc'
```

# 4. 数值的扩展

### 4.1 Number类型新增的方法
```h
// Number.isFinite()用来检查一个数值是否为有限的,如果参数类型不是数值,一律返回false
Number.isFinite(NaN); // false
Number.isFinite(Infinity); // false
Number.isFinite('foo'); // false

// Number.isNaN()用来检查一个值是否为NaN,如果参数类型不是NaN,一律返回false
Number.isNaN(NaN) // true
Number.isNaN(15) // false

// Number.parseInt(),Number.parseFloat(),ES6将全局方法parseInt()和parseFloat()移植到Number上面,行为完全保持不变
Number.parseInt === parseInt // true
Number.parseFloat === parseFloat // true

// Number.isInteger() 用来判断一个数值是否为整数,如果对数据精度的要求较高,该方法可能会不正确
Number.isInteger(25) // true
Number.isInteger(25.1) // false
Number.isInteger(25.0) // true 因为整数和浮点数在JavaScript采用同样的存储方法
Number.isInteger('15') // false

// Number.EPSILON 表示1与大于1的最小浮点数之间的差,用于为浮点数计算时,设置误差范围
Number.EPSILON === Math.pow(2, -52) // true

// Number.isSafeInteger() 用来判断一个整数是否在-2^53到2^53之间
Number.MAX_SAFE_INTEGER === Math.pow(2, 53) - 1 // true
Number.MIN_SAFE_INTEGER === -Number.MAX_SAFE_INTEGER // true
Number.isSafeInteger(Number.MIN_SAFE_INTEGER - 1) // false
Number.isSafeInteger(Number.MIN_SAFE_INTEGER) // true
Number.isSafeInteger(Infinity) // false

// Math.trunc() 用于去除一个数的小数部分,返回整数部分,对于非数值,先使用Number方法转换,对于空值和无法截取整数的值,返回NaN
Math.trunc(4.1) // 4
Math.trunc(4.9) // 4
Math.trunc(-4.1) // -4
Math.trunc(-4.9) // -4
Math.trunc(-0.1234) // -0
Math.trunc('123.456') // 123
Math.trunc('foo');    // NaN

// Math.sign() 用于判断一个数到底是正数、负数、还是零.对于非数值,会先将其转换为数值
Math.sign(-5) // -1
Math.sign(5) // +1
Math.sign(0) // +0
Math.sign(-0) // -0
Math.sign(NaN) // NaN
Math.sign('9')  // +1

// Math.cbrt()方法用于计算一个数的立方根。对于非数值,会先将其转换为数值
Math.cbrt(-1) // -1
Math.cbrt(0)  // 0
Math.cbrt('8') // 2
Math.cbrt('hello') // NaN

// ** 指数运算符
2 ** 3 // 8
2 ** 3 ** 2  // 512  相当于 2 ** (3 ** 2)

// BigInt数据类型,现有的JavaScript数值类型的精度只能到53个二进制位,大于这个范围的整数,无法精确表示,故引用BigInt只用来表示整数,没有位数的限制,BigInt类型的数据必须添加后缀n
const b = 15n;
42n === 42 // false
typeof 123n // 'bigint'
BigInt('123') // 123n

```

# 5. 函数的扩展

### 5.1 箭头函数

```h
箭头函数有几个使用注意点:

(1) 函数体内的this对象,就是定义时所在的对象,而不是使用时所在的对象

(2) 不可以当做构造函数,也就是说,不可以使用new命令,否则会抛出一个错误

(3) 不可以使用arguments对象,该对象在函数体内不存在.如果要用,可以用rest参数代替

(4) 不可以使用yield命令,因此箭头函数不能用作Generator函数
```

### 5.2 尾调用优化

尾调用是指函数的最后一步是调用另一个函数
```h
箭头函数有几个使用注意点:

(1) 函数体内的this对象,就是定义时所在的对象,而不是使用时所在的对象

(2) 不可以当做构造函数,也就是说,不可以使用new命令,否则会抛出一个错误

(3) 不可以使用arguments对象,该对象在函数体内不存在.如果要用,可以用rest参数代替

(4) 不可以使用yield命令,因此箭头函数不能用作Generator函数

// 斐波拉契尾递归优化
function Fibonacci2 (n , ac1 = 1 , ac2 = 1) {
  if( n <= 1 ) {return ac2};

  return Fibonacci2 (n - 1, ac2, ac1 + ac2);
}
```

### 5.3 Function.prototype.toString()

toString()方法返回函数代码本身,以前会省略注释和空格,修改后的toString()方法,明确要求返回一模一样的原始代码
```h
function /* foo comment */ foo () {}

foo.toString()
// "function /* foo comment */ foo () {}"
```

# 6. 数组的扩展

### 6.1 扩展运算符,任何定义了Iterator接口的对象,都可以用扩展运算符转为真正的数组

```h
const a1 = [1, 2];
const a2 = [...a1];  [1,2] 浅拷贝

const arr1 = ['a', 'b'];
const arr2 = ['c'];
[...arr1, ...arr2, ...arr3]  // [ 'a', 'b', 'c',]  浅拷贝

[...'hello']  // [ "h", "e", "l", "l", "o" ]

let nodeList = document.querySelectorAll('div');
let array = [...nodeList];

let map = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);
let arr = [...map.keys()]; // [1, 2, 3]
```

### 6.2 数组的新增方法
```h
// Array.from() 用于将两类对象转换为真正的数组:类似数组的对象(array-like-object)和可遍历的(iterable)对象(包括ES6新增的数据结构Set和Map )
let arrayLike = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    length: 3
};
// ES5的写法
var arr1 = [].slice.call(arrayLike); // ['a', 'b', 'c']
// ES6的写法
let arr2 = Array.from(arrayLike); // ['a', 'b', 'c']
Array.from([1, 2, 3], (x) => x * x) // [1, 4, 9]
Array.from('hello') // ['h', 'e', 'l', 'l', 'o']

// Array.of() 用于将一组值,转换为数组
Array.of(3, 11, 8) // [3,11,8]

// Array.prototype.copyWithin(target, start = 0, end = this.length)
[1, 2, 3, 4, 5].copyWithin(0, 3) // [4, 5, 3, 4, 5]

// find() 用于找出第一个符合条件的数组成员
[1, 4, -5,,6, 10].find((n) => n < 0)  // -5

// findIndex() 返回第一个符合条件的数组成员的位置,如果所有成员都不符合条件,则返回-1
[1, 5, 10, 15].findIndex( (v) => v > 9) // 2
[NaN].indexOf(NaN)  // -1
[NaN].findIndex(y => Object.is(NaN, y))  // 0

// fill() 使用给定值,填充一个数组
['a', 'b', 'c'].fill(7) // [7, 7, 7]
['a', 'b', 'c'].fill(7, 1, 2)  // ['a', 7, 'c']

//entries(),keys(),values()  都用于遍历数组,返回一个遍历器(Iterator)对象,可以使用for...of进行遍历,唯一的区别是keys()是对键名的遍历、values()是对键值的遍历，entries()是对键值对的遍历。
for (let index of ['a', 'b'].keys()) {
  console.log(index);
}
// 0
// 1
for (let elem of ['a', 'b'].values()) {
  console.log(elem);
}
// 'a'
// 'b'
for (let [index, elem] of ['a', 'b'].entries()) {
  console.log(index, elem);
}
// 0 "a"
// 1 "b"

// includes() 返回一个布尔值,表示某个数组是否包含给定的值
[1, 2, 3].includes(2)     // true
[1, 2, 3].includes(3, 3);  // false  第二个参数表示搜索的起始位置

// flat() 将嵌套的数组拉平,返回一个新数组,对原数据没有影响
[1, 2, [3, [4, 5]]].flat() // [1, 2, 3, [4, 5]]
[1, [2, [3]]].flat(Infinity) // [1, 2, 3]
[1, 2, , 4, 5].flat() // [1, 2, 4, 5]

// flatMap() 对原数组的每个成员执行一个函数,然后对返回值组成的数组执行flat()方法.只能展开一层数组
[1, 2, 3, 4].flatMap(x => [[x * 2]]) // [[2], [4], [6], [8]]
[2, 3, 4].flatMap((x) => [x, x * 2]) // [2, 4, 3, 6, 4, 8]
```

### 6.3 数组的空位
```h
// forEach(), filter(), reduce(), every() 和some()都会跳过空位。
// map()会跳过空位，但会保留这个值
// join()和toString()会将空位视为undefined，而undefined和null会被处理成空字符串
// Array.from方法会将数组的空位，转为undefined
// 扩展运算符（...）也会将空位转为undefined。
// copyWithin()会连空位一起拷贝。
// fill()会将空位视为正常的数组位置。
// for...of循环也会遍历空位
// entries()、keys()、values()、find()和findIndex()会将空位处理成undefined。
// forEach方法
[,'a'].forEach((x,i) => console.log(i)); // 1

// filter方法
['a',,'b'].filter(x => true) // ['a','b']

// every方法
[,'a'].every(x => x==='a') // true

// reduce方法
[1,,2].reduce((x,y) => x+y) // 3

// some方法
[,'a'].some(x => x !== 'a') // false

// map方法
[,'a'].map(x => 1) // [,1]

// join方法
[,'a',undefined,null].join('#') // "#a##"

// toString方法
[,'a',undefined,null].toString() // ",a,,"

Array.from(['a',,'b']) // [ "a", undefined, "b" ]

[...['a',,'b']] // [ "a", undefined, "b" ]

[,'a','b',,].copyWithin(2,0) // [,"a",,"a"]

new Array(3).fill('a') // ["a","a","a"]

let arr = [, ,];
for (let i of arr) {
  console.log(1);
}
// 1
// 1

// entries()
[...[,'a'].entries()] // [[0,undefined], [1,"a"]]

// keys()
[...[,'a'].keys()] // [0,1]

// values()
[...[,'a'].values()] // [undefined,"a"]

// find()
[,'a'].find(x => true) // undefined

// findIndex()
[,'a'].findIndex(x => true) // 0
```

### 6.4 Array.prototype.sort()的排序稳定性
```h
// ES2019明确规定,Array.prototype.sort()的默认排序算法必须稳定
// 常见的排序算法之中，插入排序、合并排序、冒泡排序等都是稳定的，堆排序、快速排序等是不稳定的
```

# 7 对象的扩展

### 7.1 属性表达式和name属性
```h
// 属性名表达式如果是一个对象,默认情况下会自动将对象转为字符串[object Object]
const keyA = {a: 1};
const keyB = {b: 2};

const myObject = {
  [keyA]: 'valueA',
  [keyB]: 'valueB'
};

myObject // Object {[object Object]: "valueB"}

// 函数的name属性,返回函数名
const person = {
  sayName() {
    console.log('hello!');
  },
};

person.sayName.name   // "sayName"
```

### 7.2 属性的可枚举性

```h
// 对象的每个属性都有一个描述对象,用来控制该属性的行为,Object.getOwnPropertyDescriptor方法可以获取该属性的描述对象
let obj = { foo: 123 };
Object.getOwnPropertyDescriptor(obj, 'foo')
//  {
//    value: 123,  值
//    writable: true,  是否可写
//    enumerable: true,  是否可枚举
//    configurable: true  是否可配置
//  }
// 有四个操作会忽略enumerable为false的属性
// 1. for...in循环：只遍历对象自身的和继承的可枚举的属性。
// 2. Object.keys()：返回对象自身的所有可枚举的属性的键名。
// 3. JSON.stringify()：只串行化对象自身的可枚举的属性。
// 4. Object.assign()： 忽略enumerable为false的属性，只拷贝对象自身的可枚举的属性。
```

### 7.3 属性的遍历
```h
// ES6一共有5中方法可以遍历对象的属性
（1）for...in

for...in循环遍历对象自身的和继承的可枚举属性（不含 Symbol 属性）。

（2）Object.keys(obj)

Object.keys返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）的键名。

（3）Object.getOwnPropertyNames(obj)

Object.getOwnPropertyNames返回一个数组，包含对象自身的所有属性（不含 Symbol 属性，但是包括不可枚举属性）的键名。

（4）Object.getOwnPropertySymbols(obj)

Object.getOwnPropertySymbols返回一个数组，包含对象自身的所有 Symbol 属性的键名。

（5）Reflect.ownKeys(obj)

Reflect.ownKeys返回一个数组，包含对象自身的（不含继承的）所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举。

以上的 5 种方法遍历对象的键名，都遵守同样的属性遍历的次序规则。

首先遍历所有数值键，按照数值升序排列。
其次遍历所有字符串键，按照加入时间升序排列。
最后遍历所有 Symbol 键，按照加入时间升序排列。

Reflect.ownKeys({ [Symbol()]:0, b:0, 10:0, 2:0, a:0 })
// ['2', '10', 'b', 'a', Symbol()]
```

### 7.4 super关键字
```h
// super关键字指向当前对象的原型对象,只能用在对象的方法之中
const proto = {
  foo: 'hello'
};

const obj = {
  foo: 'world',
  // 正确
  find() {
    return super.foo;
  },
  // 报错
  find1:()=> super.foo,
  // 报错
  find2:function () {
    return super.foo
  }
};

Object.setPrototypeOf(obj, proto);
obj.find() // "hello"
```

### 7.5 链判断运算符

