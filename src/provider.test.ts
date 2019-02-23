import { getStore, setStore } from './provider';

const mockStore = {
    todos: {
        list: [{
            text: 'task 1',
            isDone: false
        }],
        completedTasks: 0
    }
};

test('when no provided store the getStore return with undefined', () => {
    expect(getStore()).toBe(undefined);
});

test('should get the provided store', () => {
    setStore(mockStore);
    expect(getStore()).toBe(mockStore);
});

