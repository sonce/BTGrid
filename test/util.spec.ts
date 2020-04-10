import expect from 'expect.js';
import '../src/util';
import setupTestHelpers from './baseTest';

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
            var str="a{0}a";
            var result = str.format('1');
            expect(result).to.equal('a1a');
        })

        it('Format-格式化字符串-空', function () {
            var str="a{0}a";
            var result = str.format();
            expect(result).to.equal('a{0}a');
        })

        it('Trim-去除前后空白字符',function(){
            var str=' a b ';
            var result = str.Trim();
            expect(result).to.equal('a b');
        })

        it('Trim-去除前后字符',function(){
            var str='! a b !';
            var result = str.Trim('!');
            expect(result).to.equal(' a b ');
        })

        it('TrimStart-去除前面空白字符',function(){
            var str=' a b ';
            var result = str.TrimStart();
            expect(result).to.equal('a b ');
        })

        it('TrimStart-去除前面字符',function(){
            var str='! a b !';
            var result = str.TrimStart('!');
            expect(result).to.equal(' a b !');
        })

        it('TrimStart-去除後面空白字符',function(){
            var str=' a b ';
            var result = str.TrimEnd();
            expect(result).to.equal(' a b');
        })

        it('TrimStart-去除後面字符',function(){
            var str='! a b !';
            var result = str.TrimEnd('!');
            expect(result).to.equal('! a b ');
        })
    })

    describe("Node", () => {
        it('insertAfter-插入到元素之後-空容器',function(){
            let container = this.createElement('div');
            let newDiv = this.createElement('div','1');
            container.insertAfter(newDiv);
            expect(container.childElementCount).to.equal(1);
        })

        it('insertAfter-插入到元素之後-容器尾部',function(){
            let container = this.createElement('div','<div id="a">1</div><div id="b">2</div>');
            let refNode = container.querySelector('#b');
            let newDiv = this.createElement('div','3');
            container.insertAfter(newDiv,refNode);
            expect(container.lastElementChild.textContent).to.equal('3');
        })

        it('insertAfter-插入到元素之後',function(){
            let container = this.createElement('div','<div id="a">1</div><div id="c">3</div>');
            let refNode = container.querySelector('#a');
            let newDiv = this.createElement('div','2');
            container.insertAfter(newDiv,refNode);
            expect(container.childNodes[1].textContent).to.equal('2');
        })
    })
})

