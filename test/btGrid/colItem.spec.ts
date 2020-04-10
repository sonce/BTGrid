import expect from 'expect.js'
import BTGrid from '../../src'
import setupTestHelpers from '../baseTest';
import _ from 'lodash';
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
    })
})
