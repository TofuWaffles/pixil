export default async function backendRequest(data: any, method: string, path: string) {
  const response = await fetch(import.meta.env.VITE_BACKEND_URL + path, {
    method: method,
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  });
  if (!response.ok) {
    throw response.status
  }

  return response;
}
