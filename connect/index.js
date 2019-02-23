"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var provider_1 = require("./provider");
function Connect(mapStateToThis) {
    return function (constructor) {
        var destroyed = false;
        var state$;
        var store;
        var prevMappedState;
        var ngOnInitOriginal = constructor.prototype.ngOnInit;
        var ngOnDestroyOriginal = constructor.prototype.ngOnDestroy;
        constructor.prototype.ngOnInit = function () {
            var _this = this;
            if (destroyed)
                return;
            store = provider_1.getStore();
            var handleChange = function () {
                var mappedState = mapStateToThis(store.getState());
                if (!lodash_1.isEqual(prevMappedState, mappedState)) {
                    prevMappedState = mappedState;
                    lodash_1.keys(mappedState).forEach(function (prop) {
                        _this[prop] = mappedState[prop];
                    });
                }
            };
            handleChange();
            state$ = store.subscribe(handleChange);
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
            destroyed = true;
            if (state$ && state$.unsubscribe) {
                state$.unsubscribe();
            }
            prevMappedState = undefined;
        };
    };
}
exports.Connect = Connect;
exports.Provider = provider_1.setStore;
