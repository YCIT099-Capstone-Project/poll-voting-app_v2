import {
  logout,
  selectLastActive,
  updateLastActive,
} from "../features/userSlice";

export const checkActivityMiddleware = (storeAPI) => (next) => (action) => {
  const state = storeAPI.getState();
  const lastActive = selectLastActive(state);

  // Check if the user has been inactive for more than one day
  if (lastActive && Date.now() - lastActive > 24 * 60 * 60 * 1000) {
    storeAPI.dispatch(logout());
  } else if (
    action.type !== updateLastActive.type &&
    action.type !== logout.type
  ) {
    next(updateLastActive({ payload: Date.now() }));
  }

  // Call the next dispatch method in the middleware chain.
  return next(action);
};
