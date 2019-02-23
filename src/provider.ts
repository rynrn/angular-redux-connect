let _store: any;

export const setStore = (store: any) => {
  _store = store;
}

export const getStore = () => _store;
