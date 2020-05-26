import cellSizeMode from './cellSizeMode';
import GridOption from './GridOption';
import position from './position';
/**
 * BTGrid
 */
export default class BTGrid {

    /** 配置 */
    option: GridOption;
    target: Element;
    rowCount: number;
    constructor(element: Element, option?: GridOption) {
        const defaultOption = new GridOption();
        if (Object.isNull(option))
            this.option = defaultOption;
        else
            this.option = { ...defaultOption, ...option };
        this.target = element;
        this.rowCount = this.getRowsCount();
    }

    /**
     * 添加widget
     * @param contentEl 新增的内容
     */
    addWidget(contentEl: Element): Element;
    /**
     * 添加WIDGET到指定的位置
     * @param contentEl 内容
     * @param collItemIndex 新增WIGET的位置
     * @param cell 所在列
     * @param row 所在行
     */
    addWidget(contentEl: Element, row: Element, cell: Element, collItemIndex: number): Element;
    /**
     * 添加列并添加WIDGET
     * @param contentEl 内容
     * @param cellIndex 新增列的位置
     * @param row 所在行
     */
    addWidget(contentEl: Element, row: Element, cell: Element): Element;
    /**
     * 添加列并添加WIDGET
     * @param contentEl 内容
     * @param cellIndex 新增列的位置
     * @param row 所在行
     */
    addWidget(contentEl: Element, row: Element, cellIndex: number): Element;
    /**
     * 添加行并添加widget
     * @param contentEl 内容
     * @param rowIndex 新增行的位置
     */
    addWidget(contentEl: Element, rowIndex: number): Element;
    /**
     * 在行中添加列和widget
     * @param contentEl 内容
     * @param row 行
     */
    addWidget(contentEl: Element, row: Element): Element;
    /**
     * 
     * @param contentEl widget内容
     * @param rowOrAddIndex 行，或者新增行的所在位置
     * @param cellOrAddIndex 列，或新增列的位置
     * @param collItemIndex clitem的位置
     */
    addWidget(contentEl: Element, rowOrAddIndex?: Element | number, cellOrAddIndex?: Element | number, collItemIndex?: number): Element {

        if (typeof rowOrAddIndex == 'undefined')
            return this.addNewRow(contentEl);
        if (typeof rowOrAddIndex == 'number')
            return this.addNewRow(contentEl, rowOrAddIndex);

        // if (typeof rowOrAddIndex != 'object')
        //     return;
        if (typeof cellOrAddIndex == 'undefined')
            return this.addNewCel(contentEl, rowOrAddIndex);
        if (typeof cellOrAddIndex == 'number')
            return this.addNewCel(contentEl, rowOrAddIndex, cellOrAddIndex);

        if (typeof collItemIndex == 'undefined')
            return this.addColItem(contentEl, rowOrAddIndex, cellOrAddIndex);
        else
            return this.addColItem(contentEl, rowOrAddIndex, cellOrAddIndex, collItemIndex);
    }

    //#region  row

    /** 行的选择器 */
    private get rowSelector(): string {
        return `.${this.option.rowClass}`;
    }
    /**
     * 获取行
     * @param rowIndex 行索引
     */
    getRow(rowIndex: number): HTMLElement {
        const rows: HTMLElement[] = this.getRows();
        if (rows.length == 0 || rowIndex >= rows.length || rowIndex < 0)
            return;

        return rows[rowIndex] as HTMLElement;
    }

    /**
     * 获取行的数量
     */
    getRowsCount(): number {
        return this.getRows().length;
    }

    /**
     * 获取所有行
     */
    getRows(): HTMLElement[] {
        return Array.from(this.target.querySelectorAll(this.rowSelector));
    }

