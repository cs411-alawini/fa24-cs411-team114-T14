import apiEndpoints from "../../data/environment";
import AddUserInput from "../../types/userinput/AddUserInput";
import UserInput from "../../types/userinput/UserInput";

async function getUserInputsRequest(token: string): Promise<UserInput[]> {
  const response = await fetch(apiEndpoints.userInputs, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) {
    return Promise.resolve(response.json());
  }
  const errorMessage = await response.text();
  return Promise.reject(new Error(errorMessage));
}

async function addUserInputRequest(
  token: string,
  addUserInput: AddUserInput
): Promise<string> {
  const response = await fetch(apiEndpoints.userInputs, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(addUserInput),
  });
  if (response.ok) {
    return Promise.resolve(response.text());
  }
  const errorMessage = await response.text();
  return Promise.reject(new Error(errorMessage));
}

async function deleteUserInputRequest(
  token: string,
  userInputID: number
): Promise<string> {
  const response = await fetch(`${apiEndpoints.userInputs}/${userInputID}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) {
    return Promise.resolve(response.text());
  }
  const errorMessage = await response.text();
  return Promise.reject(new Error(errorMessage));
}

export { getUserInputsRequest, addUserInputRequest, deleteUserInputRequest };
