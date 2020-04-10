
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
interface Element {
    /**
     * 在refChild元素之后插入新元素
     * @param newChild 插入的新元素
     * @param refChild 在这个元素之后位置插入
     */
    insertAfter<T extends Element>(newChild: T, refChild?: Node): T;
}


String.prototype.format = function (...args: string[]): string {
    return this.replace(/{(\d+)}/g, function (match: string, number: number) {
        return typeof args[number] != 'undefined' ? args[number] : match;
    });
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
