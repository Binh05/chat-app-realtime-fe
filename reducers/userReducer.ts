export interface UserState {
  username: string | null;
  phone: string | null;
  token: string | null;
  avatarUrl: string | null;
  status: boolean | null;
}

export type UserAction =
  | { type: "SET_USER"; payload: Partial<UserState> }
  | { type: "CLEAR_USER" }
  | { type: "__HYDRATE__"; payload: UserState };

export const initialUserState: UserState = {
  username: null,
  phone: null,
  token: null,
  avatarUrl: null,
  status: null,
};

export function userReducer(
  state: UserState = initialUserState,
  action: UserAction
): UserState {
  switch (action.type) {
    case "__HYDRATE__":
      return action.payload;

    case "SET_USER":
      return {
        ...state,
        ...action.payload,
      };

    case "CLEAR_USER":
      return initialUserState;

    default:
      return state;
  }
}
