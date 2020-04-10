/** 列新增时，宽度的处理 */
enum cellSizeMode {
    /** 按列实际大小添加 */
    None,
    /** 收缩其他列，放入新列 */
    AutoShrink,
    /** 自动收缩其他列，平分宽度 */
    AutoAverageShrink,
}
export default cellSizeMode;
