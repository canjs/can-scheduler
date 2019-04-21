var Queue = require("can-queues/queue");
var elementSort = require("./element-sort");
var sortedIndexBy = require("./sorted-index-by");

function sortTasks(taskA, taskB){
	return elementSort.sortOrder(taskA.meta.element, taskB.meta.element);
}

function DomDepthQueue(){
	Queue.apply(this, arguments);
}

DomDepthQueue.prototype = Object.create(Queue.prototype);

// might overwrite each other ....
// task/elements might be added while flushing ...
// best structure would probably be a r/b tree ...
DomDepthQueue.prototype.flush = function () {

	while ( this.tasks.length ) {
		var task = this.tasks.shift();
		//!steal-remove-start
		if(process.env.NODE_ENV !== 'production') {
			this._logFlush( task );
		}

		//!steal-remove-end
		task.fn.apply( task.context, task.args );
	}

	this.callbacks.onComplete( this );
};

DomDepthQueue.prototype.enqueue = function ( fn, context, args, meta ) {

	var task = {
		fn: fn,
		context: context,
		args: args,
		meta: meta
	};

	//!steal-remove-start
	if(process.env.NODE_ENV !== 'production') {
		if(!meta || !meta.element) {
			throw new Error("DomDepthQueue tasks must be created with a meta.element.")
		}
	}
	//!steal-remove-end

	var index = sortedIndexBy(sortTasks, this.tasks, task);

	this.tasks.splice(index, 0, task);

	//!steal-remove-start
	if(process.env.NODE_ENV !== 'production') {
		this._logEnqueue( task );
	}
	//!steal-remove-end

	if ( task.length === 1 ) {
		this.callbacks.onFirstTask( this );
	}
};

module.exports = DomDepthQueue;
