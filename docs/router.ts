import { createRouter, createWebHashHistory, RouterOptions } from 'vue-router'

const routes = [{
    title: '说明文档',
    name: '说明文档',
    path: '/readme',
    component: () => import('@README.md'),
}, {
    title: 'Demo演示',
    name: 'Demo演示',
    path: '/demo',
    component: () => import('./demo.vue'),
}];

const routerConfig = {
    history: createWebHashHistory(),
    routes,
    scrollBehavior(to: any, from: any) {
        if (to.path !== from.path) {
            return { top: 0 };
        }
    },
};

const router = createRouter(routerConfig as RouterOptions);

export default router;
