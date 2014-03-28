(function (aloha) {
	'use strict';

	var Boromir = aloha.Boromir;
	
    module('boromir');

	function setupDomNode() {
		var domNode = document.getElementById('test-editable');
		domNode.innerHTML = '<p style="color: blue; font-size: 10px;" id="123" lang="en"><b>Some</b> text<br/></p>';
		return domNode.firstChild;
	}

	test('read the DOM', function () {
		var domNode = setupDomNode();
		var node = Boromir(domNode);
		equal(node.name(), 'P');
		equal(node.type(), 1);
		equal(node.attr('id'), '123');
		equal(node.attrs()['id'], '123');
		ok(!node.attrs()['style']);
		equal(node.style('color'), 'blue');
		equal(node.style('font-size'), '10px');
		equal(node.children().length, 3);
		equal(node.children()[0].name(), 'B');
		equal(node.children()[1].text(), ' text');
		equal(node.children()[2].name(), 'BR');
	});

	test('set an attribute', function () {
		var domNode = setupDomNode();
		var node = Boromir(domNode);
		equal(node.attr('id'), '123')
		equal(node.attrs()['id'], '123');
		node = node.attr('id', '456');
		node = node.updateDom();
		equal(node.attr('id'), '456');
		equal(node.attrs()['id'], '456');
		equal(Boromir(node.domNode()).attr('id'), '456');
	});

	test('set a style', function () {
		var domNode = setupDomNode();
		var node = Boromir(domNode);
		equal(node.style('color'), 'blue');
		equal(node.style('font-size'), '10px');
		node = node.style('color', 'black');
		node = node.updateDom();
		equal(node.style('color'), 'black');
		equal(node.style('font-size'), '10px');
		equal(Boromir(node.domNode()).style('color'), 'black');
		equal(Boromir(node.domNode()).style('font-size'), '10px');
	});

	test('update children', function () {
		var domNode = setupDomNode();
		var node = Boromir(domNode);
		equal(node.children().length, 3);
		node = node.children(node.children().map(function (child, i) {
			return child.type() === 1 ? child.attr('id', i) : child;
		}));
		node = node.updateDom();
		equal(node.children().length, 3);
		equal(node.children()[0].attr('id'), 0);
		equal(node.children()[2].attr('id'), 2);
		equal(Boromir(node.domNode()).children()[0].attr('id'), 0);
		equal(Boromir(node.domNode()).children()[2].attr('id'), 2);
	});

	test('insert and remove children', function () {
		var domNode = setupDomNode();
		var node = Boromir(domNode);
		equal(node.children().length, 3);
		var newChildren = node.children().slice(0);
		newChildren.splice(1, 1,
		                   Boromir({name: 'B', attrs: {'id': 'insert'}}),
		                   Boromir({text: 'insert'}));
		node = node.children(newChildren);
		node = node.updateDom();
		equal(node.children().length, 4);
		node = Boromir(node.domNode());
		equal(node.children()[1].type(), 1);
		equal(node.children()[1].attr('id'), 'insert');
		equal(node.children()[2].type(), 3);
		equal(node.children()[2].text(), 'insert');
	});

}(window.aloha));