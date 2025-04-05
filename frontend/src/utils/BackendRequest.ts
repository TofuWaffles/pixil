import getCookie from "./GetCookie";

export default async function backendRequest(data: any, method: string, path: string, privileged: boolean) {
  let request: RequestInit = {
    method: method,
  }

  let headers: HeadersInit = new Headers({
    "Accept": "application/json",
  })

  if (privileged) {
    const token = getCookie("Access-Token");

    if (token === null || token === undefined) {
      window.location.href = "/login";
    }
    headers.set("Authorization", "Bearer " + token);
  }

  if (data != null) {
    request.body = data;
  }

  request.headers = headers;

  console.log("mode: ", import.meta.env.MODE);
  console.log("backend url: ", process.env.BACKEND_URL);

  const response = await fetch(process.env.BACKEND_URL + path, request);
  if (!response.ok) {
    throw response.status
  }

  return response;
}
