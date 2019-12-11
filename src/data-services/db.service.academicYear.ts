import { IAcademicYear } from "../interfaces/IAcademicYear";
import { Service, Inject } from "typedi";
import { Model } from "mongoose";

@Service()
export default class CourseDataService {
  @Inject("academicYearModel")
  academicYearModel: Model<IAcademicYear>;

  async getAllAcademicYears(): Promise<IAcademicYear[]> {
    return this.academicYearModel.find({});
  }

  async getCurrentAcademicYear(): Promise<IAcademicYear | null> {
    const currentDate = new Date();
    return await this.academicYearModel.findOne({
      $and: [
        { registrationStartDate: { $lte: currentDate } },
        { registrationEndDate: { $gte: currentDate } }
      ]
    });
  }
}
