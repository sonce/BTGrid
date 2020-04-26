import { expect } from 'chai';
import BTGrid from '../../src'
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

    describe('项', function () {
        it('添加项-空列', function () {
            let gridContent = `
            <div class="row">
                <div class="col-lg-12"></div>
            </div>
            `
            let grid = this.createElement('div', gridContent, 'grid');
            let btGrid = BTGrid.createFrom(grid);
            let row = btGrid.getRow(0);

            let enptyCell = btGrid.getCell(0, 0);
            let newContent = this.createElement('div', '1', null, true);
            btGrid.addColItem(newContent, row, 0);
            expect(enptyCell.textContent).to.equal('1');
        })

        it('添加项-已经存在Colitem', function () {
            let gridContent = `
            <div class="row">
                <div class="col-lg-12">
                    <div class="colitem">0</div>
                </div>
            </div>
            `
            let grid = this.createElement('div', gridContent, 'grid');
            let btGrid = BTGrid.createFrom(grid);
            let row = btGrid.getRow(0);

            let cell = btGrid.getCell(0, 0);
            let newContent = this.createElement('div', '1', null, true);
            btGrid.addColItem(newContent, row, 0);
            expect(cell.lastElementChild.textContent).to.equal('1');
        })

        it('添加项-插入指定位置', function () {
            let gridContent = `
            <div class="row">
                <div class="col-lg-12">
                    <div class="colitem">0</div>
                    <div class="colitem">2</div>
                </div>
            </div>
            `
            let grid = this.createElement('div', gridContent, 'grid');
            let btGrid = BTGrid.createFrom(grid);
            let row = btGrid.getRow(0);

            let cell = btGrid.getCell(0, 0);
            let newContent = this.createElement('div', '1', null, true);
            btGrid.addColItem(newContent, 0, 0, 1);
            expect(cell.children[1].textContent).to.equal('1');
        })

        it('删除ColItem', function () {
            let gridContent = `
            <div class="row">
                <div class="col-lg-3">
                    <div class="colitem">
                    </div>
                </div>
                <div class="col-lg-3">
                    <div class="colitem">
                    </div>
                    <div class="colitem">
                    </div>
                </div>
            </div>
            `
            let grid = this.createElement('div', gridContent, 'grid');
            let btGrid = BTGrid.createFrom(grid, { CellSizeMode: cellSizeMode.AutoAverageShrink });

            let row1 = btGrid.getRow(0);
            //只有一个项
            let cell = btGrid.getCellByIndex(row1, 0);
            btGrid.removeColItem(cell.firstElementChild);
            expect(row1.childElementCount).to.equal(1);

            //有多个项
            cell = btGrid.getCellByIndex(row1, 0);
            btGrid.removeColItem(cell.firstElementChild);
            expect(row1.childElementCount).to.equal(1);
            expect(cell.childElementCount).to.equal(1);
        })

        it('移动', function () {

            this.cleanupTest();

            let gridContent = `
            <div class="row">
                <div class="col-lg-6">
                    <div class="colitem">Me</div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-6">
                    <div class="colitem">上下插入</div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-6">
                    <div class="colitem">左右插入</div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-1"><div class="colitem">CELLSIZE</div></div>
                <div class="col-lg-1"><div class="colitem">CELLSIZE</div></div>
                <div class="col-lg-1"><div class="colitem">CELLSIZE</div></div>
                <div class="col-lg-1"><div class="colitem">CELLSIZE</div></div>
                <div class="col-lg-1"><div class="colitem">CELLSIZE</div></div>
                <div class="col-lg-1"><div class="colitem">CELLSIZE</div></div>
                <div class="col-lg-1"><div class="colitem">CELLSIZE</div></div>
                <div class="col-lg-1"><div class="colitem">CELLSIZE</div></div>
                <div class="col-lg-1"><div class="colitem">CELLSIZE</div></div>
                <div class="col-lg-1"><div class="colitem">CELLSIZE</div></div>
                <div class="col-lg-1"><div class="colitem">CELLSIZE</div></div>
                <div class="col-lg-1"><div class="colitem">CELLSIZE</div></div>
            </div>
            `
            let grid = this.createElement('div', gridContent, 'grid');
            let btGrid = BTGrid.createFrom(grid);

            let colitem = btGrid.getCellByIndex(0, 0).lastElementChild as HTMLElement;
            let row1 = btGrid.getRow(1);
            let row2 = btGrid.getRow(2);
            let row3 = btGrid.getRow(3);

            //自身，不允许
            let roMe = colitem.getBoundingClientRect();
            var Top = roMe.top;
            var Bottom = roMe.bottom;
            var Left = roMe.left;
            var Right = roMe.right;
            var Width = roMe.width || Right - Left;
            var Height = roMe.height || Bottom - Top;
            expect(btGrid.move(colitem, Left + 2, Top + Height / 2)).to.be.false;

            //上下插入
            let target = btGrid.getCellByIndex(row1, 0).lastElementChild as HTMLElement;

            //上
            let ro = target.getBoundingClientRect();
            Top = ro.top;
            Bottom = ro.bottom;
            Left = ro.left;
            Right = ro.right;
            Width = ro.width || Right - Left;
            Height = ro.height || Bottom - Top;
            expect(btGrid.move(colitem, Left + Width * 0.2 + 1, Top + 1, true)).to.be.true;
            expect(target.previousElementSibling).to.equal(colitem);
            expect(btGrid.rowCount).to.equal(3);
            //下
            ro = target.getBoundingClientRect();
            Top = ro.top;
            Bottom = ro.bottom;
            Left = ro.left;
            Right = ro.right;
            Width = ro.width || Right - Left;
            Height = ro.height || Bottom - Top;
            expect(btGrid.move(colitem, Left + Width * 0.2 + 1, Bottom - 1, true)).to.be.true;
            expect(target.nextElementSibling).to.equal(colitem);
            expect(btGrid.rowCount).to.equal(3);

            //左右新列插入
            target = btGrid.getCellByIndex(row2, 0).lastElementChild as HTMLElement;

            //左边
            btGrid.option.CellSizeMode = cellSizeMode.None;
            ro = target.getBoundingClientRect();
            Top = ro.top;
            Bottom = ro.bottom;
            Left = ro.left;
            Right = ro.right;
            Width = ro.width || Right - Left;
            Height = ro.height || Bottom - Top;
            expect(btGrid.move(colitem, Left + 1, Top + 1, true)).to.be.true;
            expect(btGrid.getCells(row2).length).to.equal(2);
            expect(btGrid.getCellByIndex(row2, 0).textContent).to.equal('Me');
            //右边
            ro = target.getBoundingClientRect();
            Top = ro.top;
            Bottom = ro.bottom;
            Left = ro.left;
            Right = ro.right;
            Width = ro.width || Right - Left;
            Height = ro.height || Bottom - Top;
            expect(btGrid.move(colitem, Right - 1, Top + 1,false)).to.be.true;
            expect(btGrid.move(colitem, Right - 1, Top + 1, true)).to.be.true;
            expect(btGrid.getCells(row2).length).to.equal(2);
            expect(btGrid.getCellByIndex(row2, 1).textContent).to.equal('Me');

            //三种列大小模式的处理
            btGrid.option.CellSizeMode = cellSizeMode.None;
            target = btGrid.getCellByIndex(row3, 0).lastElementChild as HTMLElement;
            ro = target.getBoundingClientRect();
            Top = ro.top;
            Bottom = ro.bottom;
            Left = ro.left;
            Right = ro.right;
            Width = ro.width || Right - Left;
            Height = ro.height || Bottom - Top;
            expect(btGrid.move(colitem, Left + 1, Top + 1, true)).to.be.false;
        })

        it('调整大小', function () {
            let gridContent = `
            <div class="row">
                <div class="col-lg-12">
                    <div class="colitem">a</div>
                </div>
            </div>
            `

            let grid = this.createElement('div', gridContent, 'grid');
            let btGrid = BTGrid.createFrom(grid);
            let colitem = btGrid.getCellByIndex(0, 0).lastElementChild;
            btGrid.resizeColItem(colitem, 200);
            let roMe = colitem.getBoundingClientRect();
            var Top = roMe.top;
            var Bottom = roMe.bottom;
            var Height = roMe.height || Bottom - Top;
            expect(Height).to.be.equal(200);
        })
    })
})
