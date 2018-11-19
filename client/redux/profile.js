import { get } from "../util/ApiUtil";

export const PROFILE_LOADED = "profile/PROFILE_LOADED";
export const PROFILE_ERROR = "profile/PROFILE_ERROR";

export const initialState = {
  error: null,
  profile: undefined,
  profileLoaded: false
};

export function getProfile() {
  return async dispatch => {
    try {
      const user = await get("/profiili");
      dispatch({ type: PROFILE_LOADED, payload: user });
    } catch (e) {
      dispatch({ type: PROFILE_ERROR, payload: e.message });
    }
  };
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case PROFILE_LOADED:
      return {
        ...state,
        profile: action.payload,
        profileLoaded: true
      };
    case PROFILE_ERROR:
      return {
        ...state,
        error: action.payload,
        profileLoaded: true
      };
    default:
      return state;
  }
}