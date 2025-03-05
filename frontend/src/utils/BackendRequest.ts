import getCookie from "./GetCookie";

export default async function backendRequest(data: string | FormData | null, method: string, path: string, privileged: boolean) {
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

  const response = await fetch(import.meta.env.VITE_BACKEND_URL + path, request);
  if (!response.ok) {
    throw response.status
  }

  return response;
}
