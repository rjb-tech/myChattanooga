import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { articlesApi } from "./services/articlesService";
import { statsApi } from "./services/statsService";

export default configureStore({
  reducer: {
    [articlesApi.reducerPath]: articlesApi.reducer,
    [statsApi.reducerPath]: statsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(articlesApi.middleware)
      .concat(statsApi.middleware),
});
