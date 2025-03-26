export interface Thumbnail {
  id: number,
  createdAt: Date,
  src: string
}

export interface Media {
  id: number,
  fileName: string,
  ownerEmail: string,
  fileType: string,
  status: number,
  createdAt: number,
  tags: string[],
}

export enum UserType {
  Member,
  Admin,
}

export interface User {
  email: string,
  username: string,
  userType: UserType,
}

export interface Album {
  id: number,
  name: string,
}
