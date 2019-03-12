"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var provider_1 = require("./provider");
function Connect(mapStateToThis) {
    return function (constructor) {
        var store;
        var unsubscribeState;
        var prevMappedState;
        var ownKeys = [];
        var ngOnInitOriginal = constructor.prototype.ngOnInit;
        var ngOnDestroyOriginal = constructor.prototype.ngOnDestroy;
        constructor.prototype.ngOnInit = function () {
            var _this = this;
            store = provider_1.getStore();
            var handleChange = function () {
                var mappedState = mapStateToThis(store.getState(), _this);
                if (!lodash_1.isEqual(prevMappedState, mappedState)) {
                    prevMappedState = mappedState;
                    ownKeys = lodash_1.keys(mappedState);
                    ownKeys.forEach(function (prop) {
                        if (!lodash_1.isEqual(_this[prop], mappedState[prop])) {
                            _this[prop] = mappedState[prop];
                        }
                    });
                }
            };
            handleChange();
            unsubscribeState = store.subscribe(handleChange);
            if (ngOnInitOriginal) {
                return ngOnInitOriginal.call(this);
            }
        };
        constructor.prototype.ngOnDestroy = function () {
            clear();
            if (ngOnDestroyOriginal) {
                return ngOnDestroyOriginal.call(this);
            }
        };
        var clear = function () {
            if (lodash_1.isFunction(unsubscribeState)) {
                unsubscribeState();
            }
            prevMappedState = undefined;
            ownKeys = undefined;
        };
    };
}
exports.Connect = Connect;
