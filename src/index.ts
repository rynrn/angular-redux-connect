import { isEqual, keys, isFunction } from 'lodash';
import { getStore, setStore } from './provider';

// provide redux store for subscribing and getting the state
export const provideStore = setStore;

// mapStateToThis - first arg: state, second arg: ownProps
export function Connect(mapStateToThis: Function): ClassDecorator {
  return function (constructor: any) {
    let store: any;
    let unsubscribeState: any;
    let prevMappedState: any;
    let ownKeys: any = [];
    const ngOnInitOriginal = constructor.ɵcmp.onInit || constructor.prototype.ngOnInit;
    const ngOnDestroyOriginal = constructor.ɵcmp.OnDestroy || constructor.prototype.ngOnDestroy;

    if (!ngOnDestroyOriginal || !ngOnInitOriginal) {
      console.warn('@Connect - Implementing OnDestroy is missing\nplease make sure that you implement OnDestroy even if it empty');
    }

    if (!ngOnInitOriginal) {
      console.warn('@Connect - Implementing OnInit is missing\nplease make sure that you implement OnInit even if it empty');
    }

    const onInit = function (self: any) {

      // get the provided store
      store = getStore();

      // map redux state to this of component
      const handleChange = () => {
        const mappedState = mapStateToThis(store.getState(), self);
        if (!isEqual(prevMappedState, mappedState)) {
          prevMappedState = mappedState;
          ownKeys = keys(mappedState);
          ownKeys.forEach((prop: any) => {
            if (!isEqual(self[prop], mappedState[prop])) {
              self[prop] = mappedState[prop];
            }
          });
        }
      };

      // call handleChange in the first time and add listener to changes
      handleChange();
      unsubscribeState = store.subscribe(handleChange);

      // call to OnInit lifecycle method if exist
      if (ngOnInitOriginal) {
        return ngOnInitOriginal.call(self);
      }
    };

    const onDestroy = function (self: any) {
      clear();

      // call to OnDestroy lifecycle method if exist
      if (ngOnDestroyOriginal) {
        return ngOnDestroyOriginal.call(self);
      }
    };

    constructor.prototype.ngOnInit = function () {
      onInit(this);
    }

    constructor.ɵcmp.onInit = function () {
      onInit(this);
    }

    constructor.prototype.ngOnDestroy = function () {
      onDestroy(this);
    };

    constructor.ɵcmp.onDestroy = function () {
      onDestroy(this);
    };

    const clear = () => {
      if (isFunction(unsubscribeState)) {
        unsubscribeState();
      }
      prevMappedState = undefined;
      ownKeys = undefined;
    }
  }
}
