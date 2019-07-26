import axios from 'axios'
import qs from 'qs'

let host = process.env.NODE_ENV === 'production' ? '' : '/api'

// 服务端渲染时走不到代理，填'/api'会404
if (process.server) {
  host = 'http://bosstest.goglbo.com'
}

// receive store and data by options
axios.interceptors.response.use(
  response => {
    // console.log('response', response)
    var { data } = response
    // 未登陆和在其他设备上登陆
    if (data.code === 9003 || data.code === 9002) {
      window.sessionStorage.clear()
    }
    if (data.code === 9999) {
      console.log('接口请求失败')
    }
    if (data.isShowMessage) {
      if (data.code === 10000) {
        console.log(data.message)
      } else {
        console.log(data.message)
      }
    }
    return response
  },
  error => {
    /* eslint-disable no-console */
    return error
  }
)

var callApi = config => {
  let newConfig = {
    ...config,
    headers: {
      'token': process.client ? window.sessionStorage.getItem('token') : '',  // 服务端渲染无window对象
      'sysLanguageId': 2,
      'osInfo': '5', // 网页
      'Content-Type': 'application/x-www-form-urlencoded',
      ...config.headers
    }
  }
  return axios(newConfig).then(response => ({ response: response.data })).catch(error => ({ error: error }))
}

var formDataInitParams = data => {
  if (!data) return '{}'
  for (let item in data) {
    if (typeof (data[item]) === 'object') {
      data[item] = JSON.stringify(data[item])
    }
  }
  return data
}

/**
 * 公用get请求
 * @param url       接口地址
 * @param msg       接口异常提示
 * @param headers   接口所需header配置
 * withCredentials: true 是否开启跨域cors跨域设置
 */
var createdConfig = ({ url, data, headers, others, config }, method) => callApi({
  url: `${host}${config.prefix}${config.version}${config.afterfix}${url}`,
  method: method,
  params: method === 'GET' ? qs.stringify(data) : '',
  data: method !== 'GET' ? qs.stringify(data) : '',
  withCredentials: true,
  others,
  headers
})

export const get = (params) => {
  params.data = formDataInitParams(params.data)
  return createdConfig(params, 'GET')
}

export const post = (params) => {
  params.data = formDataInitParams(params.data)
  return createdConfig(params, 'POST')
}

export const put = (params) => {
  params.data = formDataInitParams(params.data)
  return createdConfig(params, 'PUT')
}

export const del = (params) => {
  params.data = formDataInitParams(params.data)
  return createdConfig(params, 'DELETE')
}
