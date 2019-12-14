import {
  IAcademicYear,
  IAcademicYearDTO
} from "../interfaces/IAcademicYear";
import { Service, Inject } from "typedi";
import { Model } from "mongoose";

@Service()
export default class AcademicYearService {
  @Inject("academicYearModel")
  academicYearModel: Model<IAcademicYear>;

  async getAllAcademicYears(): Promise<IAcademicYear[]> {
    return this.academicYearModel.find({});
  }

  async getCurrentAcademicYear(): Promise<IAcademicYear | null> {
    const currentDate = new Date();
    console.log(currentDate, 'curremtDate');
    return await this.academicYearModel.findOne({
      $and: [
        { registrationStartDate: { $lte: currentDate } },
        { withdrawalEndDate: { $gte: currentDate } }
      ]
    });
  }

  async insertNewAcademicYear(academicYears: IAcademicYearDTO[]) {
    return await this.academicYearModel.insertMany(academicYears);
  }
}