    /**
     * 添加内容到新行
     * @param contentEl 内容
     */
    private addNewRow(contentEl: Element): Element;
    /**
     * 添加内容到新行
     * @param contentEl 内容
     * @param rowIndex 新行的位置
     */
    private addNewRow(contentEl: Element, rowIndex: number): Element;
    /**
     * 添加新行
     * @param contentEl 内容元素
     * @param rowIndex 行索引
     */
    private addNewRow(contentEl: Element, rowIndex?: number): Element {
        const newRow = document.createElement('div');
        rowIndex = typeof rowIndex == 'undefined' ? this.rowCount : rowIndex;
        rowIndex = rowIndex < 0 ? 0 : rowIndex;
        // rowIndex = rowIndex >= this.rowCount ? this.rowCount - 1 : rowIndex;

        newRow.dataset.rowIndex = rowIndex.toString();
        newRow.className = this.option.rowClass;
        if (!Object.isNull(this.option.customRowClass)) {
            newRow.className = newRow.className + ' ' + this.option.customRowClass;
        }

        this.addNewCel(contentEl, newRow);
        if (this.rowCount == 0 && rowIndex >= this.rowCount)
            this.target.appendChild(newRow);
        else {
            const rows: HTMLElement[] = this.getRows();
            this.target.insertBefore(newRow, rows[rowIndex]);
            for (let index = rowIndex; index < rows.length; index++) {
                const nextRow = rows[index];
                nextRow.dataset.rowIndex = (index + 1).toString();
            }
        }
        this.rowCount++;

        return newRow;
    }

    /**
     * 删除行
     * @param rowOrIndex 行或者行索引
     */
    removeRow(rowOrIndex: Element | number): void {
        let theRow: Element;
        if (typeof rowOrIndex === 'number')
            theRow = this.getRow(rowOrIndex);
        else
            theRow = rowOrIndex;

        theRow.parentElement.removeChild(theRow);
        this.rowCount--;
    }
    //#endregion

    //#region  cell
    /**
     * 获取全尺寸的样式
     */
    get FullSizeCellClass(): string {
        return this.cellClassFormat.format(this.option.gridSize.toString());
    }
    /**
     * 获取列的尺寸样式
     * @param size 尺寸
     */
    GetCellClass(size: number): string {
        return this.cellClassFormat.format(size.toString());
    }
    private get cellClassFormat(): string {
        return `${this.option.cellClassFormat}-{0}`;
    }
    private get cellSelector(): string {
        return `[class*=${this.option.cellClassFormat}-]`;
    }
    private cellClassRegex = /col-lg-(\d+)/;

    /**
     * 通过坐标获取列
     * @param cellIndex 列索引
     * @param rowIndex 行索引
     */
    getCell(rowIndex: number, cellX: number): Element;
    /**
     * 通过坐标获取列
     * @param cellIndex 列位置索引
     * @param ownRow 所在行
     */
    getCell(ownRow: Element, cellX: number): Element;
    /**
     * 通过坐标获取列
     * @param cellX CELL的位置，栅格列数量为12，则X值范围为0-11
     * @param ownRow 列所在的行
     */
    getCell(ownRow: Element | number, cellX: number): Element;
    /**
     * 通过坐标获取列
     * @param cellX CELL的位置，栅格列数量为12，则X值范围为0-11
     * @param ownRow 列所在的行
     */
    getCell(ownRow: Element | number, cellX: number): Element {
        // cellX = cellX > this.option.gridCellsCount ? this.option.gridCellsCount : cellX;
        const cells: Element[] = this.getCells(ownRow);
        let sizeCount = 0;
        for (let index = 0; index < cells.length; index++) {
            const theCell = cells[index];
            const size = this.getCellSize(theCell);
            sizeCount += size;
            if (cellX <= sizeCount)
                return theCell;
        }
        return cells[cells.length - 1];
    }

    /**
     * 通过索引获取列
     * @param cellIndex 列索引
     * @param rowIndex 行索引
     */
    getCellByIndex(rowIndex: number, cellIndex: number): Element;
    /**
     * 通过索引获取列
     * @param cellIndex 列位置索引
     * @param ownRow 所在行
     */
    getCellByIndex(ownRow: Element, cellIndex: number): Element;
    /**
     * 通过索引获取列
     * @param cellX CELL的位置，栅格列数量为12，则X值范围为0-11
     * @param ownRow 列所在的行
     */
    getCellByIndex(ownRow: Element | number, cellIndex: number): Element {
        cellIndex = cellIndex < 0 ? 0 : cellIndex;
        const cells: Element[] = this.getCells(ownRow);
        cellIndex = cellIndex > cells.length ? cells.length - 1 : cellIndex;
        if (cells.length > 0)
            return cells[cellIndex];
    }

