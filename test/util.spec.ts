import { expect } from 'chai';
import '../src/util';
import setupTestHelpers from './baseTest.spec';
import BTGrid from '../src';
import position from '../src/position';

describe("Util", () => {
    'use strict';

    beforeEach(function () {
        setupTestHelpers.call(this);
    });

    afterEach(function () {
        this.cleanupTest();
    });

    describe('字符串工具', function () {
        it('Format-格式化字符串', function () {
            var str = "a{0}a";
            var result = str.format('1');
            expect(result).to.equal('a1a');
        })

        it('Format-格式化字符串-空', function () {
            var str = "a{0}a";
            var result = str.format();
            expect(result).to.equal('a{0}a');
        })

        it('Trim-去除前后空白字符', function () {
            var str = ' a b ';
            var result = str.Trim();
            expect(result).to.equal('a b');
        })

        it('Trim-去除前后字符', function () {
            var str = '! a b !';
            var result = str.Trim('!');
            expect(result).to.equal(' a b ');
        })

        it('TrimStart-去除前面空白字符', function () {
            var str = ' a b ';
            var result = str.TrimStart();
            expect(result).to.equal('a b ');
        })

        it('TrimStart-去除前面字符', function () {
            var str = '! a b !';
            var result = str.TrimStart('!');
            expect(result).to.equal(' a b !');
        })

        it('TrimStart-去除後面空白字符', function () {
            var str = ' a b ';
            var result = str.TrimEnd();
            expect(result).to.equal(' a b');
        })

        it('TrimStart-去除後面字符', function () {
            var str = '! a b !';
            var result = str.TrimEnd('!');
            expect(result).to.equal('! a b ');
        })
    })

    describe("Element", () => {
        it('insertAfter-插入到元素之後-空容器', function () {
            let container = this.createElement('div');
            let newDiv = this.createElement('div', '1');
            container.insertAfter(newDiv);
            expect(container.childElementCount).to.equal(1);
        })

        it('insertAfter-插入到元素之後-容器尾部', function () {
            let container = this.createElement('div', '<div id="a">1</div><div id="b">2</div>');
            let refNode = container.querySelector('#b');
            let newDiv = this.createElement('div', '3');
            container.insertAfter(newDiv, refNode);
            expect(container.lastElementChild.textContent).to.equal('3');
        })

        it('insertAfter-插入到元素之後', function () {
            let container = this.createElement('div', '<div id="a">1</div><div id="c">3</div>');
            let refNode = container.querySelector('#a');
            let newDiv = this.createElement('div', '2');
            container.insertAfter(newDiv, refNode);
            expect(container.childNodes[1].textContent).to.equal('2');
        })

        it('Is', function () {
            let gridContent = `
            <div class="row">
                <div class="col-lg-3">
                    <div class="colitem">
                    b
                    </div>
                    <div class="colitem">
                    c
                    </div>
                </div>
            </div>
            `
            let grid = this.createElement('div', gridContent, 'grid');
            let btGrid = BTGrid.createFrom(grid);
            let row = btGrid.getRow(0);
            let col = btGrid.getCell(0, 0);
            let result = btGrid.filter('.colitem', ...Array.from(col.children));
            expect(result.length).to.equal(2);
            result.forEach(element => {
                expect(element.className).contain("colitem");
            });
            let colitem = btGrid.filterFirstOrDefault('.colitem', ...Array.from(col.children));
            expect(colitem).not.to.be.undefined;

            result = btGrid.filter('.test', ...Array.from(col.children));
            expect(result.length).to.equal(0);
            colitem = btGrid.filterFirstOrDefault('.test', ...Array.from(col.children));
            expect(colitem).to.be.undefined;

            //没有添加到DOC的元素
            let newElement = this.createElement('div', 'new', 'colitem', true);
            colitem = btGrid.filterFirstOrDefault('.colitem', newElement);
            expect(colitem).not.to.be.undefined;

            colitem.matches = undefined;

            colitem = btGrid.filterFirstOrDefault('.colitem', newElement);
            expect(colitem).not.to.be.undefined;

            btGrid.addColItem(colitem,row,col);
            expect(colitem.is('.colitem')).to.be.ok;
        })

        it('鼠标在元素的位置', function () {
            let gridContent = `
            <div class="row">
                <div class="col-lg-3">
                    <div class="colitem">
                    b
                    </div>
                    <div class="colitem">
                    c
                    </div>
                </div>
            </div>
            `
            let grid = this.createElement('div', gridContent, 'grid');
            let btGrid = BTGrid.createFrom(grid);

            let row = btGrid.getRow(0);
            let ro = row.getBoundingClientRect();
            var Top = ro.top;
            var Bottom = ro.bottom;
            var Left = ro.left;
            var Right = ro.right;
            var Width = ro.width || Right - Left;
            var Height = ro.height || Bottom - Top;

            expect(btGrid.positionOf(row, Left + 1, 22)).to.equal(position.left);
            expect(btGrid.positionOf(row, Right, 33)).to.equal(position.right);
            expect(btGrid.positionOf(row, Left + Width / 2 + 1, Top + 1)).to.equal(position.top);
            expect(btGrid.positionOf(row, Left + Width / 2 + 1, Bottom - 1)).to.equal(position.bottom);
        })

        it('获取父元素',function(){
            let gridContent = `
            <div class="row">
                <div class="col-lg-3">
                    <div class="colitem">
                    b
                    </div>
                    <div class="colitem">
                    c
                    </div>
                </div>
            </div>
            `
            let grid = this.createElement('div', gridContent, 'grid');
            let btGrid = BTGrid.createFrom(grid);
            let row = btGrid.getRow(0)
            let col = btGrid.getCell(0,0)
            let colItem = col.firstElementChild;

            let parents  = colItem.getParents();
            expect(parents.length).to.be.equal(4);
            let closetParent = colItem.getColsetParent();
            expect(closetParent.classList.contains('col-lg-3')).to.be.true;

            parents  = colItem.getParents(null,row);
            expect(parents.length).to.be.equal(2);
            closetParent = colItem.getColsetParent(null,row)
            expect(closetParent.classList.contains('col-lg-3')).to.be.true;

            parents  = colItem.getParents(".row");
            expect(parents.length).to.be.equal(1);
            closetParent = colItem.getColsetParent('.row',row)
            expect(closetParent.classList.contains('row')).to.be.true;

            parents  = colItem.getParents(".row",row);
            expect(parents.length).to.be.equal(1);
            closetParent = colItem.getColsetParent('.row',col)
            expect(Object.isNull(closetParent)).to.be.true;

            closetParent = colItem.getColsetParent(null,col)
            expect(closetParent.classList.contains('col-lg-3')).to.be.true;
        })

        it('元素索引位置',function(){
            let gridContent = `
            <div class="row">
                <div class="col-lg-3">
                    <div class="colitem">
                    b
                    </div>
                    <div class="colitem">
                    c
                    </div>
                </div>
            </div>
            `
            let grid = this.createElement('div', gridContent, 'grid');
            let btGrid = BTGrid.createFrom(grid);
            let cell = btGrid.getCellByIndex(0,0);
            let colItem = cell.lastElementChild;
            expect(colItem.indexOfParent()).to.be.equal(1);
            expect(cell.indexOfParent()).to.be.equal(0);
        })
    })
})

