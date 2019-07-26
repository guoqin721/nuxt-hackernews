// 需要创建非对象的state,需要传入对应的数据类型
// 比如说创建一个初始值是数组的state
// list:{data:[], isLoading: false}
// 需要使用数组包裹。数组第二个字为数据类型，如 export const TEST = ['TEST', 'Array']
// 支持Array， String, Null, Number(默认为0)
// 默认不传，不需要用数组包裹，默认创建一个对象的state, 如 info:{data:{}}

// 前缀是LOAD_,会默认创建一个包含isLoading的state，如 list:{data:[], isLoading: false}，否者创建为token:{data:{}}

// -----华丽的分割线----

// 简单的存储tokne
export const TOKEN = 'TOKEN'
// 获取登录信息
export const LOAD_LOGIN = 'LOAD_LOGIN'
// 获取验证码信息
export const LOAD_IMG_CODE = 'LOAD_IMG_CODE'
// 一个列表
export const LOAD_SOME_LIST = ['LOAD_SOME_LIST', 'Array']