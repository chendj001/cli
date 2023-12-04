const process = require('child_process')
const fs = require('fs')
const path = require('path')
const deps = require('./deps/index')

const config = {
  maxLength: 20,
  fillString: ' '
}

async function autoInstall(dependencies) {
  for (let i = 0; i < dependencies.length; i++) {
    let item = dependencies[i]
    const { name, install } = item
    for (let j = 0; j < install.length; j++) {
      let depName = install[j]
      await new Promise((resolve) => {
        process.exec(`cnpm install ${depName} -D`, (error) => {
          if (!error) {
            log(
              `${name.padEnd(
                config.maxLength,
                config.fillString
              )}${depName.padEnd(
                config.maxLength * 2,
                config.fillString
              )} 安装成功`
            )
          } else {
            log(
              `${name.padEnd(
                config.maxLength,
                config.fillString
              )}${depName.padEnd(
                config.maxLength * 2,
                config.fillString
              )} 安装失败🙇‍♂️`,
              '#ffffff'
            )
          }
          resolve(true)
        })
      })
    }
  }
}

/**
 * 打印输出
 * @param str
 * @param color
 */
function log(str, color = '#ff0000') {
  const coloredStr = `\x1b[38;2;${parseInt(color.slice(1, 3), 16)};${parseInt(
    color.slice(3, 5),
    16
  )};${parseInt(color.slice(5), 16)}m${str}\x1b[0m`
  console.log(coloredStr)
}
function copy(origin, dist) {
  // 判断 origin 是否为目录
  const originStats = fs.statSync(origin)
  if (originStats.isDirectory()) {
    // 创建目标目录
    fs.mkdirSync(dist, { recursive: true })
    // 读取原始目录中的所有文件
    const files = fs.readdirSync(origin)
    // 遍历所有文件
    for (const file of files) {
      const originFilePath = path.join(origin, file)
      const distFilePath = path.join(dist, file)
      // 判断文件类型
      const stats = fs.statSync(originFilePath)
      if (stats.isFile()) {
        // 如果是文件，则进行复制
        fs.copyFileSync(originFilePath, distFilePath)
      } else if (stats.isDirectory()) {
        // 如果是目录，则递归调用复制函数
        copy(originFilePath, distFilePath)
      }
    }
  } else if (originStats.isFile()) {
    // 如果 origin 是文件，则直接进行复制
    fs.copyFileSync(origin, dist)
  }
}

const scss = (dist='./') => {
  copy('./template', dist)
}

const run = () => {
  // scss()
  autoInstall(deps)
}
run()