    /**
     * 获取列
     * @param ownRowOrIndex 所属行或者行索引
     * @param excludeWillEmptyCell 是否不包含将要清空的列.例如：移动最后一个colitem。
     */
    getCells(ownRowOrIndex: Element | number, excludeWillEmptyCell = false): Element[] {
        let theRow: Element;
        if (typeof ownRowOrIndex == 'number')
            theRow = this.getRow(ownRowOrIndex);
        else
            theRow = ownRowOrIndex;

        const cells: Element[] = Array.from(theRow.querySelectorAll(this.cellSelector));
        if (!excludeWillEmptyCell)
            return cells;
        const result: Element[] = [];
        for (let index = 0; index < cells.length; index++) {
            if (cells[index].childElementCount == 0)
                result.push(cells[index]);
            else {
                const noMoving = cells[index].querySelector(`div:not(.${this.option.movingClass})`);
                if (!Object.isNull(noMoving))
                    result.push(cells[index]);
            }
        }
        return result;
    }

    /**
     * 添加新列
     * @param contentEl 内容元素
     * @param rowIndex 行索引
     */
    addNewCel(contentEl: Element, rowIndex: number): Element;
    /**
    * 添加新列
    * @param contentEl 内容元素
    * @param rowIndex 行
    */
    addNewCel(contentEl: Element, ownRow: Element): Element;
    /**
     * 
     * @param contentEl 
     * @param ownRow 
     * @param cellIndex 
     */
    addNewCel(contentEl: Element, ownRow: Element, cellIndex: number, width?: number): Element;
    /**
     * 
     * @param contentEl 
     * @param rowIndex 
     * @param cellIndex 
     */
    addNewCel(contentEl: Element, rowIndex: number, cellIndex: number, width?: number): Element;
    /**
     * 
     * @param contentEl 内容元素
     * @param cellIndex 列的X位置
     * @param width 列宽度
     * @param ownRowOrIndex 行索引或者行元素
     */
    addNewCel(contentEl: Element, ownRowOrIndex: Element | number, cellIndex?: number, width?: number): Element {
        let theRow: Element;
        if (typeof ownRowOrIndex == 'number')
            theRow = this.getRow(ownRowOrIndex);
        else
            theRow = ownRowOrIndex;
        const newCel = document.createElement('div');
        //宽度如果溢出，则调整大小
        if (this.autoCellSize(theRow, newCel, cellIndex, width)) {
            // newCel.appendChild(contentEl);
            const cells = this.getCells(theRow);
            if (cells.length == 0 || Object.isNull(cellIndex) || cellIndex >= cells.length)
                theRow.appendChild(newCel);
            else
                theRow.insertBefore(newCel, cells[cellIndex]);

            this.addColItem(contentEl, theRow, newCel);
            return newCel;
        }
    }

    /**
     * 该行是否可以添加
     * @param row 行
     * @param width 宽度
     */
    private canAdd(row: Element): boolean {
        const cellsCount = this.getCells(row, true).length;
        //超出了栅格列大小
        if (cellsCount >= this.option.gridSize)
            return false;

        const remainSize = this.getRemainCellsSize(row, true);
        // const remainCellsCount = this.option.gridCellsCount - cellsCount;

        //如果宽度没有指定，且剩余大小大于0
        // if (this.option.CellSizeMode == cellSizeMode.None || (remainSize > 0 && Object.isNull(width)) || remainSize >= width) {
        if (this.option.CellSizeMode == cellSizeMode.None) {
            if (remainSize <= 0)
                return false;
        }

        return true;
    }
    /**
     * 如果可以插入，则返回true，否则返回false
     * @param row 行
     * @param newCell 列
     * @param newCellIndex 列索引
     * @param newCellWidth 宽度
     */
    private autoCellSize(row: Element, newCell?: Element, newCellIndex?: number, newCellWidth?: number): boolean {
        const cellsCount = this.getCells(row).length;
        //超出了栅格列大小
        if (!this.canAdd(row))
            return false;
        const remainSize = this.getRemainCellsSize(row);
        const remainCellsCount = this.option.gridSize - cellsCount;
        //如果宽度没有指定，且剩余大小大于0
        if (this.option.CellSizeMode == cellSizeMode.None)
            return this.autoCellSizeOfNone(row, newCell, remainSize, newCellWidth);
        else if (this.option.CellSizeMode == cellSizeMode.AutoShrink)
            return this.autoCellSizeOfShrink(row, newCell, newCellIndex, remainSize, remainCellsCount, newCellWidth);
        else
            return this.autoCellSizeOfAverageShrink(row, newCell, newCellWidth);
    }

