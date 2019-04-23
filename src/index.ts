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
      let ownKeys = [];
      const ngOnInitOriginal = constructor.prototype.ngOnInit;
      const ngOnDestroyOriginal = constructor.prototype.ngOnDestroy;

      if (!ngOnDestroyOriginal) {
        console.warn('@Connect - Implementing OnDestroy is missing\nplease make sure that you implement OnDestroy even if it empty');
      }

      constructor.prototype.ngOnInit = function() {

        // get the provided store
        store = getStore();

        // map redux state to this of component
        const handleChange = () => {
          const mappedState = mapStateToThis(store.getState(), this);
          if (!isEqual(prevMappedState, mappedState)) {
            prevMappedState = mappedState;
            ownKeys = keys(mappedState);
            ownKeys.forEach((prop: any) => {
              if (!isEqual(this[prop], mappedState[prop])) {
                this[prop] = mappedState[prop];
              }
            });
          }
        };

        // call handleChange in the first time and add listener to changes
        handleChange();
        unsubscribeState = store.subscribe(handleChange);

        // call to OnInit lifecycle method if exist
        if (ngOnInitOriginal) {
            return ngOnInitOriginal.call(this);
        }
      };

      constructor.prototype.ngOnDestroy = function() {
        clear();

        // call to OnDestroy lifecycle method if exist
        if (ngOnDestroyOriginal) {
            return ngOnDestroyOriginal.call(this);
        }
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
