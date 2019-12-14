import { Container } from "typedi";
import AcademicYearService from "../data-services/db.service.academicYear";
import { IAcademicYearDTO } from "../interfaces/IAcademicYear";
import moment from "moment";
import depedencyInjectionLoader from "../loaders/loader.di";
import mongooseLoader from "../loaders/loader.mongoose";
import "reflect-metadata";

const startSeeding = async () => {
  await mongooseLoader();
  depedencyInjectionLoader();

  const academicYears: IAcademicYearDTO[] = [...Array(10)].map(
    (_, index) => {
      const semester = index % 2 === 1 ? 1 : 2;
      const isFirstSemester = semester === 1;
      const academicYear = 2019 - Math.floor(index / 2);
      const actualYear = isFirstSemester ? academicYear + 1 : academicYear;
      const startMonth = isFirstSemester ? 7 : 0;
      const endMonth = isFirstSemester ? 11 : 4;
      const regisStartMonth = 0;
      const regisEndMonth = 11;
      const withdrawalStartMonth = 0;
      const withdrawalEndMonth = 11;

      return {
        year: academicYear.toString(),
        semester: semester,
        startDate: moment()
          .year(actualYear)
          .date(31)
          .month(startMonth)
          .toDate(),
        endDate: moment()
          .year(actualYear)
          .date(31)
          .month(endMonth)
          .toDate(),
        registrationStartDate: moment()
          .year(actualYear)
          .date(31)
          .month(regisStartMonth)
          .toDate(),
        registrationEndDate: moment()
          .year(actualYear)
          .date(31)
          .month(regisEndMonth)
          .toDate(),
        withdrawalStartDate: moment()
          .year(actualYear)
          .date(31)
          .month(withdrawalStartMonth)
          .toDate(),
        withdrawalEndDate: moment()
          .year(actualYear)
          .date(31)
          .month(withdrawalEndMonth)
          .toDate()
      };
    }
  );

  await Container.get(AcademicYearService).insertNewAcademicYear(academicYears);
  process.exit()
};

startSeeding();