    autoCellSizeOfAverageShrink(row: Element, newCell?: Element, newCellWidth?: number): boolean {
        const cells = this.getCells(row);
        const oldCellsCount = cells.length;
        /** 剩余列的数量 */
        const remainCellsCount = this.option.gridSize - oldCellsCount;
        const noNewCell = Object.isNull(newCell);
        const noWidth = noNewCell || Object.isNull(newCellWidth);
        const newCellsCount = noNewCell ? oldCellsCount : oldCellsCount + 1;

        /** 其他列的大小 */
        let otherWidth: number;
        let redundancyWidth: number;
        if (noWidth) {
            otherWidth = this.option.gridSize / newCellsCount;
            redundancyWidth = otherWidth;
            if (Number.isInteger(otherWidth))
                newCellWidth = otherWidth;
            else {
                otherWidth = Math.round(otherWidth);
                //未能整除，则将剩余大小给新列
                newCellWidth = this.option.gridSize - (newCellsCount - 1) * otherWidth;
                redundancyWidth = newCellWidth;
            }
        }
        else {
            //如果指明了宽度，总宽度-此列宽度，均分现有列。
            newCellWidth = newCellWidth > remainCellsCount ? remainCellsCount : newCellWidth;
            const remainGridSize = this.option.gridSize - newCellWidth;

            //计算其他列的宽度
            otherWidth = remainGridSize / (newCellsCount - 1);
            redundancyWidth = otherWidth;
            if (!Number.isInteger(otherWidth)) {
                otherWidth = Math.round(otherWidth);
                redundancyWidth = otherWidth;
                //将多出的宽度给予新列
                redundancyWidth += remainGridSize - otherWidth * (newCellsCount - 1);
            }
        }
        for (let index = 0; index < cells.length; index++) {
            const theCel = cells[index];
            if (cells.length - 1 == index)
                this.addOrRemoveGridClass(theCel, this.GetCellClass(redundancyWidth));
            else
                this.addOrRemoveGridClass(theCel, this.GetCellClass(otherWidth));
        }
        if (!noNewCell)
            this.addOrRemoveGridClass(newCell, this.GetCellClass(newCellWidth));

        return true;
    }
    /**
     * 在插入列的位置，将其左右的列收缩，以放入新列
     * @param row 行
     * @param cell 列
     * @param cellIndex 列索引
     * @param remainSize 剩余大小
     * @param width 宽度
     */
    autoCellSizeOfShrink(row: Element, cell: Element, cellIndex: number, remainSize: number, remainCellsCount: number, width?: number): boolean {
        width = Object.isNull(width) ? 1 : width;
        width = remainCellsCount > width ? width : remainCellsCount;
        cell.className = this.GetCellClass(width);
        const cells = this.getCells(row);
        let thrinkRemainSize = width - remainSize;

        for (let index = 0; index < cells.length; index++) {
            //优先缩小右侧的列
            const rightIndex = cellIndex + index;
            if (rightIndex < cells.length) {
                const theCel = cells[rightIndex];
                thrinkRemainSize -= this.thrinkTheCell(theCel, thrinkRemainSize);
            }

            if (thrinkRemainSize == 0)
                break;

            const leftIndex = cellIndex - index - 1;
            if (leftIndex >= 0) {
                const theCel = cells[leftIndex];
                thrinkRemainSize -= this.thrinkTheCell(theCel, thrinkRemainSize);
            }

            if (thrinkRemainSize == 0)
                break;
        }
        return true;
    }
    /**
     * 收缩列，返回收缩了多少
     * @param cells 收缩的列
     * @param thrinkRemainSize 剩余收缩的大小
     */
    private thrinkTheCell(theCel: Element, thrinkRemainSize: number): number {
        const theCelSize = this.getCellSize(theCel);
        const canThrinkSize = theCelSize - 1;
        // 判断是否有空间可收缩
        if (canThrinkSize > 0) {
            if (thrinkRemainSize > canThrinkSize) {
                // 当前列不能够容纳剩余收缩的大小
                theCel.className = this.GetCellClass(1);
                return canThrinkSize;
            }
            else {
                // 当前列能够容纳剩余收缩的大小
                const adjedRemainSize = theCelSize - thrinkRemainSize;
                theCel.className = this.GetCellClass(adjedRemainSize);
                return thrinkRemainSize;
            }
        }
        return 0;
    }
    /**
     * 如果新列大小可以插入则返回true,否则缩小其自身并插入，如不能插入返回false
     * @param row 行
     * @param cell 列
     * @param width 大小
     * @param remainSize 剩余大小
     */
    private autoCellSizeOfNone(row: Element, cell: Element, remainSize: number, width?: number): boolean {
        // if (remainSize == 0)
        //     return false;
        if (Object.isNull(cell))
            return true;
        width = Object.isNull(width) ? 1 : width;
        width = remainSize > width ? width : remainSize;
        cell.className = this.cellClassFormat.format(width.toString());
        return true;
    }

