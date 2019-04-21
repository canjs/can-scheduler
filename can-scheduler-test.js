var QUnit = require('steal-qunit');
var scheduler = require('./can-scheduler');
var viewTarget = require("can-view-target");

QUnit.module('can-scheduler');

var createElement = document.createElement.bind(document);

QUnit.test("child listener never called because it was torn down correctly", function(){

	var outer = createElement("div"),
		inner = createElement("div"),
		fixture = document.getElementById("qunit-fixture");

	outer.appendChild(inner);
	fixture.appendChild(outer);

	// testing stuff
	var callbacks = [];
	var callback = function(name){
		return function(){
			callbacks.push(name);
		};
	};


	scheduler.onTeardown(inner, callback("inner-teardown"));


	var innerEvent = scheduler.domUI(inner, callback("inner-event"));

	var outerEvent = scheduler.domUI(outer, function(){
		// should this "kill" the inner-event?
		callbacks.push("outer-event");
		outer.removeChild(inner);
	});

	scheduler.batch.start();
	// even though inner was "called" first, it shouldn't be called
	innerEvent();
	outerEvent();
	scheduler.batch.stop();

	QUnit.deepEqual(callbacks,[
		"outer-event"
	], "callbacks right");
});

/*

QUnit.test('basics', function(){
	// Dummy observable
	var count = {
		handlers: [],
		on: function(handler){
			this.handlers.push(handler);
		},
		_value: 3,
		get value(){
			return this._value;
		},
		set value(newVal){
			this._value = newVal;
			this.handlers.forEach(function(handler){
				handler(newVal);
			});
		}
	}

	// {{ or( gte(count,3), lte(count,4) ) }}-{{count}}-

	var inner = viewTarget([
		"-",
		function(){

		},
		"-"
	])

	var outer = viewTarget([
		{comment: "START count between 3 and 4"},
		function(){
			var element = this;
			function update(){
				if()
			}

		},
		{comment: "END count between 3 and 4"}
	]);

});*/
