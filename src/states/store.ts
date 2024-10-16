import { configureStore, Middleware } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice"; 

const persistedState: Middleware = store => next => action => {

    //en refencia al estado pre cambio


    next(action);

    console.log(action)
    //en referencia al estado post cambio
    const estado = store.getState()

    const estadoAsJson = JSON.stringify(estado.users)
    localStorage.setItem('__redux__users__', estadoAsJson)

}


export const store = configureStore({
    reducer: {
        counter: counterReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(persistedState),
});

export type RootType = ReturnType<typeof store.getState>