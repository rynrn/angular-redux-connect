import { TestBed } from '@angular/core/testing';
import { createStore } from 'redux';

type CompilerOptions = Partial<{
  providers: any[]
  useJit: boolean
  preserveWhitespaces: boolean
}>
export type ConfigureFn = (testBed: typeof TestBed) => void

export const configureTests = (configure: ConfigureFn, compilerOptions: CompilerOptions = {}) => {
  const compilerConfig: CompilerOptions = {
    preserveWhitespaces: false,
    ...compilerOptions,
  }

  const configuredTestBed = TestBed.configureCompiler(compilerConfig)

  configure(configuredTestBed)

  return configuredTestBed.compileComponents().then(() => configuredTestBed)
}

const createMockReducer = (initState: any) => { 
  return function mockReducer(state = initState, action: any) {
    switch (action.type) {
      case 'ACTION': 
        return {...state, init: true};
      default:
        return state
    }
  }
}

export const createMockStore = (state: any) => createStore(createMockReducer(state));