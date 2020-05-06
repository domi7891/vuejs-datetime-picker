var d = 'hhhh'
// console.log(d.getTime())

var ok = d && Object.prototype.toString.call(d) === '[object Date]' && !isNaN(d)
console.log(ok)
