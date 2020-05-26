import cellSizeMode from './cellSizeMode';

export default class GridOption {
    /** 行样式 */
    rowClass?= 'row';
    /** 自定义行样式 */
    customRowClass?: string;
    /** 列大小模式 */
    CellSizeMode?: cellSizeMode = cellSizeMode.AutoAverageShrink;
    /** 栅格列数量。1-12。可自定义 */
    gridSize?= 12;
    /** 列样式 */
    cellClassFormat?= 'col-lg';
    /**
     * ColItem样式
     */
    colItemClass?= 'colitem';
    /**
     * 移动时的样式
     */
    movingClass?: string = 'btui-draggable-moving';
    /**
     * 移动目标的样式
     */
    moveTargetClass?: string = 'btui-dragable-target';
}
