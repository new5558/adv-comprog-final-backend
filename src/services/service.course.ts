import { Service, Inject } from "typedi";
import CourseDataService from "../data-services/db.service.course";
import { ICourse, ICourseInputDTO } from "../interfaces/ICourse";
import createHttpError = require("http-errors");
import { modelToObj, cleanModels } from "../helpers/utils";

@Service()
export default class CourseService {
  @Inject("courseDataService")
  courseDataService: CourseDataService;

  async getAllCourses(): Promise<ICourse[]> {
    const CourseModels = await this.courseDataService.getAllCourses();
    const allCourses = cleanModels<ICourse>(CourseModels);
    return allCourses.map(course => {
      course.section = course.section.map(section => {
        (section as any)._id = undefined;
        return section;
      });
      return course;
    });
  }

  async getFullCourseInfo(uuid: string): Promise<ICourse | null> {
    const fullCourseInfoModel = await this.courseDataService.getFullCourseInfo(
      uuid
    );
    if (!fullCourseInfoModel) {
      throw createHttpError(404, "Course not found");
    }
    return modelToObj<ICourse>(fullCourseInfoModel) as ICourse;
  }

  async insertCourses(courses: ICourseInputDTO[]) {
    return await this.courseDataService.insertCourses(courses);
  }
}