    /**
     * 获取当前行中列所占用的大小
     * @param ownRowOrIndex 所在行或者行索引
     * @param excludeWillEmptyCell 是否不包含将要清空的列.例如：移动最后一个colitem。
     */
    getExistCellsSize(ownRowOrIndex: Element | number, excludeWillEmptyCell = false): number {
        const cells = this.getCells(ownRowOrIndex, excludeWillEmptyCell);
        let sizeCount = 0;
        cells.forEach(cell => {
            const size = this.getCellSize(cell);
            sizeCount += size;
        });
        return sizeCount;
    }

    /**
     * 获取此行可增加多大的列
     * @param ownRowOrIndex 所在行或者行索引
     * @param excludeWillEmptyCell 是否不包含将要清空的列.例如：移动最后一个colitem。
     */
    getRemainCellsSize(ownRowOrIndex: Element | number, excludeWillEmptyCell = false): number {
        const existSize = this.getExistCellsSize(ownRowOrIndex, excludeWillEmptyCell);
        return this.option.gridSize - existSize;
    }

    /**
     * 获取栅格列的大小。col-lg-3,则返回3。如果没有对应的栅格列样式，则返回0
     * @param cell 需要获取size的列。
     */
    getCellSize(cell: Element): number {
        if (String.isNullOrEmpty(cell.className))
            return 0;
        const matchResult = cell.className.match(this.cellClassRegex);
        if (matchResult) {
            const size = matchResult[1];
            return Number.parseInt(size);
        }
        else
            return 0;
    }

    /**
     * 获取列所在的X位置
     * @param row 行
     * @param cellIndex 列索引
     */
    getCellX(row: Element | number, cellIndex: number): number {
        const cells = this.getCells(row);
        let x = 0;
        for (let index = 0; index < cellIndex; index++) {
            const element = cells[index];
            x += this.getCellSize(element);
        }
        return x;
    }

    /**
     * 删除行
     * @param cell 行
     */
    removeCel(cell: Element): void {
        const parent = cell.parentElement;
        parent.removeChild(cell);
        if (parent.childElementCount == 0)
            this.removeRow(parent);
        else {
            this.autoCellSize(parent);
        }
    }

    /**
     * 调整大小
     * @param col 列
     * @param x X坐标更改
     * @param width 宽度
     */
    resizeCol(col: Element, x: number, newWidth?: number): boolean {
        const ro = col.getBoundingClientRect();
        const Left = ro.left;
        const Width = ro.width;
        const size = this.getCellSize(col);
        const perSizeWidth = Width / size;
        let newSize = parseInt((newWidth / perSizeWidth).toString());
        newSize = newSize < 1 ? 1 : newSize;

        let changeSize = newSize - size;
        if (changeSize != 0) {
            let relatedCol: Element;
            //X坐标变更，左边
            if (x - Left != 0) {
                relatedCol = col.previousElementSibling;
            }
            else {
                //右边
                relatedCol = col.nextElementSibling;
            }
            //在第一列或者最后一列
            if (Object.isNull(relatedCol))
                return false;
            let relatedColSize = this.getCellSize(relatedCol);
            //关联调整的列大小为1,且需要缩小
            if (changeSize > 0 && relatedColSize == 1)
                return false;

            //扩大，关联列缩小
            if (relatedColSize - changeSize < 1) {
                //设置关联列大小为1
                changeSize = 1 - relatedColSize;
                relatedColSize = 1;
                newSize = size + Math.abs(changeSize);
            }
            else
                relatedColSize -= changeSize;

            this.addOrRemoveGridClass(relatedCol, this.GetCellClass(relatedColSize));
            this.addOrRemoveGridClass(col, this.GetCellClass(newSize));
            return true;
        }
        return false;
    }

