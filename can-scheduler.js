var queues = require("can-queues");
var domMutate = require("can-dom-mutate");
var elementSort = require("./element-sort");
var DomDepthQueue = require("./dom-depth-queue");


// use resize to sort
// might need an initial "delete" queue that always runs before notify?
// element lookup needs to be lazy because elements might not be INSERTED (Test needs this)
var scheduler = {
	batch: {
		start: function(){

		},
		stop: function(){
			scheduler.queues.domUI.flush();
		},
	},
	onTeardown: function(element, handler){

	},
	queues: {
		domUI: new DomDepthQueue("domUI",{
			onComplete: function(){
				console.log("done");
			}
		})
	},
	domUI: function(element, handler, context, args, meta) {
		meta = meta || {};
		meta.element = element;
		return function(){
			// add to domUI special queue
			scheduler.queues.domUI.enqueue(handler, context,args || [], meta);

		}
	}
};
module.exports = scheduler;
