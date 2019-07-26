import { post } from '@/common/js/utilApi'

import { mainApiConfig, version } from '@/config'
let config = {
  prefix: mainApiConfig.prefix,
  version: version,
  afterfix: mainApiConfig.afterfix
}

const postWithConfig = params => post({
  ...params,
  config
})

export const loadLogin = data => postWithConfig({
  url: '/user/login',
  data: {
    checkCode: data.checkCode,
    account: data.account,
    password: data.password,
    checkToken: data.checkToken
  }
})

export const loadImgCode = data => postWithConfig({
  url: '/user/getImgCode',
  data: {
    time: data.time
  }
})