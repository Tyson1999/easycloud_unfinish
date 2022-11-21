import Cookies from 'js-cookie'
import { getSettings } from '@/api/settings'

// modules 只作用于属性，属性会归属在相应的模块名的命名空间下。
// mutations, actions, getter 没有命名空间的限定，所以要保证全局的唯一性，否则后者会覆盖前者
const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  size: Cookies.get('size') || 'medium',
  // API域名，need fix
  mainDomain: ''
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  },
  SET_SETTINGS: (state, settings) => {
    state.mainDomain = settings['MAIN_DOMAIN']
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  },
  fetchSettings({ commit }) {
    getSettings().then(res => {
      res = res['data']
      commit('SET_SETTINGS', res)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