    //#endregion

    //#region  colItem
    // /**
    //  * 添加ColItem到列中
    //  * @param contentEl 内容元素
    //  * @param ownCell colItem所在的列
    //  */
    // private addColItem(contentEl: HTMLElement, ownCell: HTMLElement): HTMLElement;
    // /**
    //  * 添加ColItem到列中
    //  * @param contentEl 内容元素
    //  * @param cellIndex 列的位置
    //  * @param ownRow 所在行
    //  */
    // private addColItem(contentEl: HTMLElement, cellIndex: number, ownRow: HTMLElement): HTMLElement;
    // /**
    //  * 添加ColItem到列中
    //  * @param contentEl 内容元素
    //  * @param cellIndex 列的位置
    //  * @param ownRow 所在行
    //  * @param itemIndex ColItem的纵向位置
    //  */
    // private addColItem(contentEl: HTMLElement, cellIndex: number, ownRow: HTMLElement, itemIndex: number): HTMLElement;
    // /**
    //  * 添加ColItem到列中
    //  * @param contentEl 内容元素
    //  * @param cellIndex 列的位置
    //  * @param rowIndex 行的位置
    //  */
    // private addColItem(contentEl: HTMLElement, cellIndex: number, rowIndex: number): HTMLElement;
    // /**
    //  * 添加ColItem到列中
    //  * @param contentEl 内容元素
    //  * @param cellX 列的位置
    //  * @param rowIndex 行的位置
    //  * @param itemIndex ColItem的纵向位置
    //  */
    // private addColItem(contentEl: HTMLElement, cellX: number, rowIndex: number, itemIndex: number): HTMLElement;
    // /**
    //  * 添加ColItem到列中
    //  * @param contentEl 内容元素
    //  * @param ownCell 所在的列
    //  * @param rowIndex 行的位置
    //  */
    // private addColItem(contentEl: HTMLElement, ownCell: HTMLElement, rowIndex: number): HTMLElement;
    // /**
    //  * 添加ColItem到列中
    //  * @param contentEl 内容元素
    //  * @param ownCell 所在的列
    //  * @param rowIndex 行的位置
    //  * @param itemIndex ColItem的纵向位置
    //  */
    // private addColItem(contentEl: HTMLElement, ownCell: HTMLElement, rowIndex: number, itemIndex: number): HTMLElement;
    /**
     * 添加ColItem到列中
     * @param contentEl 内容元素
     * @param ownCell 所在的列
     * @param ownRow 所在的行
     * @param itemIndex ColItem的纵向位置
     */
    addColItem(contentEl: Element, ownRow: Element, ownCell: Element, itemIndex: number): Element;
    /**
     * 添加ColItem到列中
     * @param contentEl 内容元素
     * @param cellIndex 所在的列
     * @param rowIndex 所在的行
     * @param itemIndex ColItem的纵向位置
     */
    addColItem(contentEl: Element, rowIndex: number, cellIndex: number, itemIndex: number): Element;
    /**
     * 添加ColItem到列中
     * @param contentEl 内容元素
     * @param ownCell 所在的列
     * @param ownRow 所在的行
     */
    addColItem(contentEl: Element, ownRow: Element, ownCell: Element): Element;
    /**
     * 添加ColItem到列中
     * @param contentEl 内容元素
     * @param cellIndex 列的位置
     * @param ownRow 所在的行
     */
    addColItem(contentEl: Element, ownRow: Element, cellIndex: number): Element;
    addColItem(contentEl: Element, ownRowOrIndex: Element | number, cellElOrIndex: Element | number, itemIndex?: number): Element {
        let theCell: Element;
        if (typeof cellElOrIndex == 'number') {
            if (typeof ownRowOrIndex == 'number')
                theCell = this.getCellByIndex(ownRowOrIndex, cellElOrIndex);
            else
                theCell = this.getCellByIndex(ownRowOrIndex, cellElOrIndex);
        }
        else
            theCell = cellElOrIndex;
        let cellItem = contentEl;
        if (!contentEl.is(this.colItemSelector)) {
            cellItem = document.createElement('div');
            cellItem.className = 'colitem';
            cellItem.appendChild(contentEl);
        }

        const colItems = this.getColItems(theCell);
        if (colItems.length == 0 || itemIndex >= colItems.length)
            theCell.appendChild(cellItem);
        else
            theCell.insertBefore(cellItem, colItems[itemIndex]);
        return cellItem;
    }

