import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  // 下载页面
  {
    path: '/download/:downloadId',
    component: () => import('@/views/download/'),
    hidden: true,
    meta: { title: 'Jump to download endpoint', icon: 'documentation' }
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/upload',
    component: Layout,
    meta: { title: '上传管理', icon: 'documentation', roles: ['admin', 'editor'] },
    redirect: '/upload/create',
    children: [
      {
        path: 'create',
        component: () => import('@/views/upload/create'),
        name: 'uploadCreate',
        meta: { title: '上传项入库', icon: 'edit', roles: ['admin', 'editor'] }
      },
      {
        path: 'manageUploadedItem',
        component: () => import('@/views/upload/ManageUploadedItem'),
        name: 'uploadList',
        meta: { title: '获取链接', icon: 'list', roles: ['admin', 'editor'] }
      }
    ]
  },
  {
    path: '/logs',
    component: Layout,
    meta: { title: '查看日志', icon: 'eye-open', roles: ['admin', 'editor'] },
    children: [
      {
        path: '/userLogs',
        name: 'logs',
        meta: { title: '查看日志', icon: 'eye-open', roles: ['admin', 'editor'] },
        component: () => import('@/views/logs')
      }
      // {
      //   path: '/sysLogs',
      //   name: 'sysLogs',
      //   meta: { title: '系统日志', icon: 'eye-open', roles: ['admin'] },
      //   component: () => import('@/views/logs')
      // }
    ]
  },
  {
    path: '/creator',
    component: Layout,
    meta: { title: '作者管理', icon: 'user', roles: ['admin', 'editor'] },
    children: [
      {
        path: 'add',
        name: 'addCreator',
        meta: { title: '新增作者', icon: 'user', roles: ['admin', 'editor'] },
        component: () => import('@/views/creator/Add')
      },
      {
        path: 'edit',
        name: 'editCreator',
        meta: { title: '管理作者', icon: 'edit', roles: ['admin', 'editor'] },
        component: () => import('@/views/creator/Edit')
      }
    ]
  },
  {
    path: '/policy',
    component: Layout,
    name: 'policy',
    meta: { title: '存储策略', icon: 'international', roles: ['admin', 'editor'] },
    children: [
      {
        path: 'management',
        name: 'management',
        meta: { title: '存储策略管理', icon: 'international', roles: ['admin', 'editor'] },
        component: () => import('@/views/admin/policiesManagement')
      },
      {
        path: 'tutorial',
        name: 'tutorial',
        component: () => import('@/views/tutorial'),
        meta: { title: '添加策略教程', icon: 'eye-open', roles: ['admin', 'editor'] }
      }
    ]
  },
  {
    path: '/admin',
    component: Layout,
    meta: { title: '后台管理', icon: 'component', roles: ['admin'] },
    children: [
      {
        path: 'userManagement',
        component: () => import('@/views/admin/UserManagement'),
        name: 'userManagement',
        meta: { title: '用户管理', icon: 'peoples', roles: ['admin'] }
      }]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
