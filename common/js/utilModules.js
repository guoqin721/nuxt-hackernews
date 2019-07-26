import { isArray, has, camelCase } from 'lodash';

// 创建state
export const createState = (types = {}) => {
    let state = {};
    let keys = Object.values(types);
    keys.forEach(key => {
        let stateName = '';
        let type = 'Object';
        if (isArray(key)) {
            stateName = key[0];
            type = key[1];
        } else {
            stateName = key;
        }
        let stateItem = creatItemState(stateName, type);
        state[stateItem.name] = stateItem.obj;
    });
    return { ...state };
};

const creatItemState = (stateName, type) => {
    let haveLoading = /^LOAD/.test(stateName)
    let stateData = stateType(type)
    let stateItem = {name: '', obj:{}}
    if(haveLoading){
        stateItem.obj.data = stateData
        stateItem.obj.isLoading = false
    }else{
        stateItem.obj.data = stateData
    }
    stateItem.name = /^LOAD/.test(stateName) ?  camelCase(stateName.replace('LOAD_','')) : camelCase(stateName)
    return stateItem
};

const stateType = type => {
    let stateData = {};
    switch (type) {
        case 'Array':
        stateData = [];
        break;
        case 'Object':
        stateData = {};
        break;
        case 'String':
        stateData = '';
        break;
        case 'Null':
        stateData = null;
        break;
        case 'Number':
        stateData = 0;
        break;
        default:
        stateData = {};
    }
    return stateData;
};

// 返回一个mutation函数
let createMutationFunc = stateKey => (state, payload = {}) => {
    const key = /^LOAD/.test(stateKey) ?  camelCase(stateKey.replace('LOAD_','')) : camelCase(stateKey)
    state[key] = {
        ...state[key],
        ...payload,
    }
};

// 创建 Mutations
export const createMutations = (types = {}) => {
    let mutations = {};
    Object.values(types).forEach(item => {
        let stateKey = isArray(item) ? item[0] : item;
        mutations[camelCase(stateKey)] = createMutationFunc(stateKey)
    });
    return { ...mutations };
};

// 检测自定义Action覆盖默认生成的action,如果检测到有未覆盖到的属性，抛出错误。不支持新创建action

const checkResetActions = (actions, resetAction) => {
    let action = { ...resetAction };
    let obj = Object.keys(action);
    let willResetAction = {};
    let list = [];
    if (obj.length === 0) return;
    obj.forEach(item => {
        if (!has(actions, item)) {
            list.push(item);
        } else {
            willResetAction[item] = action[item];
        }
    });
    if (list.length) {
        console.error('检测到有未覆盖的属性 < %s >,请检测是否名字填写错误，命名规则是“定义的type前加一个fetch,然后转化为驼峰。如，定义的type是LOAD_LOGIN,那么resetEffect名字为fetchLoadLogin”', list.toString());
    }
    return willResetAction;
};

// 创建effect
export const createActions = (types = {}, apis = {}, resetAction) => {
    let actions = {};
    let keys = Object.values(types);

    keys.forEach(item => {
        let stateKey = isArray(item) ? item[0] : item;
        actions[camelCase('FETCH_' + stateKey)] = async ({ commit, state }, params) => {
            const type = camelCase(stateKey)
            commit(type, { isLoading: true })

            if (!apis[type]) {
                console.error('未检测到 %o api', camelCase(stateKey));
                commit(type, { isLoading: false })
                return false;
            }

            let res = await apis[type](params)
            commit(type, { data: res.response.data, isLoading: false })
            return res
        };
    });
    return { ...actions, ...checkResetActions(actions, resetAction) };
};

// 生成如下结构
// const common = {
//     namespaced: true,
//     state: { 
//       login: {
//         data: {},
//         isLoading: false
//       },
//       imgCode: {
//         data: {},
//         isLoading: false
//       }
//     },
//     mutations: { 
//       loadLogin (state, payload = {}) {
//         state.login = {
//           ...state.login,
//           ...payload,
//         }
//       },
//       loadImgCode (state, payload = {}) {
//         state.imgCode = {
//           ...state.imgCode,
//           ...payload,
//         }
//       },
//     },
//     actions: {
//       async fetchLoadLogin ({ commit, state }, params) {
//         commit('login', { isLoading: true })
//         let res = await loadLogin(params)
//         commit('login', { data: res.response.data, isLoading: false })
//         return res
//       },
//       async fetchLoadImgCode ({ commit, state }, params) {
//         commit('imgCode', { isLoading: true })
//         let res = await loadImgCode(params)
//         commit('imgCode', { data: res.response.data, isLoading: false })
//         return res
//       }
//     },
//     getters: {
    
//     }
// }