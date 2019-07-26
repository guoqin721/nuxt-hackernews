import Vue from 'vue'
import Vuex from 'vuex'

import { createState, createMutations, createActions } from '@/common/js/utilModules'
import * as type from './type'
import getters from './getters'
import resetAction from './resetAction'
import api from './api'
const modules = {}

Object.keys(type.default).forEach(key=>{
  console.log('type.default[key]', type.default[key])
  modules[key] = {
    namespaced : true,
    state: createState(type.default[key]),
    mutations: createMutations(type.default[key]),
    actions: createActions(type.default[key], api, resetAction[key]),
    getters: getters[key]
  }
})

console.log('modules', modules)
// import { loadLogin, loadImgCode } from "@/api/commonApi.js"

// const common = {
//   namespaced: true,
//   state: { 
//     login: {
//       data: {},
//       isLoading: false
//     },
//     imgCode: {
//       data: {},
//       isLoading: false
//     }
//   },
//   mutations: { 
//     loadLogin (state, payload = {}) {
//       state.login = {
//         ...state.login,
//         ...payload,
//       }
//     },
//     loadImgCode (state, payload = {}) {
//       state.imgCode = {
//         ...state.imgCode,
//         ...payload,
//       }
//     },
//   },
//   actions: {
//     async fetchLoadLogin ({ commit, state }, params) {
//       commit('login', { isLoading: true })
//       let res = await loadLogin(params)
//       commit('login', { data: res.response.data, isLoading: false })
//       return res
//     },
//     async fetchLoadImgCode ({ commit, state }, params) {
//       commit('imgCode', { isLoading: true })
//       let res = await loadImgCode(params)
//       commit('imgCode', { data: res.response.data, isLoading: false })
//       return res
//     }
//   },
//   getters: {

//   }
// }

Vue.use(Vuex)
export default function () {
  return new Vuex.Store({
    modules: modules
  })
}