// https://juejin.im/post/5c9477ad6fb9a070ce31b050
const resolve = dir => require('path').join(__dirname, dir)

module.exports = {
  resolve: {
    alias: {
      '@': resolve('src')
    }
  }
}
