import { isEqual, keys } from 'lodash';
import { getStore, setStore } from './provider';

export function Connect(mapStateToThis: Function) : ClassDecorator {
    return function (constructor : any) {
      let destroyed: boolean = false;
      let state$: any;
      let store: any;
      let prevMappedState: any;
      const ngOnInitOriginal = constructor.prototype.ngOnInit;
      const ngOnDestroyOriginal = constructor.prototype.ngOnDestroy;
      
      constructor.prototype.ngOnInit = function() {
        if (destroyed) return;
        
        // get the provided store
        store = getStore();
  
        // map redux state to this of component
        const handleChange = () => {
          const mappedState = mapStateToThis(store.getState());
          if (!isEqual(prevMappedState, mappedState)) {
            prevMappedState = mappedState;
            keys(mappedState).forEach((prop: any) => {
              this[prop] = mappedState[prop];
            });
          }
        }

        // call handleChange in the first time and add listener to changes
        handleChange();
        state$ = store.subscribe(handleChange)
  
        // call to OnInit lifecycle method if exist
        if (ngOnInitOriginal) {
            return ngOnInitOriginal.call(this);
        }
      }
  
      constructor.prototype.ngOnDestroy = function() {
        clear();
  
        // call to OnDestroy lifecycle method if exist
        if (ngOnDestroyOriginal) {
            return ngOnDestroyOriginal.call(this);
        }
      }
  
      const clear = () => {
        destroyed = true;
        if (state$ && state$.unsubscribe) {
          state$.unsubscribe();
        }
        prevMappedState = undefined;
      }
  
    }
  }

  export const Provider = setStore;