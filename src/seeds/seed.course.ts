import { Container } from "typedi";
import depedencyInjectionLoader from "../loaders/loader.di";
import mongooseLoader from "../loaders/loader.mongoose";
import CourseService from "../services/service.course";
import { ICourseInputDTO } from "../interfaces/ICourse";
import faker from "faker";
import "reflect-metadata";
import moment from "moment";

const startSeeding = async () => {
  await mongooseLoader();
  depedencyInjectionLoader();

  const courses: ICourseInputDTO[] = [...Array(50)].map((_, index) => ({
    uuid: index + "",
    year: "2019",
    semester: 2,
    courseNumber: faker.random.number({ min: 10000, max: 99999 }).toString(),
    midtermDate: moment("2020-02-14").toDate(),
    finalDate: null,
    name: faker.lorem.words(),
    shortName: faker.hacker.abbreviation(),
    engName: faker.hacker.abbreviation(),
    studentType: faker.random.number({ min: 0, max: 2 }),
    faculty: 21,
    requirement: [],
    credit: 3,
    section: Array(faker.random.number({ min: 1, max: 3 }))
      .fill(0)
      .map((_, index) => {
        return {
          sectionNumber: index + 1,
          startTime: new Date(),
          endTime: moment("2020-05-25").toDate(),
          room: faker.commerce.product(),
          building: faker.company.companyName(),
          instructor: faker.name.firstName(),
          capacity: 20,
          enrolledStudent: []
        };
      }),
    requiredDegree: 0
  }));

  await Container.get(CourseService).insertCourses(courses);
  process.exit();
};

startSeeding();
