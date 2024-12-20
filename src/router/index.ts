import { type RouteRecordRaw, createRouter } from "vue-router"
import { history, flatMultiLevelRoutes } from "./helper"
import routeSettings from "@/config/route"

const Layouts = () => import("@/layouts/index.vue")

/**
 * 常驻路由
 * 除了 redirect/403/404/login 等隐藏页面，其他页面建议设置 Name 属性
 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layouts,
    meta: {
      hidden: true
    },
    children: [
      {
        path: ":path(.*)",
        component: () => import("@/views/redirect/index.vue")
      }
    ]
  },
  {
    path: "/403",
    component: () => import("@/views/error-page/403.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404.vue"),
    meta: {
      hidden: true
    },
    alias: "/:pathMatch(.*)*"
  },
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/",
    component: Layouts,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        name: "Dashboard",
        meta: {
          title: "首页",
          svgIcon: "dashboard",
          affix: true
        }
      }
    ]
  },
  {
    path: "/account/",
    component: Layouts,
    children: [
      {
        path: "index",
        component: () => import("@/views/account/list.vue"),
        name: "账户列表",
        meta: {
          title: "账户列表",
          svgIcon: "list"
        }
      }
    ]
  },
  {
    path: "/account/",
    component: Layouts,
    children: [
      {
        path: "create",
        component: () => import("@/views/account/create.vue"),
        name: "添加账户",
        meta: {
          title: "添加账户",
          svgIcon: "addUser"
        }
      }
    ]
  },
  {
    path: "/vm/",
    component: Layouts,
    children: [
      {
        path: "list",
        component: () => import("@/views/vm/list.vue"),
        name: "虚拟机列表",
        meta: {
          title: "虚拟机列表",
          svgIcon: "vps"
        }
      }
    ]
  },
  {
    path: "/vm/",
    component: Layouts,
    children: [
      {
        path: "create",
        component: () => import("@/views/vm/create.vue"),
        name: "创建虚拟机",
        meta: {
          title: "创建虚拟机",
          svgIcon: "create"
        }
      }
    ]
  },
  // 订阅
  {
    path: "/subscription/",
    component: Layouts,
    children: [
      {
        path: "list",
        component: () => import("@/views/subscription/list.vue"),
        name: "订阅列表",
        meta: {
          title: "订阅列表",
          svgIcon: "subscription"
        }
      }
    ]
  },
  {
    path: "/system/",
    component: Layouts,
    children: [
      {
        path: "index",
        component: () => import("@/views/system/index.vue"),
        name: "面板设置",
        meta: {
          title: "面板设置",
          svgIcon: "system"
        }
      }
    ]
  }
]

/**
 * 动态路由
 * 用来放置有权限 (Roles 属性) 的路由
 * 必须带有 Name 属性
 */
export const dynamicRoutes: RouteRecordRaw[] = []

const router = createRouter({
  history,
  routes: routeSettings.thirdLevelRouteCache ? flatMultiLevelRoutes(constantRoutes) : constantRoutes
})

/** 重置路由 */
export function resetRouter() {
  // 注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch {
    // 强制刷新浏览器也行，只是交互体验不是很好
    window.location.reload()
  }
}

export default router
