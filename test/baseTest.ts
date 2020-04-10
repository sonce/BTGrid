import Mocha from 'mocha'
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

function setupTestHelpers(this: Mocha.Context) {

    Mocha.Context.prototype.elements = this.elements = new Array<HTMLElement>();
    Mocha.Context.prototype.createElement = this.createElement = function <K extends keyof HTMLElementTagNameMap>(tag: K, html: string = null, className: string = null, dontAppend: boolean = false) {
        var el = document.createElement(tag);
        el.innerHTML = html || '';
        if (className) {
            el.className = className;
        }
        this.elements.push(el);
        if (!dontAppend) {
            document.body.appendChild(el);
        }
        return el;
    }
    Mocha.Context.prototype.cleanupTest = this.cleanupTest = function (this: Mocha.Context): void {
        this.elements.forEach(function (element) {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });

        delete this.createElement;
        delete this.elements;
        delete this.cleanupTest;
    }
}
export default setupTestHelpers;
