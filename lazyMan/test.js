const obj = {
  a: '11',
  b: '22',
  c: '33'
}
JSON.stringify(obj, (key, value) => {
  console.log(key, value)
})
