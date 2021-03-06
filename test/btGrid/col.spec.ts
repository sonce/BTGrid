import { expect } from 'chai';
import BTGrid from '../../src';
import setupTestHelpers from '../baseTest.spec';
import cellSizeMode from '../../src/cellSizeMode';

describe("BTGrid.ts", () => {
    'use strict';

    beforeEach(function () {
        setupTestHelpers.call(this);
    });

    afterEach(function () {
        this.cleanupTest();
    });

    describe('列', function () {
        it('获取列大小', function () {
            let gridContent = `
            <div class="row">
                <div class="col-lg-2">列0</div>
                <div class="testclass">列1</div>
                <div></div>
            </div>
            `
            let grid = this.createElement('div', gridContent, 'grid');
            let btGrid = BTGrid.createFrom(grid);
            let row = btGrid.getRow(0)
            let cell1 = btGrid.getCell(row, 0);
            let cell2 = row.children[1] as HTMLElement;
            let cell3 = row.children[2] as HTMLElement;
            expect(btGrid.getCellSize(cell1)).to.equal(2);
            expect(btGrid.getCellSize(cell2)).to.equal(0);
            expect(btGrid.getCellSize(cell3)).to.equal(0);
        })

        it('获取列的X位置', function () {
            let gridContent = `
            <div class="row">
                <div class="col-lg-2"></div>
                <div class="col-lg-1"></div>
                <div class="col-lg-2"></div>
            </div>
            `
            let grid = this.createElement('div', gridContent, 'grid');
            let btGrid = BTGrid.createFrom(grid);

            let x = btGrid.getCellX(0, 2);
            expect(x).to.equal(3);
        })

        it('获取列', function () {
            let gridContent = `
            <div class="row">
                <div class="col-lg-2">列0</div>
                <div class="col-lg-3">列1</div>
            </div>
            <div class="row">
            </div>
            `
            let grid = this.createElement('div', gridContent, 'grid');
            let btGrid = BTGrid.createFrom(grid);

            let row = btGrid.getRow(0);
            let cell = btGrid.getCell(0, 3);
            expect(cell.textContent).to.equal('列1');
            cell = btGrid.getCell(0, 14);
            expect(cell.textContent).to.equal('列1');
            cell = btGrid.getCellByIndex(0, 13);
            expect(cell.textContent).to.equal('列1');
            cell = btGrid.getCell(row, 0);
            expect(cell.textContent).to.equal('列0');
            cell = btGrid.getCell(row, -1);
            expect(cell.textContent).to.equal('列0');

            cell = btGrid.getCellByIndex(row, 0);
            expect(cell.textContent).to.equal('列0');
            cell = btGrid.getCellByIndex(0, 0);
            expect(cell.textContent).to.equal('列0');

            row = btGrid.getRow(1);
            cell = btGrid.getCellByIndex(row, 0);
            expect(Object.isNull(cell)).to.be.true;
        })

        it('添加新列-None', function () {
            let gridContent = `
            <div class="row"></div>
            <div class="row"></div>
            <div class="row">
                <div class="col-lg-2">列0</div>
                <div class="col-lg-3">列1</div>
            </div>
            <div class="row">
                <div class="col-lg-2">列0</div>
                <div class="col-lg-3">列1</div>
            </div>
            `
            let grid = this.createElement('div', gridContent, 'grid');
            let btGrid = BTGrid.createFrom(grid, { CellSizeMode: cellSizeMode.None });


            //插入到第一行,空行
            let newContent1 = this.createElement('div', '1', '', true);
            let cell = btGrid.addNewCel(newContent1, 0);
            cell = btGrid.getCellByIndex(0, 0);
            expect(cell.textContent).to.equal('1');
            expect(cell.className).to.equal(btGrid.GetCellClass(1));

            //第二行，空行，列宽度大于12
            let noCellRow2 = btGrid.getRow(1);
            let newContent21 = this.createElement('div', '2-1', '', true);
            cell = btGrid.addNewCel(newContent21, noCellRow2, 1, 13);
            expect(cell.className).to.equal(btGrid.FullSizeCellClass);
            //不能插入，宽度已经达到最大值12
            let newContent22 = this.createElement('div', '2-2', '', true);
            cell = btGrid.addNewCel(newContent22, noCellRow2, 1, 13);
            expect(Object.isNull(cell)).to.be.true;


            //存在列，计算剩余大小
            let newContent3 = this.createElement('div', '31', '', true);
            cell = btGrid.addNewCel(newContent3, 2, 1, 1);
            expect(cell.className).to.equal(btGrid.GetCellClass(1));
            expect(cell.textContent).to.equal('31');

            let newContent4 = this.createElement('div', '4', '', true);
            let hasCellRow2 = btGrid.getRow(3);
            cell = btGrid.addNewCel(newContent4, hasCellRow2, 1);
            expect(cell.textContent).to.equal('4');
        })

        it('添加列-Thrink', function () {
            let gridContent = `
            <div class="row">
                <div class="col-lg-6">满栅格列1</div>
                <div class="col-lg-6">满栅格列2</div>
            </div>
            <div class="row">
                <div class="col-lg-6">不满栅格列1，刚好够新列</div>
                <div class="col-lg-4">不满栅格列2，刚好够新列</div>
            </div>
            <div class="row">
                <div class="col-lg-6">不满栅格列1，不够新列</div>
                <div class="col-lg-5">不满栅格列2，不够新列</div>
            </div>
            <div class="row">
                <div class="col-lg-4"></div>
                <div class="col-lg-2"></div>
                <div class="col-lg-1"></div>
                <div class="col-lg-5"></div>
            </div>
            <div class="row">
                <div class="col-lg-1"></div>
                <div class="col-lg-1"></div>
                <div class="col-lg-1"></div>
                <div class="col-lg-1"></div>
                <div class="col-lg-1"></div>
                <div class="col-lg-1"></div>
                <div class="col-lg-1"></div>
                <div class="col-lg-1"></div>
                <div class="col-lg-1"></div>
                <div class="col-lg-1"></div>
                <div class="col-lg-1"></div>
                <div class="col-lg-1"></div>
            </div>
            <div class="row">
                <div class="col-lg-5"></div>
                <div class="col-lg-7"></div>
            </div>
            <div class="row">
                <div class="col-lg-1"></div>
                <div class="col-lg-7"></div>
            </div>
            `
            let grid = this.createElement('div', gridContent, 'grid');
            let btGrid = BTGrid.createFrom(grid, { CellSizeMode: cellSizeMode.AutoShrink });
            let content = this.createElement('div', '列2', null, true);

            //大小12，插入大小2，需收缩2
            let newCell = btGrid.addNewCel(content, 0, 2, 2);
            expect(!Object.isNull(newCell)).to.be.true;
            let thirdCell = btGrid.getCellByIndex(0, 1);
            expect(btGrid.getCellSize(thirdCell)).to.equal(4);

            //大小10，插入大小2，无需收缩
            newCell = btGrid.addNewCel(content, 1, 1, 2);
            expect(!Object.isNull(newCell)).to.be.true;
            thirdCell = btGrid.getCellByIndex(1, 2);
            expect(btGrid.getCellSize(thirdCell)).to.equal(4);

            //大小11，插入大小2，需收缩1
            newCell = btGrid.addNewCel(content, 2, 1, 2);
            expect(!Object.isNull(newCell)).to.be.true;
            thirdCell = btGrid.getCellByIndex(2, 2);
            expect(btGrid.getCellSize(thirdCell)).to.equal(4);

            //大小12，共4列，插入大小9,自身收缩到8，其余收缩到1
            newCell = btGrid.addNewCel(content, 3, 2, 9);
            expect(!Object.isNull(newCell)).to.be.true;
            let Cell1 = btGrid.getCellByIndex(3, 0);
            let Cell2 = btGrid.getCellByIndex(3, 1);
            let Cell3 = btGrid.getCellByIndex(3, 2);
            let Cell4 = btGrid.getCellByIndex(3, 3);
            let Cell5 = btGrid.getCellByIndex(3, 4);
            expect(btGrid.getCellSize(Cell3)).to.equal(8);
            expect(btGrid.getCellSize(Cell2)).to.equal(1);
            expect(btGrid.getCellSize(Cell5)).to.equal(1);
            expect(btGrid.getCellSize(Cell4)).to.equal(1);
            expect(btGrid.getCellSize(Cell1)).to.equal(1);

            //无法插入
            newCell = btGrid.addNewCel(content, 4, 1);
            expect(Object.isNull(newCell)).to.be.true;

            //5,5列，不传宽度
            newCell = btGrid.addNewCel(content, 5, 1);
            expect(btGrid.getCellSize(newCell)).to.be.equal(1);

            //插入头部，只能收缩右边列
            newCell = btGrid.addNewCel(content, 6, 0, 12);
            expect(btGrid.getCellSize(newCell)).to.be.equal(10);
        })

        it('添加列-AutoAverageThrink', function () {
            let gridContent = `
            <div class="row">
                <div class="col-lg-3"></div>
                <div class="col-lg-3"></div>
                <div class="col-lg-3"></div>
                <div class="col-lg-3"></div>
            </div>
            <div class="row">
                <div class="col-lg-3"></div>
                <div class="col-lg-3"></div>
                <div class="col-lg-3"></div>
            </div>
            <div class="row">
                <div class="col-lg-4"></div>
                <div class="col-lg-3"></div>
                <div class="col-lg-3"></div>
            </div>
            <div class="row">
                <div class="col-lg-12"></div>
            </div>
            `
            let grid = this.createElement('div', gridContent, 'grid');
            let btGrid = BTGrid.createFrom(grid, { CellSizeMode: cellSizeMode.AutoAverageShrink });
            let content = this.createElement('div', '列2', null, true);

            //满列 3列，平均分。每列4
            let oldCells = btGrid.getCells(0);
            let newCel = btGrid.addNewCel(content, 0, 5, 1);
            for (let index = 0; index < oldCells.length; index++) {
                const theCel = oldCells[index];
                if (index == oldCells.length - 1)
                    expect(btGrid.getCellSize(theCel)).to.equal(2);
                else
                    expect(btGrid.getCellSize(theCel)).to.equal(3);
            }
            expect(btGrid.getCellSize(newCel)).to.equal(1);

            //不满列 3*3列。插入6。
            oldCells = btGrid.getCells(1);
            newCel = btGrid.addNewCel(content, 1, 1, 6);
            oldCells.forEach(theCel => {
                expect(btGrid.getCellSize(theCel)).to.equal(2);
            });
            expect(btGrid.getCellSize(newCel)).to.equal(6);

            //不满列 。插入大于剩余列的新列
            oldCells = btGrid.getCells(2);
            newCel = btGrid.addNewCel(content, 2, 1, 12);
            oldCells.forEach(theCel => {
                expect(btGrid.getCellSize(theCel)).to.equal(1);
            });
            expect(btGrid.getCellSize(newCel)).to.equal(9);

            let oldCel = btGrid.getCellByIndex(3,0);
            newCel = btGrid.addNewCel(content,3,1);
            expect(oldCel.className).to.equal('col-lg-6');
            expect(newCel.className).to.equal('col-lg-6');
        })

        it('列-AutoAverageThrink', function () {
            let gridContent = `
            <div class="row">
                <div class="col-lg-1"></div>
                <div class="col-lg-1"></div>
                <div class="col-lg-1"></div>
                <div class="col-lg-1"></div>
                <div class="col-lg-1"></div>
            </div>
            `
            let grid = this.createElement('div', gridContent, 'grid');
            let btGrid = BTGrid.createFrom(grid, { CellSizeMode: cellSizeMode.AutoAverageShrink });
            btGrid.autoCellSizeOfAverageShrink(btGrid.getRow(0));
            let cell1 = btGrid.getCellByIndex(0, 0);
            expect(cell1.className).to.equal('col-lg-2');
            let cell2 = btGrid.getCellByIndex(0, 1);
            expect(cell2.className).to.equal('col-lg-2');
            let cell3 = btGrid.getCellByIndex(0, 2);
            expect(cell3.className).to.equal('col-lg-2');
            let cell4 = btGrid.getCellByIndex(0, 3);
            expect(cell4.className).to.equal('col-lg-2');
            let cell5 = btGrid.getCellByIndex(0, 4);
            expect(cell5.className).to.equal('col-lg-4');
        })

        it('删除列', function () {
            let gridContent = `
            <div class="row">
                <div class="col-lg-2">列0</div>
                <div class="col-lg-3">列1</div>
            </div>
            `
            let grid = this.createElement('div', gridContent, 'grid');
            let btGrid = BTGrid.createFrom(grid);

            let row = btGrid.getRow(0);
            let cell = btGrid.getCellByIndex(row, 0);

            btGrid.removeCel(cell);
            expect(row.childElementCount).to.equal(1);
            cell = btGrid.getCellByIndex(row, 0);
            btGrid.removeCel(cell);
            expect(row.childElementCount).to.equal(0);
            expect(btGrid.rowCount).to.equal(0);
        })

        it('调整大小', function () {
            let gridContent = `
            <div class="row">
                <div class="col-lg-5">列1</div>
                <div class="col-lg-3">列2</div>
                <div class="col-lg-1">列3</div>
                <div class="col-lg-3">列4</div>
            </div>
            `

            let grid = this.createElement('div', gridContent, 'grid');
            let btGrid = BTGrid.createFrom(grid);
            let secondCol = btGrid.getCellByIndex(0, 1);
            let thirdCol = btGrid.getCellByIndex(0, 2);
            let firstCol = btGrid.getCellByIndex(0, 0);
            let lastCol = btGrid.getCellByIndex(0, 3);
            //第一列不允许调整位置
            let roMe = firstCol.getBoundingClientRect();
            var Top = roMe.top;
            var Bottom = roMe.bottom;
            var Left = roMe.left;
            var Right = roMe.right;
            var Width = roMe.width || Right - Left;
            var Height = roMe.height || Bottom - Top;

            const size = btGrid.getCellSize(secondCol);
            const perWidth = Width / size;

            expect(btGrid.resizeCol(firstCol, Left - perWidth, Width + perWidth)).not.to.ok;

            //最后一列不允许向右调整大小
            roMe = lastCol.getBoundingClientRect();
            Top = roMe.top;
            Bottom = roMe.bottom;
            Left = roMe.left;
            Right = roMe.right;
            Width = roMe.width || Right - Left;
            Height = roMe.height || Bottom - Top;
            expect(btGrid.resizeCol(lastCol, Left, Width + perWidth)).not.to.ok;

            //下一列为1不允许调整
            roMe = secondCol.getBoundingClientRect();
            Top = roMe.top;
            Bottom = roMe.bottom;
            Left = roMe.left;
            Right = roMe.right;
            Width = roMe.width || Right - Left;
            Height = roMe.height || Bottom - Top;
            expect(btGrid.resizeCol(secondCol, Left, Width + perWidth)).not.to.be.ok;

            //调整超出下一列的大小
            roMe = thirdCol.getBoundingClientRect();
            Top = roMe.top;
            Bottom = roMe.bottom;
            Left = roMe.left;
            Right = roMe.right;
            Width = roMe.width || Right - Left;
            Height = roMe.height || Bottom - Top;
            expect(btGrid.resizeCol(thirdCol, Left, Width + perWidth * 2)).to.be.ok;
            expect(btGrid.getCellSize(thirdCol)).to.be.equal(3);
            expect(btGrid.getCellSize(lastCol)).to.be.equal(1);

            //未改变
            roMe = lastCol.getBoundingClientRect();
            Top = roMe.top;
            Bottom = roMe.bottom;
            Left = roMe.left;
            Right = roMe.right;
            Width = roMe.width || Right - Left;
            Height = roMe.height || Bottom - Top;
            expect(btGrid.resizeCol(lastCol, Left, Width - perWidth)).not.to.be.ok;

            //缩小第三列
            roMe = thirdCol.getBoundingClientRect();
            Top = roMe.top;
            Bottom = roMe.bottom;
            Left = roMe.left;
            Right = roMe.right;
            Width = roMe.width || Right - Left;
            Height = roMe.height || Bottom - Top;
            expect(btGrid.resizeCol(thirdCol, Left, Width - perWidth * 2)).to.be.ok;
            expect(btGrid.getCellSize(thirdCol)).to.equal(1);
            expect(btGrid.getCellSize(lastCol)).to.equal(3);
        })
    })
})
