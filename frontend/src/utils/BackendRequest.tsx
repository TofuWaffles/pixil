export default async function backendRequest(data: any, method: string, path: string) {
  let request;
  if (data == null) {
    request = {
      method: method,
      headers: {
        "Accept": "application/json",
      },
    }
  } else {
    request = {
      method: method,
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "Accept": "application/json",
      },
    }
  }

  const response = await fetch(import.meta.env.VITE_BACKEND_URL + path, request);
  if (!response.ok) {
    throw response.status
  }

  return response;
}
