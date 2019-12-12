import { Service, Inject } from "typedi";
import CourseDataService from "../data-services/db.service.course";
import { ICourse } from "../interfaces/ICourse";
import { create } from "html-pdf";
import createHttpError = require("http-errors");

@Service()
export default class AuthService {
  @Inject()
  userDataService: CourseDataService;

  async getAllCourses(): Promise<ICourse[]> {
    return await this.userDataService.getAllCourses();
  }

  async getFullCourseInfo(uuid: string): Promise<ICourse | null> {
    const fullCourseInfo = await this.userDataService.getFullCourseInfo(uuid);
    if (!fullCourseInfo) {
      throw createHttpError(404, "Course not found");
    }
    return fullCourseInfo;
  }
}
