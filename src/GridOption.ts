import cellSizeMode from './cellSizeMode';

export default class GridOption {
    /** 行样式 */
    rowClass?= 'row';
    /** 列大小模式 */
    CellSizeMode?: cellSizeMode = cellSizeMode.AutoShrink;
    /** 栅格列数量。1-12。可自定义 */
    gridCellsCount?= 12;
    /** 列样式 */
    cellClassFormat?= 'col-lg';
    /**
     * ColItem样式
     */
    colItemClass?= 'colitem';
    /**
     * 移动时的样式
     */
    movingClass?: string='btui-draggable-moving';
}
