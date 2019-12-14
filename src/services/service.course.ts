import { Service, Inject } from "typedi";
import CourseDataService from "../data-services/db.service.course";
import { ICourse, ICourseInputDTO } from "../interfaces/ICourse";
import createHttpError = require("http-errors");

@Service()
export default class CourseService {

  @Inject("courseDataService")
  courseDataService: CourseDataService;

  async getAllCourses(): Promise<ICourse[]> {
    return await this.courseDataService.getAllCourses();
  }

  async getFullCourseInfo(uuid: string): Promise<ICourse | null> {
    const fullCourseInfo = await this.courseDataService.getFullCourseInfo(uuid);
    if (!fullCourseInfo) {
      throw createHttpError(404, "Course not found");
    }
    return fullCourseInfo;
  }

  async insertCourses(courses: ICourseInputDTO[]): Promise<ICourse[]> {
    return await this.courseDataService.insertCourses(courses);
  }
}
