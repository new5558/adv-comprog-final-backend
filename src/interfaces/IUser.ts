export interface IUser {
  _id: string;
  name: string;
  username: string;
  password: string;
  role: string;
  salt: string;
}

export interface IUserInputDTO {
  name: string;
  role: string;
  username: string;
  password: string;
}
