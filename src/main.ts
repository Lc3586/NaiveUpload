import naiveUpload from './index.vue';
import type { App, Component, Plugin } from "vue"
import Settings from "./Model/Settings";
import { IApiService } from "./Core/IApiService";
import DefaultApiService from "./Extention/DefaultApiService";


type SFCWithInstall<T> = T & Plugin;
const withInstall = <T>(comp: Component) => {
    (comp as SFCWithInstall<T>).install = (app: App) => {
        //注册组件
        app.component((comp as any).name, comp);
    }
    return comp as SFCWithInstall<T>;
}
const NaiveUpload = withInstall(naiveUpload);
export default NaiveUpload;
export { Settings, DefaultApiService };
export type { IApiService };
