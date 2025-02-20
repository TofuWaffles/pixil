export interface Thumbnail {
  id: number,
  createdAt: Date,
  src: string
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