    private get colItemSelector(): string {
        return `.${this.option.colItemClass}`;
    }
    private getColItems(cell: Element): Element[] {
        const colItems = cell.querySelectorAll<Element>(this.colItemSelector);
        return Array.from(colItems);
    }

    /**
     * 获取项
     * @param rowIndex 行索引
     * @param cellIndex 列索引
     * @param colItemIndex 项索引
     */
    private getColItem(rowIndex: number, cellIndex: number, colItemIndex: number): Element {
        const ownCell = this.getCellByIndex(rowIndex, cellIndex);
        const colItems = Array.from(ownCell.children);
        return colItems[colItemIndex];
    }

    /**
     * 删除项
     * @param rowIndex 行索引
     * @param cellIndex 列索引
     * @param colItemIndex 项索引
     */
    removeColItemByIndex(rowIndex: number, cellIndex: number, colItemIndex: number): boolean {
        const colItem = this.getColItem(rowIndex, cellIndex, colItemIndex);
        return this.removeColItem(colItem);
    }
    /**
     * 删除项
     * @param colItem 项
     */
    private removeColItem(colItem: Element): boolean {
        const parent = colItem.parentElement;
        parent.removeChild(colItem);
        if (parent.childElementCount == 0)
            this.removeCel(parent);
        return true;
    }

    moveByIndex(rowIndex: number, colIndex: number, colItemIndex: number, x: number, y: number, finish = true): boolean {
        const colItem = this.getColItem(rowIndex, colIndex, colItemIndex);
        return this.move(colItem, x, y, finish);
    }
    private preDragTargetColItem: Element;
    /**
     * 移动colitem
     * @param colitem 项
     * @param x x轴坐标
     * @param y y轴坐标
     * @param finish 是否完成
     */
    move(colitem: Element, x: number, y: number, finish = true): boolean {
        if (!colitem.classList.contains(this.option.movingClass)) {
            colitem.classList.add(this.option.movingClass);
        }

        this.removeDragTargetClasses(this.preDragTargetColItem);

        const elements = this.target.ownerDocument.elementsFromPoint(x, y);
        const toColItem = this.filterFirstOrDefault(this.colItemSelector, ...elements);
        //自身
        if (Object.isNull(toColItem) || toColItem.isSameNode(colitem))
            return false;
        const width = this.getCellSize(colitem.parentElement);
        // const toRow = this.filterFirstOrDefault(this.rowSelector, ...elements);
        // const toCell = this.filterFirstOrDefault(this.cellSelector, ...elements);
        const toRow = toColItem.getColsetParent(this.rowSelector);
        const toCell = toColItem.getColsetParent(this.cellSelector);
        let toCellIndex = toCell.indexOfParent();
        let toColItemIndex = toColItem.indexOfParent();

        //获取需要放入的位置
        const p = this.positionOf(toColItem, x, y);
        let canDrop = true;
        //判断是否可以插入.上下两个位置不需要判断
        if (p == position.left || p == position.right) {
            canDrop = this.canAdd(toRow);
        }

        this.preDragTargetColItem = toColItem;
        //可以放下
        if (canDrop) {
            if (finish) {
                colitem.classList.remove(this.option.movingClass);

                this.removeColItem(colitem);
                if (p == position.left || p == position.right) {
                    toCellIndex += (p == position.right ? 1 : 0);
                    return !Object.isNull(this.addNewCel(colitem, toRow, toCellIndex, width));
                }
                else {
                    toColItemIndex += (p == position.bottom ? 1 : 0);
                    return !Object.isNull(this.addColItem(colitem, toRow, toCell, toColItemIndex));
                }
            }
            else
                toColItem.classList.add(this.option.moveTargetClass, position[p]);
            return true;
        }
        else {
            if (finish)
                colitem.classList.remove(this.option.movingClass);
            return false;
        }
    }

