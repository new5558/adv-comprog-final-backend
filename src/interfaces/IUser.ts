export interface IUser {
  _id: string;
  name: string;
  username: string;
  password: string;
  salt: string;
}

export interface IUserInputDTO {
  name: string;
  username: string;
  password: string;
}
