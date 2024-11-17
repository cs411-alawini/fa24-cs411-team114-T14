import apiEndpoints from "../../data/environment";
import LoginInput from "../../types/auth/LoginInput";
import RegisterInput from "../../types/auth/RegisterInput";
import UserInfo from "../../types/auth/UserInfo";

async function registerRequest(registerInput: RegisterInput): Promise<string> {
  const response = await fetch(apiEndpoints.register, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerInput),
  });
  if (response.ok) {
    return Promise.resolve(response.text());
  }
  const errorMessage = await response.text();
  return Promise.reject(new Error(errorMessage));
}

async function loginRequest(loginInput: LoginInput): Promise<UserInfo> {
  const response = await fetch(apiEndpoints.login, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginInput),
  });
  if (response.ok) {
    return Promise.resolve(response.json());
  }
  const errorMessage = await response.text();
  return Promise.reject(new Error(errorMessage));
}

export { registerRequest, loginRequest };
