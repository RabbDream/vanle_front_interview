## 二分查找总结
二分查找的前提是数组是已经**排序**好的,常用的场景有:

①查找一个数是否存在当前数组中 

②查找一个数插入到当前数组中,应该插入的位置

③查找一个数在当前数组中出现的左侧边界

④查找一个数在当前数组中出现的右侧边界

二分查找的框架为:
```h
function binarySearch(arr, target){
  let left = 0
  let right = arr.length - 1
  while(left <= right){
    // left + (right - left) 可以有效防止left + right 太大导致溢出
    let mid = Math.floor(left + (right - left) / 2)
    if(arr[mid] === target){
      ...
    }else if(arr[mid] > target){
      right = ...
    }else{
      left = ...
    }
  }
  return ...
}
```
## 思考,对于二分查找,有些细节问题我们需要思考
①为什么right = arr.length - 1,而不是right = arr.length?

答: 其实这两种赋值都是可以的,二分查找归根到底就是查找索引区间[0, arr.length-1]的值,只不过因为数组是排序的,所以有些区间是不需要一个个进行比对就能得到结果的,如果我们设置right = arr.length -1,那么我们设置while循环的结束条件就应该是left <= right,此时二分查找的索引区间为[left, right],才能保证查找是正确的,所以不管right设置为arr.length-1还是arr.length,只要保证查找区间是[0, arr.length-1]就可以了,而查找区间是在while循环中确定的,所以设置不同的right,相应的需要改变不同的while循环条件

②为什么while循环的结束条件是left <= right?

答: while循环的结束条件是二分查找的区间必须为[0,arr.length - 1],所以根据初始化right的不同值,可以设置不同的循环条件,只要查找区间唯一即可

③为什么求中间索引是mid = Math.floor(left + (right - left)/2)?

答: 这是为了避免left + right相加过大导致溢出

④为什么在循环过程中会出现left = mid + 1或者right = mid - 1边界的赋值?

答: 因为一开始因为处理过了arr[mid]===target,此时mid索引已经查找过了,故在下面赋值的时候可以排除mid索引

### 场景一: 查找一个数是否存在当前数组中,如果存在,返回其索引,否则返回-1
```h
function binarySearch(arr, target){
  let left = 0
  let right = arr.length - 1
  while(left <= right){
    let mid = Math.floor(left + (right - left) / 2)
    if(arr[mid] === target){
      return mid
    }else if(arr[mid] > target){
      right = mid - 1
    }else{
      left = mid + 1
    }
  }
  return -1
}
```

### 场景二:查找一个数插入到当前数组中,应该插入的位置

```h
function binarySearch(arr,target){
  let left = 0
  let right = arr.length - 1
  while(left <= right){
    let mid = Math.floor(left + (right - left)/2)
    if(arr[mid] === target){
      return mid
    }else if(arr[mid]>target){
      right = mid - 1
    }else {
      left = mid + 1
    }
  }
  return left
}
```

### 场景三: 查找一个数在当前数组中出现的左侧边界
```h
function binarySearch(arr,target){
  let left = 0
  let right = arr.length - 1
  while(left <= right){
    let mid = Math.floor(left + (right - left)/2)
    if(arr[mid] === target){
      right = mid - 1
    }else if(arr[mid]>target){
      right = mid - 1
    }else {
      left = mid + 1
    }
  }
  // [2,3,4,5] 1 和 [2,3,4,5]  6两种特殊情况,left分别返回0和4,此时处理一下边界未找到返回-1,即可
  if(arr[left] !== target || left >= arr.length) return -1
  return left
}
```

### 场景四: 查找一个数在当前数组中出现的右侧边界
```h
function binarySearch(arr,target){
  let left = 0
  let right = arr.length - 1
  while(left <= right){
    let mid = Math.floor(left + (right - left)/2)
    if(arr[mid] === target){
      left = mid + 1
    }else if(arr[mid]>target){
      right = mid - 1
    }else {
      left = mid + 1
    }
  }
  // [2,3,4,5] 1 和 [2,3,4,5]  6两种特殊情况,right分别返回0和4,此时处理一下边界未找到返回-1,即可
  if(arr[right] !== target || right < 0) return -1
  return right
}
```