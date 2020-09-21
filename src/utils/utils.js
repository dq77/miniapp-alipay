/**
 * 工具 js
 */

function urlSplit(url) {
  if (url.indexOf('?') !== -1) {
    return url.split('?')[0]
  } else {
    return url
  }
}

function delElByIndex(arr, index) {
  for (var i = index, len = arr.length - 1; i < len; i++) arr[i] = arr[i + 1]
  arr.length = len
  return arr
}

// 优惠券单位格式化
function formartUnit(unit) {
  switch (unit) {
    case 'YEAR':
      return '年'
    case 'MONTH':
      return '月'
    case 'DAY':
      return '天'
    case 'HOUR':
      return '小时'
    case 'MINUTE':
      return '分钟'
  }
}

function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }

  console.log('time1', time)
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    console.log('time2', time)
    date = time
  } else {
    console.log('time3', time)
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)

    console.log('time3', date)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

function couponUnitFilte(val) {
  switch(val) {
    case 'DAY':
      return '天'
    case 'MINUTE':
      return '分钟'
    case 'HOUR':
      return '小时'
  }
}

export { urlSplit, delElByIndex, formartUnit, parseTime, couponUnitFilte }
