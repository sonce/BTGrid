
interface String {
    /**
     * 
     * @param c 前后去除的字符
     */
    Trim(c?: string): string;
    /**
     * 
     * @param c 去除前面的字符
     */
    TrimStart(c?: string): string;
    /**
     * 
     * @param c 去除后面的字符
     */
    TrimEnd(c?: string): string;

    format(...args: string[]): string;
}
interface StringConstructor {
    /**
     * 字符串是否为null或者空字符
     * @param val 字符串
     */
    isNullOrEmpty(val: string): boolean;
}
interface ObjectConstructor {
    /**
     * 对象是否为null
     * @param val 对象
     */
    isNull(val: object | number | string): boolean;
}
interface Element {
    /**
     * 在refChild元素之后插入新元素
     * @param newChild 插入的新元素
     * @param refChild 在这个元素之后位置插入
     */
    insertAfter<T extends Element>(newChild: T, refChild?: Node): T;
    /**
     * 判断元素是否符合该选择器
     * @param selector 选择器
     */
    is(selector: string): boolean;
}

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

Element.prototype.insertAfter = function <T extends Element>(newChild: T, refChild: Element): T {
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

Element.prototype.is = function (this: Element, selector: string): boolean {
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
