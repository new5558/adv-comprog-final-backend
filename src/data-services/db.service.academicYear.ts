import { IAcademicYear, IAcademicYearDTO } from "../interfaces/IAcademicYear";
import { Service, Inject } from "typedi";
import { Model, MongooseDocument } from "mongoose";

@Service()
export default class AcademicYearService {
  @Inject("academicYearModel")
  academicYearModel: Model<IAcademicYear>;

  async getAllAcademicYears(): Promise<(IAcademicYear & MongooseDocument)[]> {
    return await this.academicYearModel.find({});
  }

  async getCurrentAcademicYear(): Promise<(IAcademicYear & MongooseDocument) | null> {
    const currentDate = new Date();
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
