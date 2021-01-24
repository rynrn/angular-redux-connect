# angular-redux-connect

## Quickstart

`npm i angular-redux-connect`

### Overview

The library helps you to update the Angular component state from the redux state.
inspired by `react-redux` connect.

[Demo](https://stackblitz.com/edit/angular-redux-connect)

### Using

#### Step 1

set store provider once in **app.module.ts**.

```javascript
import { setStore } from 'angular-redux-connect';

@NgModule({
  imports: [ NgReduxModule, BrowserModule, FormsModule, HttpModule ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule {
  constructor(
    private ngRedux: NgRedux<IAppState>,
    private devTool: DevToolsExtension
  ) {
    this.ngRedux.configureStore(
      rootReducer,
      {} as IAppState,
      [],
      [ devTool.isEnabled() ? devTool.enhancer() : f => f]
    );
    setStore(this.ngRedux);
  }
}
```

#### Step 2

Use **Connect** decorator in **my.component.ts**.

```javascript
import { Connect } from "angular-redux-connect";


const mapStateToThis = function(state) {
  return {
    text: state.appTitle,
  }
}

@Component({
  selector: 'my-component',
  template: `<div>{{text}}</div>`,
})
@Connect(mapStateToThis)
export class MyComponent implements OnInit {
  public text: string = '';
}
```
