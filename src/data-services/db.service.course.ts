import { Service, Inject } from "typedi";
import { Model } from "mongoose";
import { ICourse, CourseToRegisterBySections } from "../interfaces/ICourse";
import { IUserInfoDTO } from "../interfaces/IUser";

@Service()
export default class CourseDataService {
  @Inject("courseModel")
  courseModel: Model<ICourse>;

  async findCourses(uuids: string[]): Promise<ICourse[]> {
    return await this.courseModel.find({
      uuid: { $in: uuids }
    });
  }

  // @Todo add add route for this method
  async getFullCourseInfo(uuid: string): Promise<ICourse | null> {
    return await this.courseModel.findOne({
      uuid
    }).populate('requirement');
  }

  async registerStudents(
    courseToRegistersBySection: CourseToRegisterBySections,
    userInfo: IUserInfoDTO
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
