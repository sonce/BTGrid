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
    /**
     * 获取父元素
     * @param selector 需要寻找父元素的选择器
     * @param stopFindParent 当查询到该元素则停止查询
     */
    getParents(selector?: string, stopFindParent?: Element | HTMLElement): Element[];
    /**
     * 获取最接近的父元素
     * @param selector 需要寻找父元素的选择器
     * @param stopFindParent 当查询到该元素则停止查询
     */
    getColsetParent(selector?: string, stopFindParent?: Element | HTMLElement): Element;
    /**
     * 在父元素中的位置索引
     */
    indexOfParent():number;
}
