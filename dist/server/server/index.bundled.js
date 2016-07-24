"use strict";

/******/module.exports = function (modules) {
	// webpackBootstrap
	/******/ // The module cache
	/******/var installedModules = {};

	/******/ // The require function
	/******/function __webpack_require__(moduleId) {

		/******/ // Check if module is in cache
		/******/if (installedModules[moduleId])
			/******/return installedModules[moduleId].exports;

		/******/ // Create a new module (and put it into the cache)
		/******/var module = installedModules[moduleId] = {
			/******/exports: {},
			/******/id: moduleId,
			/******/loaded: false
			/******/ };

		/******/ // Execute the module function
		/******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

		/******/ // Flag the module as loaded
		/******/module.loaded = true;

		/******/ // Return the exports of the module
		/******/return module.exports;
		/******/
	}

	/******/ // expose the modules object (__webpack_modules__)
	/******/__webpack_require__.m = modules;

	/******/ // expose the module cache
	/******/__webpack_require__.c = installedModules;

	/******/ // __webpack_public_path__
	/******/__webpack_require__.p = "";

	/******/ // Load entry module and return exports
	/******/return __webpack_require__(0);
	/******/
}(
/************************************************************************/
/******/[
/* 0 */
/***/function (module, exports, __webpack_require__) {

	'use strict';

	var _os = __webpack_require__(1);

	var _os2 = _interopRequireDefault(_os);

	var _NodeWorkerProxy = __webpack_require__(2);

	var _NodeWorkerProxy2 = _interopRequireDefault(_NodeWorkerProxy);

	var _WorkerManager = __webpack_require__(4);

	var _WorkerManager2 = _interopRequireDefault(_WorkerManager);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}

	var defaults = {
		maxWorkers: _os2.default.cpus().length
	};

	var m = new _WorkerManager2.default(defaults, _NodeWorkerProxy2.default);
	console.log(m);
	console.log(m.run);

	// expose default instance directly
	module.exports = new _WorkerManager2.default(defaults, _NodeWorkerProxy2.default);

	// allow custom settings (task.js factory)
	module.exports.defaults = function ($config, WorkerProxy) {
		var config = {};

		// clone defaults
		Object.keys(defaults).forEach(function (key) {
			return config[key] = defaults[key];
		});

		// apply user settings
		Object.keys($config).forEach(function (key) {
			return config[key] = $config[key];
		});

		return new _WorkerManager2.default(config, WorkerProxy || _NodeWorkerProxy2.default);
	};

	/***/
},
/* 1 */
/***/function (module, exports) {

	module.exports = require("os");

	/***/
},
/* 2 */
/***/function (module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function (__dirname) {
		'use strict';

		var _createClass = function () {
			function defineProperties(target, props) {
				for (var i = 0; i < props.length; i++) {
					var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
				}
			}return function (Constructor, protoProps, staticProps) {
				if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
			};
		}();

		function _classCallCheck(instance, Constructor) {
			if (!(instance instanceof Constructor)) {
				throw new TypeError("Cannot call a class as a function");
			}
		}

		var cp = __webpack_require__(3);

		var NodeWorkerProxy = function () {
			function NodeWorkerProxy() {
				var _this = this;

				_classCallCheck(this, NodeWorkerProxy);

				this._onMessage = function (message) {
					var callbacks = _this._listeners.message;
					if (callbacks) {
						callbacks.forEach(function (callback) {
							return callback(message);
						});
					}
				};

				this._listeners = {};
				this._worker = cp.fork(__dirname + '/NodeWorker.js');
				this._worker.on('message', this._onMessage);
			}

			_createClass(NodeWorkerProxy, [{
				key: 'addEventListener',
				value: function addEventListener(event, callback) {
					this._listeners[event] = this._listeners[event] || [];
					this._listeners[event].push(callback);
				}
			}, {
				key: 'postMessage',
				value: function postMessage(message) {
					this._worker.send(message);
				}
			}, {
				key: 'terminate',
				value: function terminate() {
					this._worker.kill();
				}
			}]);

			return NodeWorkerProxy;
		}();

		module.exports = NodeWorkerProxy;
		/* WEBPACK VAR INJECTION */
	}).call(exports, "/");

	/***/
},
/* 3 */
/***/function (module, exports) {

	module.exports = require("child_process");

	/***/
},
/* 4 */
/***/function (module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
			}
		}return function (Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
		};
	}();

	var _Worker = __webpack_require__(5);

	var _Worker2 = _interopRequireDefault(_Worker);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var WorkerManager = function () {
		function WorkerManager($config, WorkerProxy) {
			var _this = this;

			_classCallCheck(this, WorkerManager);

			this._next = function () {
				if (!_this._queue.length) return;

				var worker = _this._getWorker();

				if (!worker) {
					setTimeout(_this._next, 0);
					return;
				}

				var task = _this._queue.shift();

				worker.run(task);
			};

			$config = $config || {};

			this._WorkerProxy = WorkerProxy;

			this._maxWorkers = $config.maxWorkers || 4;
			this._idleTimeout = $config.idleTimeout === false ? false : $config.idleTimeout || 10000;
			this._idleCheckInterval = $config.idleCheckInterval || 1000;

			this._workers = [];
			this._queue = [];
			this._onWorkerTaskComplete = this._onWorkerTaskComplete.bind(this);
			this._flushIdleWorkers = this._flushIdleWorkers.bind(this);
		}

		_createClass(WorkerManager, [{
			key: 'run',
			value: function run(task) {
				if (this._idleTimeout && typeof this._idleCheckIntervalID !== 'number') {
					this._idleCheckIntervalID = setInterval(this._flushIdleWorkers, this._idleCheckInterval);
				}

				return new Promise(function (resolve, reject) {
					// kind of a hack
					task.resolve = resolve;
					task.reject = reject;
					this._queue.push(task);
					this._next();
				}.bind(this));
			}
		}, {
			key: 'wrap',
			value: function wrap(func) {
				return function () {
					return this.run({
						arguments: Array.from(arguments),
						function: func
					});
				}.bind(this);
			}
		}, {
			key: 'terminate',
			value: function terminate() {
				// kill idle timeout (if it exists)
				if (this._idleTimeout && typeof this._idleCheckIntervalID == 'number') {
					clearInterval(this._idleCheckIntervalID);
					this._idleCheckIntervalID = null;
				}

				// terminate all existing workers
				this._workers.forEach(function (worker) {
					worker.worker.terminate();
				});

				// flush worker pool
				this._workers = [];
			}
		}, {
			key: '_onWorkerTaskComplete',
			value: function _onWorkerTaskComplete() {
				this._next();
			}
		}, {
			key: '_flushIdleWorkers',
			value: function _flushIdleWorkers() {
				this._workers = this._workers.filter(function (worker) {
					if (worker.tasks.length === 0 && new Date() - worker.lastTaskTimestamp > this._idleTimeout) {
						worker.worker.terminate();
						return false;
					} else {
						return true;
					}
				}, this);
			}
		}, {
			key: '_getWorker',
			value: function _getWorker() {
				var idleWorkers = this._workers.filter(function (worker) {
					return worker.tasks.length === 0;
				});

				if (idleWorkers.length) {
					return idleWorkers[0];
				} else if (this._workers.length < this._maxWorkers) {
					return this._createWorker();
				} else {
					return null;
				}
			}
		}, {
			key: '_createWorker',
			value: function _createWorker() {
				var worker = new _Worker2.default({
					onTaskComplete: this._onWorkerTaskComplete
				}, this._WorkerProxy);

				this._workers.push(worker);

				return worker;
			}
		}]);

		return WorkerManager;
	}();

	module.exports = WorkerManager;

	/***/
},
/* 5 */
/***/function (module, exports) {

	'use strict';

	var _createClass = function () {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
			}
		}return function (Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
		};
	}();

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var Worker = function () {
		function Worker($config, WorkerProxy) {
			_classCallCheck(this, Worker);

			this.worker = new WorkerProxy();
			this.worker.addEventListener('message', this._onWorkerMessage.bind(this));
			this.tasks = [];
			this.lastTaskTimestamp = null;

			this._onTaskComplete = $config.onTaskComplete;
		}

		_createClass(Worker, [{
			key: '_generateTaskID',
			value: function _generateTaskID() {
				var id = Math.random(),
				    exists = false;

				this.tasks.some(function (task) {
					if (task.id === true) {
						exists = true;
						return true;
					}
				});

				return exists ? this._generateTaskID() : id;
			}
		}, {
			key: '_onWorkerMessage',
			value: function _onWorkerMessage(message) {
				var taskIndex = null;

				this.tasks.some(function (task, index) {
					if (message.id === task.id) {
						taskIndex = index;
						return true;
					}
				});

				if (taskIndex !== null) {
					this.tasks[taskIndex].resolve(message.result);
					this._onTaskComplete(this);
					this.tasks.splice(taskIndex, 1);
				}
			}
		}, {
			key: 'run',
			value: function run($options) {
				var id = this._generateTaskID();

				this.lastTaskTimestamp = new Date();

				this.tasks.push({
					id: id,
					resolve: $options.resolve,
					reject: $options.reject
				});

				var message = {
					id: id,
					func: String($options.function)
				};

				// because of transferables (we want to keep this object flat)
				Object.keys($options.arguments).forEach(function (key, index) {
					message['argument' + index] = $options.arguments[index];
				});

				this.worker.postMessage(message, $options.transferables);
			}
		}]);

		return Worker;
	}();

	module.exports = Worker;

	/***/
}
/******/]);