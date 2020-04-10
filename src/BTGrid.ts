import _ from 'lodash';
import cellSizeMode from './cellSizeMode';
import './util';
import GridOption from './GridOption';
/**
 * BTGrid
 */
export default class BTGrid {
    /** 配置 */
    option: GridOption;
    target: HTMLElement;
    rowCount: number;
    constructor(element: HTMLElement, option?: GridOption) {
        const defaultOption = new GridOption();
        if (_.isNil(option))
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
    addWidget(contentEl: HTMLElement): HTMLElement;
    /**
     * 添加WIDGET到指定的位置
     * @param contentEl 内容
     * @param collItemIndex 新增WIGET的位置
     * @param cell 所在列
     * @param row 所在行
     */
    addWidget(contentEl: HTMLElement, row: HTMLElement, cell: HTMLElement, collItemIndex: number): HTMLElement;
    /**
     * 添加列并添加WIDGET
     * @param contentEl 内容
     * @param cellIndex 新增列的位置
     * @param row 所在行
     */
    addWidget(contentEl: HTMLElement, row: HTMLElement, cell: HTMLElement): HTMLElement;
    /**
     * 添加列并添加WIDGET
     * @param contentEl 内容
     * @param cellIndex 新增列的位置
     * @param row 所在行
     */
    addWidget(contentEl: HTMLElement, row: HTMLElement, cellIndex: number): HTMLElement;
    /**
     * 添加行并添加widget
     * @param contentEl 内容
     * @param rowIndex 新增行的位置
     */
    addWidget(contentEl: HTMLElement, rowIndex: number): HTMLElement;
    /**
     * 在行中添加列和widget
     * @param contentEl 内容
     * @param row 行
     */
    addWidget(contentEl: HTMLElement, row: HTMLElement): HTMLElement;
    /**
     * 
     * @param contentEl widget内容
     * @param rowOrAddIndex 行，或者新增行的所在位置
     * @param cellOrAddIndex 列，或新增列的位置
     * @param collItemIndex clitem的位置
     */
    addWidget(contentEl: HTMLElement, rowOrAddIndex?: HTMLElement | number, cellOrAddIndex?: HTMLElement | number, collItemIndex?: number): HTMLElement {

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
    private addNewRow(contentEl: HTMLElement): HTMLElement;
    /**
     * 添加内容到新行
     * @param contentEl 内容
     * @param rowIndex 新行的位置
     */
    private addNewRow(contentEl: HTMLElement, rowIndex: number): HTMLElement;
    /**
     * 添加新行
     * @param contentEl 内容元素
     * @param rowIndex 行索引
     */
    private addNewRow(contentEl: HTMLElement, rowIndex?: number): HTMLElement {
        const newRow = document.createElement('div');

        rowIndex = typeof rowIndex == 'undefined' ? this.rowCount : rowIndex;
        rowIndex = rowIndex < 0 ? 0 : rowIndex;
        // rowIndex = rowIndex >= this.rowCount ? this.rowCount - 1 : rowIndex;

        newRow.dataset.rowIndex = rowIndex.toString();
        newRow.className = this.option.rowClass;

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
    //#endregion

    //#region  cell
    /**
     * 获取全尺寸的样式
     */
    get FullSizeCellClass(): string {
        return this.cellClassFormat.format(this.option.gridCellsCount.toString());
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
    getCell(rowIndex: number, cellX: number): HTMLElement;
    /**
     * 通过坐标获取列
     * @param cellIndex 列位置索引
     * @param ownRow 所在行
     */
    getCell(ownRow: HTMLElement, cellX: number): HTMLElement;
    /**
     * 通过坐标获取列
     * @param cellX CELL的位置，栅格列数量为12，则X值范围为0-11
     * @param ownRow 列所在的行
     */
    getCell(ownRow: HTMLElement | number, cellX: number): HTMLElement;
    /**
     * 通过坐标获取列
     * @param cellX CELL的位置，栅格列数量为12，则X值范围为0-11
     * @param ownRow 列所在的行
     */
    getCell(ownRow: HTMLElement | number, cellX: number): HTMLElement {
        // cellX = cellX > this.option.gridCellsCount ? this.option.gridCellsCount : cellX;
        const cells: HTMLElement[] = this.getCells(ownRow);
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
    getCellByIndex(rowIndex: number, cellIndex: number): HTMLElement;
    /**
     * 通过索引获取列
     * @param cellIndex 列位置索引
     * @param ownRow 所在行
     */
    getCellByIndex(ownRow: HTMLElement, cellIndex: number): HTMLElement;
    /**
     * 通过索引获取列
     * @param cellX CELL的位置，栅格列数量为12，则X值范围为0-11
     * @param ownRow 列所在的行
     */
    getCellByIndex(ownRow: HTMLElement | number, cellIndex: number): HTMLElement {
        const cells: HTMLElement[] = this.getCells(ownRow, cellIndex);
        if (cells.length > 0)
            return cells[0];
    }

    /**
     * 获取列
     * @param ownRowOrIndex 所属行或者行索引
     * @param startCellIndex X的位置
     */
    getCells(ownRowOrIndex: HTMLElement | number, startCellIndex?: number): HTMLElement[] {
        let theRow: HTMLElement;
        if (typeof ownRowOrIndex == 'number')
            theRow = this.getRow(ownRowOrIndex);
        else
            theRow = ownRowOrIndex;

        const cells: HTMLElement[] = Array.from(theRow.querySelectorAll(this.cellSelector));
        const result: HTMLElement[] = [];
        if (cells.length != 0) {
            // let sizeCount = 0;
            if (!_.isNil(startCellIndex)) {
                startCellIndex = startCellIndex < 0 ? 0 : startCellIndex;
                startCellIndex = startCellIndex > cells.length ? cells.length - 1 : startCellIndex;
            }
            else
                startCellIndex = 0;

            for (let index = startCellIndex; index < cells.length; index++) {
                result.push(cells[index]);
            }

            // for (let index = 0; index < cells.length; index++) {
            //     let theCell = cells[index];
            //     let size: number = this.getCellSize(theCell);
            //     sizeCount += size;
            //     if (sizeCount <= cellIndex + 1) {
            //         result.push(theCell);
            //     }
            // }
        }
        return result;
    }

    /**
     * 添加新列
     * @param contentEl 内容元素
     * @param rowIndex 行索引
     */
    addNewCel(contentEl: HTMLElement, rowIndex: number): HTMLElement;
    /**
    * 添加新列
    * @param contentEl 内容元素
    * @param rowIndex 行
    */
    addNewCel(contentEl: HTMLElement, ownRow: HTMLElement): HTMLElement;
    /**
     * 
     * @param contentEl 
     * @param ownRow 
     * @param cellIndex 
     */
    addNewCel(contentEl: HTMLElement, ownRow: HTMLElement, cellIndex: number, width?: number): HTMLElement;
    /**
     * 
     * @param contentEl 
     * @param rowIndex 
     * @param cellIndex 
     */
    addNewCel(contentEl: HTMLElement, rowIndex: number, cellIndex: number, width?: number): HTMLElement;
    /**
     * 
     * @param contentEl 内容元素
     * @param cellIndex 列的X位置
     * @param width 列宽度
     * @param ownRowOrIndex 行索引或者行元素
     */
    addNewCel(contentEl: HTMLElement, ownRowOrIndex: HTMLElement | number, cellIndex?: number, width?: number): HTMLElement {
        let theRow: HTMLElement;
        if (typeof ownRowOrIndex == 'number')
            theRow = this.getRow(ownRowOrIndex);
        else
            theRow = ownRowOrIndex;
        const newCel = document.createElement('div');

        //宽度如果溢出，则调整大小
        if (this.autoCellSize(theRow, newCel, cellIndex, width)) {
            // newCel.appendChild(contentEl);
            const cells = this.getCells(theRow);
            if (cells.length == 0 || _.isNil(cellIndex) || cellIndex >= cells.length)
                theRow.appendChild(newCel);
            else
                theRow.insertBefore(newCel, cells[cellIndex]);

            this.addColItem(contentEl, theRow, newCel);
            return newCel;
        }
    }

    /**
     * 如果可以插入，则返回true，否则返回false
     * @param row 行
     * @param cell 列
     * @param cellIndex 列索引
     * @param width 宽度
     */
    private autoCellSize(row: HTMLElement, cell: HTMLElement, cellIndex: number, width?: number): boolean {
        const cellsCount = this.getCells(row).length;
        //超出了栅格列大小
        if (cellsCount >= this.option.gridCellsCount)
            return false;
        const remainSize = this.getRemainCellsSize(row);
        const remainCellsCount = this.option.gridCellsCount - cellsCount;
        //如果宽度没有指定，且剩余大小大于0
        if (this.option.CellSizeMode == cellSizeMode.None || (remainSize > 0 && _.isNil(width)) || remainSize >= width)
            return this.autoCellSizeOfNone(row, cell, remainSize, width);
        else if (this.option.CellSizeMode == cellSizeMode.AutoShrink)
            return this.autoCellSizeOfShrink(row, cell, cellIndex, remainSize, remainCellsCount, width);
        else
            return this.autoCellSizeOfAverageShrink(row, cell, cellIndex, width);
    }

    autoCellSizeOfAverageShrink(row: HTMLElement, cell: HTMLElement, cellIndex: number, width?: number): boolean {
        const cells = this.getCells(row);
        let cellsCount = cells.length;
        const remainCellsCount = this.option.gridCellsCount - cellsCount;
        let dueGridSize = this.option.gridCellsCount;
        const noWidth = _.isNil(width);

        //如果未指明宽度，则将此列也均分。
        if (noWidth)
            cellsCount += 1;
        else {
            //如果指明了宽度，总宽度-此列宽度，均分现有列。
            width = width > remainCellsCount ? remainCellsCount : width;
            dueGridSize -= width;
        }

        let perWidth = dueGridSize / cellsCount;
        //为设置宽度，则平均获取宽度
        if (noWidth)
            width = Math.trunc(perWidth);
        //未能整除，其余的宽度放入新列
        if (!Number.isInteger(perWidth)) {
            perWidth = Math.trunc(perWidth);
            width = this.option.gridCellsCount - perWidth * cells.length;
        }

        this.addOrRemoveGridClass(cell, this.GetCellClass(width));
        cells.forEach(theCel => {
            this.addOrRemoveGridClass(theCel, this.GetCellClass(perWidth));
        });
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
    autoCellSizeOfShrink(row: HTMLElement, cell: HTMLElement, cellIndex: number, remainSize: number, remainCellsCount: number, width?: number): boolean {
        width = _.isNil(width) ? 1 : width;
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
    private thrinkTheCell(theCel: HTMLElement, thrinkRemainSize: number): number {
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
    private autoCellSizeOfNone(row: HTMLElement, cell: HTMLElement, remainSize: number, width?: number): boolean {
        if (remainSize == 0)
            return false;
        width = _.isNil(width) ? 1 : width;
        width = remainSize > width ? width : remainSize;
        cell.className = this.cellClassFormat.format(width.toString());
        return true;
    }

    // private autoCellSizeOfShrink(row: HTMLElement, cell: HTMLElement, cellIndex: number, remainSize: number, width?: number):boolean {
    //     width = _.isNil(width) ? 1 : width;
    //     width = remainSize > width ? width : remainSize;

    //     let cells = this.getCells(row);

    // }

    // /**
    //  * 获取该位置能够放入CELL最大的宽度
    //  * @param cellIndex 插入Cell的位置,空则最后一列
    //  * @param ownRow 所在行
    //  */
    // getAddMaxWidth(ownRow: HTMLElement, cellIndex?: number): number {
    //     const cells: HTMLElement[] = this.getCells(ownRow);
    //     if (typeof cellIndex != 'undefined' && cellIndex != null) {
    //         cellIndex = cellIndex < 0 ? 0 : cellIndex;
    //         cellIndex = cellIndex > cells.length ? cells.length : cellIndex;
    //     }
    //     else
    //         cellIndex = cells.length;

    //     let sizeCount = 0;
    //     for (let index = 0; index < cellIndex; index++) {
    //         const size = this.getCellSize(cells[index]);
    //         sizeCount += size;
    //     }
    //     return this.gridCellsCount - sizeCount;
    // }


    /**
     * 获取当前行中列所占用的大小
     * @param ownRowOrIndex 所在行或者行索引
     */
    getExistCellsSize(ownRowOrIndex: HTMLElement | number): number {
        const cells = this.getCells(ownRowOrIndex);
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
     */
    getRemainCellsSize(ownRowOrIndex: HTMLElement | number): number {
        const existSize = this.getExistCellsSize(ownRowOrIndex);
        return this.option.gridCellsCount - existSize;
    }

    /**
     * 获取栅格列的大小。col-lg-3,则返回3。如果没有对应的栅格列样式，则返回0
     * @param cell 需要获取size的列。
     */
    getCellSize(cell: HTMLElement): number {
        if (_.isEmpty(cell.className))
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
    getCellX(row: HTMLElement | number, cellIndex: number): number {
        const cells = this.getCells(row);
        let x = 0;
        for (let index = 0; index < cellIndex; index++) {
            const element = cells[index];
            x += this.getCellSize(element);
        }
        return x;
    }

    /**
     * 添加移除样式
     * @param cell 列
     * @param newGridClass 需要添加的样式，如果未空则移除样式 
     */
    private addOrRemoveGridClass(cell: HTMLElement, newGridClass = ''): string {
        const res = cell.className.replace(/(^|\s+)col-\w+-\d+(\s+|$)/, newGridClass);
        if (cell.className == res) {
            cell.classList.add(newGridClass);
        }
        else
            cell.className = res;
        return cell.className;
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
    addColItem(contentEl: HTMLElement, ownRow: HTMLElement, ownCell: HTMLElement, itemIndex: number): HTMLElement;
    /**
     * 添加ColItem到列中
     * @param contentEl 内容元素
     * @param cellIndex 所在的列
     * @param rowIndex 所在的行
     * @param itemIndex ColItem的纵向位置
     */
    addColItem(contentEl: HTMLElement, rowIndex: number, cellIndex: number, itemIndex: number): HTMLElement;
    /**
     * 添加ColItem到列中
     * @param contentEl 内容元素
     * @param ownCell 所在的列
     * @param ownRow 所在的行
     */
    addColItem(contentEl: HTMLElement, ownRow: HTMLElement, ownCell: HTMLElement): HTMLElement;
    /**
     * 添加ColItem到列中
     * @param contentEl 内容元素
     * @param cellIndex 列的位置
     * @param ownRow 所在的行
     */
    addColItem(contentEl: HTMLElement, ownRow: HTMLElement, cellIndex: number): HTMLElement;
    addColItem(contentEl: HTMLElement, ownRowOrIndex: HTMLElement | number, cellElOrIndex: HTMLElement | number, itemIndex?: number): HTMLElement {
        let theCell: HTMLElement;
        if (typeof cellElOrIndex == 'number') {
            if (typeof ownRowOrIndex == 'number')
                theCell = this.getCellByIndex(ownRowOrIndex, cellElOrIndex);
            else
                theCell = this.getCellByIndex(ownRowOrIndex, cellElOrIndex);
        }
        else
            theCell = cellElOrIndex;
        const cellItem = document.createElement('div');
        cellItem.className = 'colitem';
        cellItem.appendChild(contentEl);
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
    private getColItems(cell: HTMLElement): HTMLElement[] {
        const colItems = cell.querySelectorAll<HTMLElement>(this.colItemSelector);
        return Array.from(colItems);
    }
    //#endregion

    /**
     * 创建BTGrid
     * @param selector 选择器
     * @param option 配置
     */
    static createFrom(selector: string, option?: GridOption): BTGrid[];

    /**
     * 创建BTGrid
     * @param element 元素
     * @param option 配置
     */
    static createFrom(element: HTMLElement, option?: GridOption): BTGrid;
    static createFrom(elementOrSelector: HTMLElement | string, option?: GridOption): BTGrid[] | BTGrid {
        if (_.isNil(elementOrSelector))
            return null;
        let targets: HTMLElement[] = [];
        if (typeof elementOrSelector == 'string')
            targets = Array.from(document.querySelectorAll(elementOrSelector));
        else
            targets.push(elementOrSelector);

        const instances: BTGrid[] = [];
        targets.forEach(element => {
            instances.push(new BTGrid(element, option));
        });
        if (typeof elementOrSelector == 'string')
            return instances;
        else
            return instances[0];
    }
}
