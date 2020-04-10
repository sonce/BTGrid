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

    describe('行', function () {
        it('获取行中列的大小总和', function () {
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
            let size = btGrid.getExistCellsSize(row)
            expect(size).to.equal(5);

            let row2 = btGrid.getRow(1);
            let size2 = btGrid.getExistCellsSize(row2)
            expect(size2).to.equal(0);
        })

        it('获取行剩下的大小', function () {
            let gridContent = `
            <div class="row">
                <div class="col-lg-2">列0</div>
                <div class="col-lg-3">列1</div>
            </div>
            <div class="row"></div>
            `
            let grid = this.createElement('div', gridContent, 'grid');
            let btGrid = BTGrid.createFrom(grid);

            let row0 = btGrid.getRow(0);
            let remainsize0 = btGrid.getRemainCellsSize(row0)
            expect(remainsize0).to.equal(7);


            let remainsize1 = btGrid.getRemainCellsSize(1)
            expect(remainsize1).to.equal(12);
        })

        it('获取行数', function () {
            let grid = this.createElement('div', '<div class="row"></div><div class="row"></div>', 'grid');
            let btGrid = BTGrid.createFrom(grid);
            expect(btGrid.getRowsCount()).to.equal(2);
        })
        it('通过索引获取行', function () {
            let grid = this.createElement('div', '<div class="row"></div><div class="row"></div>', 'grid');
            let btGrid = BTGrid.createFrom(grid);
            expect(btGrid.getRow(0)).not.equal(undefined);
            expect(btGrid.getRow(2)).equal(undefined);
        })
    })
})
