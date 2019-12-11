import { IAcademicYear } from "../interfaces/IAcademicYear";
import {Service, Inject} from "typedi";
import { Model } from "mongoose";

@Service()
export default class CourseDataService {
    
    @Inject("academicYearModel")
    academicYearModel: Model<IAcademicYear>;
    
    async getAcademicYear(): Promise<IAcademicYear[]> {
      return this.academicYearModel.find({});
    }

}