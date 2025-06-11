export type AuthState = {
  getToken: () => string | undefined;
  setToken: (token?: string) => void;
};

let token: string | undefined = undefined;
const setToken: AuthState['setToken'] = (newToken) => {
  token = newToken;
};

const getToken = () => token;
const authState: AuthState = { getToken, setToken };

export default authState;
