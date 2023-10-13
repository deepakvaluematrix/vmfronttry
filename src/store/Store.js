import { configureStore, applyMiddleware } from 'redux' 
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'

import rootSaga from './sagas'

import rootReducer from './reducers'

const sagaMiddleware = createSagaMiddleware()

const store = configureStore(
  rootReducer,
  {},
  composeWithDevTools(applyMiddleware(sagaMiddleware))
)

// Run redux-saga
sagaMiddleware.run(rootSaga)

export default store