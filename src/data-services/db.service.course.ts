import { Service, Inject } from "typedi";
import { Model, MongooseDocument } from "mongoose";
import {
  ICourse,
  CourseToRegisterBySections,
  ICourseInputDTO
} from "../interfaces/ICourse";
import { IUser } from "../interfaces/IUser";

@Service("courseDataService")
export default class CourseDataService {
  @Inject("courseModel")
  courseModel: Model<ICourse>;

  async insertCourses(courses: ICourseInputDTO[]): Promise<(ICourse & MongooseDocument)[]> {
    return await this.courseModel.insertMany(courses);
  }

  async findCourses(uuids: string[]): Promise<(ICourse & MongooseDocument)[]> {
    const courseModels = await this.courseModel.find({
      uuid: { $in: uuids }
    });
    return courseModels;
  }

  async getFullCourseInfo(uuid: string): Promise<(ICourse & MongooseDocument) | null> {
    return await this.courseModel
      .findOne({
        uuid
      })
      .populate("requirement");
  }

  async getAllCourses(): Promise<(ICourse & MongooseDocument)[]> {
    return await this.courseModel.find({});
  }

  async registerStudents(
    courseToRegistersBySection: CourseToRegisterBySections,
    userInfo: IUser
  ) {
    return Promise.all(
      Object.keys(courseToRegistersBySection).map(async key => {
        const section = {
          order: Number(key) - 1,
          id: courseToRegistersBySection[key].map(course => course.data)
        };
        await this.courseModel.updateMany(
          {
            _id: {
              $in: section.id
            }
          },
          {
            $push: {
              [`section.${section.order}.enrolledStudent`]: userInfo._id
            }
          }
        );
      })
    );
  }
}
