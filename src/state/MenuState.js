import { createState, useState } from "@hookstate/core";
import { request } from "../api";

export const menuState = createState({
  isFetching: false,
  isFetched: false,
  permittedFunctions: new Set(),
});

export function useMenuState() {
  // This function wraps the state by an interface,
  // i.e. the state link is not accessible directly outside of this module.
  // The state for tasks in TasksState.ts exposes the state directly.
  // Both options are valid and you need to use one or another,
  // depending on your circumstances. Apply your engineering judgement
  // to choose the best option. If unsure, exposing the state directly
  // like it is done in the TasksState.ts is a safe bet.
  return useState(menuState);
}

export function fetchMenu() {
  menuState.isFetching.set(true);

  request(
    "get",
    "/menu",
    (res) => {
      menuState.permittedFunctions.set(new Set(res.data));
      menuState.isFetching.set(false);
      menuState.isFetched.set(true);
    },
    {
      onError: () => {
        menuState.isFetching.set(false);
        menuState.isFetched.set(false);
      },
      401: () => {},
    }
  );
}
