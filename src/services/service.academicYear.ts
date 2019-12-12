import { Service, Inject } from "typedi";
import AcademicYearDataService from "../data-services/db.service.academicYear";
import { IAcademicYear } from "../interfaces/IAcademicYear";

@Service()
export default class AcademicYearService {
  @Inject()
  academicYearDataService: AcademicYearDataService;

  async getAllAcademicYears(): Promise<IAcademicYear[]> {
    return await this.academicYearDataService.getAllAcademicYears();
  }
}
