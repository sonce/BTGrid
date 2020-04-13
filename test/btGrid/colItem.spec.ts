import chai from 'chai';
var expect = chai.expect;
import BTGrid from '../../src'
import setupTestHelpers from '../baseTest';
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

        // it('移动', function () {

        //     this.cleanupTest();

        //     let gridContent = `
        //     <div class="row">
        //         <div class="col-lg-3" style="width:100px;height:100px;">
        //             <div class="colitem" style="width:100px;height:100px;">
        //             a
        //             </div>
        //         </div>
        //         <div class="col-lg-3" style="width:100px;height:100px;">
        //             <div class="colitem" style="width:100px;height:100px;">
        //             b
        //             </div>
        //             <div class="colitem" style="width:100px;height:100px;">
        //             c
        //             </div>
        //         </div>
        //     </div>
        //     <div class="row">
        //         <div class="col-lg-6">
        //             <div class="colitem">
        //             d
        //             </div>
        //         </div>
        //         <div class="col-lg-6">
        //             <div class="colitem">
        //             e
        //             </div>
        //         </div>
        //     </div>
        //     `
        //     let grid = this.createElement('div', gridContent, 'grid');
        //     let btGrid = BTGrid.createFrom(grid);

        //     let colitem = btGrid.getCellByIndex(0, 1).lastElementChild as HTMLElement;
        //     Object.assign(colitem.style, {
        //         width: "100px",
        //         height: "100px",
        //       })

        //     let target = btGrid.getCellByIndex(0, 0).lastElementChild as HTMLElement;
        //     Object.assign(target.style, {
        //         width: "100px",
        //         height: "100px",
        //       })

        //     let targetRec = target.getBoundingClientRect();
        //     let x = targetRec.left;
        //     let y = targetRec.top;
        //     btGrid.move(colitem, x, y);
        // })
    })
})
