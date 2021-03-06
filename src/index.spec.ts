import { Component, OnInit } from '@angular/core';
import { setStore } from './provider';
import { Connect } from './index';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { configureTests, createMockStore } from './lib/testing/config.helpers';

const mockState = {
  todos: {
      list: [{
        text: 'task 1',
        isDone: false
       },
      {
        text: 'task 2',
        isDone: true
      }]
  }
};

function mapStateToThis (state: any) {
  return {
    todosList: state.todos.list,
    completedTasks: state.todos.list.filter((item: any) => item.isDone)
  }
}

@Component({
  selector: 'todo-list',
  template: `<div></div>`
})
@Connect(mapStateToThis)
export class MockComponent implements OnInit {
  public todosList: any;
  public completedTasks: number;

  ngOnInit() {
  }
}

describe('MockComponent', () => {
  let fixture: ComponentFixture<MockComponent>;
  let component: MockComponent;
  let store: any;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [MockComponent],
        schemas: [NO_ERRORS_SCHEMA]
      });

      store = createMockStore(mockState);
      setStore(store);
      store.dispatch({type: 'ACTION'});
      fixture = TestBed.createComponent(MockComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it(
    'should create the app',
    async(() => {
      const app = component;
      expect(app).toBeTruthy();
    })
  );

  it(
    `should have todosList equals to state todos list`,
    async(() => {
      expect(component.todosList).toEqual(mockState.todos.list);
    })
  );

});