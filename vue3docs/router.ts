import { createRouter, createWebHashHistory, RouterOptions } from 'vue-router';

const routes = [
    {
        path: '/',
        redirect: '/readme'
    },
    {
        title: '说明文档',
        name: '说明文档',
        path: '/readme',
        component: () => import('./readme.vue'),
    },
    {
        title: '演示Demo',
        name: '演示Demo',
        path: '/demo',
        component: () => import('./demo.vue'),
    }
];

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
