import { Service, Inject } from "typedi";
import AcademicYearDataService from "../data-services/db.service.academicYear";
import { IAcademicYear } from "../interfaces/IAcademicYear";
import { cleanModels } from "../helpers/utils";

@Service()
export default class AcademicYearService {
  @Inject()
  academicYearDataService: AcademicYearDataService;

  async getAllAcademicYears(): Promise<IAcademicYear[]> {
    const academicYearModels = await this.academicYearDataService.getAllAcademicYears();
    return cleanModels<IAcademicYear>(academicYearModels);
  }
}
