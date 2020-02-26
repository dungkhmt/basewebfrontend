const GET = "GET";
const POST = "POST";

export const apiLogin = (username, password) => {
  const credentials = btoa(`${username}:${password}`);

  return fetch("/api/login", {
    method: POST,
    headers: {
      Authorization: `Basic ${credentials}`
    }
  });
};
