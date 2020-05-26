function initUtility(): void {
    String.prototype.format = function (...args: string[]): string {
        return this.replace(/{(\d+)}/g, function (match: string, number: number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };

    String.isNullOrEmpty = function (value: string): boolean {
        return !(typeof value === 'string' && value.length > 0);
    };

    Object.isNull = function (value: object | number | string): boolean {
        return typeof value === 'undefined' || value == null;
    };

    Element.prototype.insertAfter = function <T extends Element>(this: Element, newChild: T, refChild: Element): T {
        let parentEl: Element;
        if (refChild == null || typeof refChild == 'undefined')
            parentEl = this;
        else
            parentEl = refChild.parentElement;

        if (parentEl.lastChild == refChild) {
            parentEl.appendChild(newChild);
        } else {
            parentEl.insertBefore(newChild, refChild.nextSibling);
        }
        return newChild;
    };

    HTMLElement.prototype.is = Element.prototype.is = function (this: Element, selector: string): boolean {
        if (this.matches)
            return this.matches(selector);

        let result = false;
        let root, frag;

        // crawl up the tree
        // while (node.parentElement) {
        //     node = node.parentElement;
        // }

        // root must be either a Document or a DocumentFragment
        if (this.parentElement) {
            root = this.parentElement;
        } else {
            root = frag = document.createDocumentFragment();
            frag.appendChild(this);
        }

        // see if selector matches
        const matches = root.querySelectorAll(selector);
        for (let i = 0; i < matches.length; i++) {
            if (this === matches.item(i)) {
                result = true;
                break;
            }
        }

        // detach from DocumentFragment and return result
        while (frag && frag.firstChild) {
            frag.removeChild(frag.firstChild);
        }
        return result;
    };
    HTMLElement.prototype.getParents = Element.prototype.getParents = function (this: HTMLElement | Element, selector?: string, stopFindParent?: Element | HTMLElement): Element[] {
        // If no parentSelector defined will bubble up all the way to *document*
        if (stopFindParent === undefined) {
            stopFindParent = document.body;
        }

        const parents = [];
        let p = this.parentElement;

        while (!Object.isNull(p) && p !== stopFindParent) {
            const o = p;
            if (Object.isNull(selector))
                parents.push(o);
            else if (o.is(selector)) {
                parents.push(o);
            }

            p = o.parentElement;
        }
        if (!Object.isNull(selector)) {
            if (stopFindParent.is(selector))
                parents.push(stopFindParent); // Push that parentSelector you wanted to stop at
        }
        else
            parents.push(stopFindParent);
        return parents;
    };
    HTMLElement.prototype.getColsetParent = Element.prototype.getColsetParent = function (this: HTMLElement | Element, selector?: string, stopFindParent?: Element | HTMLElement): Element {
        // If no parentSelector defined will bubble up all the way to *document*
        if (stopFindParent === undefined) {
            stopFindParent = document.body;
        }

        let p = this.parentElement;

        while (!Object.isNull(p) && p !== stopFindParent) {
            const o = p;
            if (Object.isNull(selector))
                return o;
            else if (o.is(selector)) {
                return o;
            }

            p = o.parentElement;
        }
        if (!Object.isNull(selector)) {
            if (stopFindParent.is(selector))
                return stopFindParent; // Push that parentSelector you wanted to stop at
        }
        else
            return stopFindParent;
    };
    HTMLElement.prototype.indexOfParent = Element.prototype.indexOfParent = function (this: HTMLElement | Element): number {
        const childrens = Array.from(this.parentElement.children);
        return childrens.indexOf(this);
    };
    //去除字符串头尾空格或指定字符  
    String.prototype.Trim = function (c?: string): string {
        if (typeof c == 'undefined' || c == null || c == '') {
            const str = this.replace(/(^\s*)|(\s*$)/g, '');
            return str;
        }
        else {
            let rg = new RegExp('^' + c + '*');
            const str = this.replace(rg, '');
            rg = new RegExp(c);
            let i = str.length;
            while (rg.test(str.charAt(--i)));
            return str.slice(0, i + 1);
        }
    };
    //去除字符串头部空格或指定字符  
    String.prototype.TrimStart = function (c: string): string {
        if (c == null || c == '') {
            const str = this.replace(/(^\s*)/g, '');
            return str;
        }
        else {
            const rg = new RegExp('^' + c + '*');
            const str = this.replace(rg, '');
            return str;
        }
    };

    //去除字符串尾部空格或指定字符  
    String.prototype.TrimEnd = function (c: string): string {
        if (c == null || c == '') {
            const str = this.replace(/(\s*$)/g, '');
            return str;
        }
        else {
            const rg = new RegExp(c);
            let i = this.length;
            while (rg.test(this.charAt(--i)));
            return this.slice(0, i + 1);
        }
    };

}
export default initUtility;
