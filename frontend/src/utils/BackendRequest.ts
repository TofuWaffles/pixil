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

  console.log("domain url: ", process.env.DOMAIN_URL);

  const response = await fetch(process.env.DOMAIN_URL + "/api" + path, request);
  if (!response.ok) {
    throw response.status
  }

  return response;
}
