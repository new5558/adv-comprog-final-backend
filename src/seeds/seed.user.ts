import { Container } from "typedi";
import depedencyInjectionLoader from "../loaders/loader.di";
import mongooseLoader from "../loaders/loader.mongoose";
import { IUserInputDTO } from "../interfaces/IUser";
import AuthService from "../services/service.auth";
import faker from "faker";
import "reflect-metadata";

const startSeeding = async () => {
  await mongooseLoader();
  depedencyInjectionLoader();

  const users: IUserInputDTO[] = [...Array(20)].map(_ => ({
    name: faker.name.findName(),
    role: "student",
    username: faker.random
      .number({ min: 6100000000, max: 6199999999 })
      .toString(),
    password: faker.internet.password(),
    faculty: 21,
    major: "ICE",
    studentType: faker.random.number({ min: 0, max: 2 }),
    degree: 1,
    registeredCourses: []
  }));
  console.log(users);
  await Container.get(AuthService).signupMany(users);
  process.exit();
};

startSeeding();
