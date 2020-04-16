function setupTestHelpers(this: Mocha.Context) {

    this.elements = new Array<HTMLElement>();
    this.createElement = function <K extends keyof HTMLElementTagNameMap>(tag: K, html: string = null, className: string = null, dontAppend: boolean = false) {
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
    this.cleanupTest = function (this: Mocha.Context): void {
        this.elements.forEach(function (element:Element) {
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
