import { expect } from 'chai';
import BTGrid from '../src'
import setupTestHelpers from './baseTest.spec';
import cellSizeMode from '../src/cellSizeMode';

describe("BTGrid.ts", () => {
    'use strict';

    beforeEach(function () {
        setupTestHelpers.call(this);
    });

    afterEach(function () {
        this.cleanupTest();
    });

    describe('添加widget', function () {
        it('新增WIDGET-空GRID', function () {
            let grid = this.createElement("div", null, "grid");
            let contentEl = this.createElement('div', 'content');
            let btGrid = BTGrid.createFrom(grid);
            btGrid.addWidget(contentEl);
            expect(btGrid.rowCount).to.equal(1);
        })

        it('新增WIDGET-新增行到指定位置', function () {
            let grid = this.createElement('div', '<div class="row"></div><div class="row"></div>', 'grid');
            let btGrid = BTGrid.createFrom(grid);

            let contentEl = this.createElement('div', '1', null, true);
            btGrid.addWidget(contentEl, 1);
            let row1 = btGrid.getRow(1);
            let newCell1 = btGrid.getCellByIndex(1, 0);
            expect(btGrid.rowCount).to.equal(3);
            expect(newCell1.textContent).to.equal('1');
            // expect(newCell1.classList.contains(btGrid.FullSizeCellClass)).to.ok();
            expect(newCell1.firstElementChild.classList.contains(btGrid.option.colItemClass)).to.be.true;
            let contentEl2 = this.createElement('div', '2', null, true);
            btGrid.addWidget(contentEl2, -1);
            let newCell2 = btGrid.getRow(0);
            expect(newCell2.textContent).to.equal('2');

        })

        it('新增WIDGET-新增列', function () {
            let grid = this.createElement('div', '<div class="row"></div><div class="row"></div>', 'grid');
            let contentEl = this.createElement('div', '2');
            let btGrid = BTGrid.createFrom(grid);
            let row = btGrid.getRow(1);
            btGrid.addWidget(contentEl, row);
            expect(btGrid.rowCount).to.equal(2);
            expect(btGrid.getRow(1).textContent).to.equal('2');
            // expect(btGrid.getRow(1).firstElementChild.classList.contains(btGrid.FullSizeCellClass)).to.ok();
            expect(btGrid.getRow(1).firstElementChild.firstElementChild.classList.contains(btGrid.option.colItemClass)).to.be.true;
        })

        it('新增WIDGET-新增列到指定位置', function () {
            let gridContent = `
            <div class="row"></div>
            <div class="row">
                <div class="col-lg-2">列0</div>
                <div class="col-lg-3">列1</div>
            </div>
            <div class="row"></div>
            `
            let grid = this.createElement('div', gridContent, 'grid');
            let contentEl = this.createElement('div', '2');
            let btGrid = BTGrid.createFrom(grid);
            let row = btGrid.getRow(1);
            btGrid.addWidget(contentEl, row, 1);
            expect(btGrid.rowCount).to.equal(3);
            expect(row.childElementCount).to.equal(3);
            expect(row.children[1].textContent).to.equal('2');
            // expect(row.children[1].classList.contains(btGrid.GetCellClass(btGrid.gridCellsCount - 2))).to.ok();
        })

        it('新增WIDGET-指定列', function () {
            let gridContent = `
            <div class="row"></div>
            <div class="row">
                <div class="col-lg-2">列0</div>
                <div class="col-lg-3"></div>
            </div>
            <div class="row"></div>
            `
            let grid = this.createElement('div', gridContent, 'grid');
            let contentEl = this.createElement('div', '2');
            let btGrid = BTGrid.createFrom(grid);
            let row = btGrid.getRow(1);
            let cell = row.children[1] as HTMLElement;
            btGrid.addWidget(contentEl, row, cell);
            expect(btGrid.rowCount).to.equal(3);
            expect(row.childElementCount).to.equal(2);
            expect(row.children[1].textContent).to.equal('2');
            expect(cell.childElementCount).to.equal(1);
        })

        it('新增WIDGET-指定列中的位置', function () {
            let gridContent = `
            <div class="row">
                <div class="col-lg-3">
                    <div class="colitem">1</div>
                    <div class="colitem">3</div>
                </div>
            </div>
            `
            let grid = this.createElement('div', gridContent, 'grid');
            let contentEl = this.createElement('div', '2', null, true);
            let btGrid = BTGrid.createFrom(grid);
            let row = btGrid.getRow(0);
            let cell = btGrid.getCellByIndex(row, -1)
            btGrid.addWidget(contentEl, row, cell, 1);
            expect(btGrid.rowCount).to.equal(1);
            expect(row.childElementCount).to.equal(1);
            expect(cell.children[1].textContent).to.equal('2');
        })
    })

    describe('初始化', function () {
        it('选择器初始化-参数为null', function () {
            expect(Object.isNull(BTGrid.createFrom(null))).to.ok;
        })

        // it('选择器初始化-不存在', function () {
        //     expect(BTGrid.createFrom("#abc").length).to.equal(0);
        // })

        it('选择器初始化-存在', function () {
            this.createElement("div", null, "grid1")
            expect(Object.isNull(BTGrid.createFrom(".grid1"))).not.to.ok;
            expect(Object.isNull(BTGrid.createFrom(".grid2"))).to.ok;
        })

        it('元素初始化', function () {
            let target = this.createElement("div", null, "grid");
            expect(BTGrid.createFrom(target)).to.not.equal(null);
        })

        it('行数', function () {
            let target = this.createElement('div', '<div><div class="row"></div><div class="row"></div></div>', 'grid');
            expect(BTGrid.createFrom(target).rowCount).to.equal(2);
        })
    })
})
