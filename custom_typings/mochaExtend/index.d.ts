import Mocha from 'mocha';

declare module "mocha" {
    interface Context {
        /**
         * 添加的元素集合
         */
        elements: HTMLElement[]
        /**
         * 
         * @param tag 标签
         * @param html 
         * @param className 
         * @param dontAppend 
         */
        createElement<K extends keyof HTMLElementTagNameMap>(tag: K, html?: string, className?: string, dontAppend?: boolean): HTMLElement
        /**
         * 清理测试
         */
        cleanupTest(): void;
    }
}
