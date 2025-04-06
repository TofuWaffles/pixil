import { Album, AlbumMedia, Media, StorageStats, User } from "../types/Models";
import getCookie from "../utils/GetCookie";

export default class BackendApi {
  private url: string

  constructor() {
    this.url = process.env.DOMAIN_URL!;
  }

  async getMediaList(queryParams: string | null) {
    let requestPath = "/media?status=0";
    if (queryParams != null) {
      requestPath += `&${queryParams}`
    }
    const response = await this.backendRequest(null, "GET", requestPath, true);
    const mediaList: Media[] = await response.json();

    return mediaList;
  }

  async getThumbnail(id: number) {
    const thumbnailResponse = await this.backendRequest(null, "GET", `/thumbnail?id=${id}`, true);
    const thumbnailBlob = await thumbnailResponse.blob();
    const thumbnailUrl = URL.createObjectURL(thumbnailBlob);
    return thumbnailUrl;
  }

  async getMediaContent(id: number) {
    const imageResponse = await this.backendRequest(null, "GET", `/media_content?id=${id}`, true);
    if (imageResponse === undefined || !imageResponse.ok) {
      throw imageResponse;
    }
    return imageResponse;
  }

  async postMedia(file: File) {
    const data = new FormData();
    data.append('file', file);
    data.append('name', 'User media');
    data.append('desc', 'A piece of media uploaded by the user');
    await this.backendRequest(data, "POST", "/media", true);
  }

  async deleteMedia(id: number) {
    const response = await this.backendRequest(null, "DELETE", `/media?id=${id}`, true);
    if (!response.ok) {
      throw response;
    }
  }

  async getMediaDetails(id: number) {
    const detailsResponse = await this.backendRequest(null, "GET", `/media?id=${id}`, true);
    if (!detailsResponse.ok) {
      throw detailsResponse;
    }
    const details: Media = await detailsResponse.json();
    return details;
  }

  async getAlbums() {
    const response = await this.backendRequest(null, "GET", "/albums", true);
    if (!response.ok) {
      throw response;
    }
    const albums: Album[] = await response.json();
    return albums;
  }

  async getAlbumMedia(id: number) {
    const response = await this.backendRequest(null, "GET", `/media?album=${id}`, true);
    if (!response.ok) {
      throw response;
    }
    const albumMedia: Media[] = await response.json();
    return albumMedia;
  }

  async postAlbum(name: string) {
    const response = await this.backendRequest(null, "POST", `/albums?name=${name}`, true);
    if (!response.ok) {
      throw response;
    }
  }

  async postAlbumMedia(albumId: number, mediaId: number) {
    const response = await this.backendRequest(
      JSON.stringify({
        albumId: albumId,
        mediaId: mediaId,
      } as AlbumMedia),
      "POST",
      "/album_media",
      true
    );
    if (!response.ok) {
      throw response;
    }
  }

  async login(email: string, password: string) {
    const response = await this.backendRequest(JSON.stringify({
      email: email,
      password: password,
    }),
      "POST",
      "/login",
      false
    )
    if (!response.ok) {
      throw response
    }
    const token: { token: string } = await response.json();

    return token;
  }

  async getUsers() {
    const usersResponse = await this.backendRequest(null, "GET", "/user", true)
    if (!usersResponse.ok) {
      throw usersResponse;
    }
    const users: User[] = await usersResponse.json();
    return users;
  }

  async postUser(email: string, username: string, password: string, userType: number) {
    const response = await this.backendRequest(JSON.stringify({
      email: email,
      username: username,
      password: password,
      userType: userType,
    }),
      "POST",
      "/user",
      true,
    )

    if (!response.ok) {
      throw response;
    }
  }

  async getStorage() {
    const response = await this.backendRequest(null, "GET", "/storage", true);
    if (!response.ok) {
      throw response;
    }
    const storage: StorageStats = await response.json();

    return storage;
  }

  async getTags() {
    const response = await this.backendRequest(null, "GET", "/tags", true);
    const tags: string[] = await response.json();

    return tags;
  }

  private async backendRequest(data: any, method: string, path: string, privileged: boolean) {
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

    const response = await fetch(this.url + "/api" + path, request);
    if (!response.ok) {
      throw response.status
    }

    return response;
  }
}
