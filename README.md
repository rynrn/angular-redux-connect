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

## License

(The MIT License)

Copyright (c) 2018 Nadav Avisror

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

