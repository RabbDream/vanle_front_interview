

 let fs = require("fs")
 let readable = fs.createReadStream("t.txt",{
   flags:"r",
   encoding:"utf-8"
 })
 let writable = fs.createWriteStream("t1.txt",{
   flags:"a",
   encoding:"utf-8"
 })
 if(readable.pipe(writable)){
  console.log("文件复制成功")
 }else{
   console.log("文件复制失败")
 }