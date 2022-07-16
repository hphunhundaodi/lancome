interface route {
    path: string,
    component: any
}
interface initConfig {
    /**
     * 路由配置
     */
    routers: Array<route>
}

export function initApp(config: initConfig): void;
export function Router(path: string, fn: () => Promise<any>): route;
