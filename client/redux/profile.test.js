import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import reducer, {
  initialState,
  PROFILE_LOADED,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_ERROR,
  getProfile,
  updateProfile
} from "./profile";
import * as ApiUtil from "../util/ApiUtil";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("client:redux:profile", () => {
  describe("reducer", () => {
    it("has initial state", () => {
      expect(reducer()).toEqual(initialState);
    });

    it("on PROFILE_LOADED", () => {
      const state = initialState;
      const newSituation = { text: "situation1" };
      const newTag = { text: "tag1" };
      const payload = {
        profile: { user: 1 },
        contacts: [{ name: "name" }],
        roles: [{ id: 1 }],
        situations: [newSituation],
        tags: [newTag]
      };
      const action = { type: PROFILE_LOADED, payload };
      const expectedState = {
        ...state,
        profile: payload.profile,
        profileLoaded: true,
        contacts: payload.contacts,
        roles: payload.roles,
        situations: payload.situations,
        tags: payload.tags
      };
      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("on PROFILE_ERROR", () => {
      const state = initialState;
      const error = "error message";
      const action = { type: PROFILE_ERROR, payload: error };
      const expectedState = { ...state, error, profileLoaded: true };
      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("on UPDATE_PROFILE", () => {
      const state = { ...initialState, updateProfileError: true };
      const action = { type: UPDATE_PROFILE };
      const expectedState = {
        ...state,
        loading: true,
        updateProfileError: null
      };
      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("on UPDATE_PROFILE_SUCCESS", () => {
      const profile = { profile: "updated" };
      const state = { ...initialState, loading: true };
      const action = { type: UPDATE_PROFILE_SUCCESS, payload: profile };
      const expectedState = { ...state, profile, loading: false };
      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("on UPDATE_PROFILE_ERROR", () => {
      const error = new Error("random error");
      const state = { ...initialState, loading: true };
      const action = { type: UPDATE_PROFILE_ERROR, payload: error };
      const expectedState = {
        ...state,
        loading: false,
        updateProfileError: action.payload
      };
      expect(reducer(state, action)).toEqual(expectedState);
    });
  });

  describe("actions", () => {
    describe("getProfile", () => {
      describe("when call succeeds", () => {
        it("dispatches user profile", () => {
          const response = { profile: { user: 1 }, roles: [{ id: 1 }] };
          ApiUtil.get = jest.fn(() => new Promise(res => res(response)));

          const store = mockStore(initialState);
          const expectedActions = [{ type: PROFILE_LOADED, payload: response }];

          store.dispatch(getProfile()).then(() => {
            expect(ApiUtil.get).toBeCalledWith("/profiili");
            expect(store.getActions()).toEqual(expectedActions);
          });
        });
      });

      describe("when call fails", () => {
        it("dispatches error", () => {
          const error = new Error("network error");
          ApiUtil.get = jest.fn(() => new Promise((res, rej) => rej(error)));

          const store = mockStore(initialState);
          const expectedActions = [
            { type: PROFILE_ERROR, payload: error.message }
          ];

          store.dispatch(getProfile()).then(() => {
            expect(ApiUtil.get).toBeCalledWith("/profiili");
            expect(store.getActions()).toEqual(expectedActions);
          });
        });
      });
    });

    describe("updateProfile", () => {
      it("when updating succeeds", () => {
        const data = { form: 1 };
        const response = { response: 1 };

        ApiUtil.put = jest.fn(() => new Promise(res => res(response)));

        const store = mockStore({ profile: initialState });
        const expectedActions = [
          { type: UPDATE_PROFILE },
          { type: UPDATE_PROFILE_SUCCESS, payload: response }
        ];

        store.dispatch(updateProfile(data)).then(() => {
          expect(ApiUtil.put).toBeCalledWith(`/profiili`, data);
          expect(store.getActions()).toEqual(expectedActions);
        });
      });

      it("when updating fails", () => {
        const data = { form: 1 };
        const error = new Error("network error");
        ApiUtil.put = jest.fn(() => new Promise((res, rej) => rej(error)));

        const store = mockStore(initialState);
        const expectedActions = [
          { type: UPDATE_PROFILE },
          { type: UPDATE_PROFILE_ERROR, payload: error.message }
        ];

        store.dispatch(updateProfile(data)).then(() => {
          expect(ApiUtil.put).toBeCalledWith(`/profiili`, data);
          expect(store.getActions()).toEqual(expectedActions);
        });
      });
    });
  });
});