    private removeDragTargetClasses(toColItem: Element): void {
        if (Object.isNull(toColItem))
            return;
        toColItem.classList.remove(this.option.moveTargetClass);
        for (const enumMember in position) {
            const isValueProperty = parseInt(enumMember, 10) >= 0;
            if (isValueProperty) {
                toColItem.classList.remove(position[enumMember]);
            }
        }
    }

    resizeColItemByIndex(rowIndex: number, colIndex: number, colItemIndex: number, height: number): boolean {
        const colItem = this.getColItem(rowIndex, colIndex, colItemIndex);
        return this.resizeColItem(colItem, height);
    }
    /**
     * 改变 项 的大小。只能改变高度。宽度由列的宽度决定
     * @param colItem 项
     * @param height 高度
     */
    resizeColItem(colItem: Element, height: number): boolean {
        (colItem as HTMLElement).style.height = height.toString() + 'px';
        return true;
    }
    //#endregion

    //#region  Utility

    /**
     * 获取鼠标靠近元素的哪一个边
     * @param element 元素
     * @param x 鼠标x位置
     * @param y 鼠标y位置
     */
    positionOf(element: Element, x: number, y: number): position {
        const ro = element.getBoundingClientRect();
        const Top = ro.top;
        const Left = ro.left;
        const Right = ro.right;
        const Width = ro.width;
        const Height = ro.height;


        if (x <= Left + Width * 0.2)
            return position.left;
        if (x < Right - Width * 0.2) {
            if (y > Top + Height * 0.5)
                return position.bottom;
            else
                return position.top;
        }

        return position.right;
    }

    filterFirstOrDefault(selector: string, ...elements: Element[]): Element {
        const result = this.filter(selector, ...elements);
        if (result.length > 0)
            return result[0];
    }
    /**
     * 从集合中筛选获取符合选择器的元素
     * @param selector 筛选的选择器
     * @param elements 元素集合
     */
    filter(selector: string, ...elements: Element[]): Element[] {
        const result: Element[] = [];
        for (let index = 0; index < elements.length; index++) {
            const element = elements[index];
            if (element.is(selector))
                result.push(element);
        }
        return result;
    }

    /**
     * 添加移除样式
     * @param cell 列
     * @param newGridClass 需要添加的样式，如果未空则移除样式 
     */
    private addOrRemoveGridClass(cell: Element, newGridClass: string): string {
        const res = cell.className.replace(/(^|\s+)col-\w+-\d+(\s+|$)/, newGridClass);
        if (cell.className == res) {
            cell.classList.add(newGridClass);
        }
        else
            cell.className = res;
        return cell.className;
    }

    // private getBoundingClientRect(element: Element): DOMRect {
    //     const ro = element.getBoundingClientRect();
    //     const Top = ro.top;
    //     const Bottom = ro.bottom;
    //     const Left = ro.left;
    //     const Right = ro.right;
    //     ro.width = ro.width || Right - Left;
    //     ro.height = ro.height || Bottom - Top;
    //     return ro;
    // }

    private static instances: { key: Element; value: BTGrid }[] = [];
    //#endregion
    /**
     * 创建BTGrid
     * @param selector 选择器
     * @param option 配置
     */
    static createFrom(selector: string, option?: GridOption): BTGrid;

    /**
     * 创建BTGrid
     * @param element 元素
     * @param option 配置
     */
    static createFrom(element: Element, option?: GridOption): BTGrid;
    static createFrom(elementOrSelector: Element | string, option?: GridOption): BTGrid {
        let target: Element;
        if (typeof elementOrSelector == 'string')
            target = document.querySelector(elementOrSelector);
        else
            target = elementOrSelector;

        const existInstance = this.instances.find((value: { key: Element; value: BTGrid }) => {
            if (value.key.isSameNode(target)) {
                return value.value;
            }
        });

        if (!Object.isNull(existInstance))
            return existInstance.value;
        if (!Object.isNull(target)) {
            const instance: BTGrid = new BTGrid(target, option);
            this.instances.push({ key: target, value: instance });
            return instance;
        }
    }
}
