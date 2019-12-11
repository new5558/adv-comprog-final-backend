import { Service, Inject } from "typedi";
import { Model } from "mongoose";
import { ICourse, CourseToRegisterBySections } from "../interfaces/ICourse";
import { IUserInfoDTO } from "../interfaces/IUser";

@Service()
export default class CourseDataService {
  @Inject("courseModel")
  courseModel: Model<ICourse>;

  async findCoursesByUniqueId(uuids: string[]): Promise<ICourse[]> {
    return await this.courseModel.find({
      uuid: { $in: uuids }
    });
  }

  async registerStudents(
    courseToRegistersBySection: CourseToRegisterBySections,
    userInfo: IUserInfoDTO
  ) {
    return Promise.all(
      Object.keys(courseToRegistersBySection).map(async key => {
        const section = {
          order: Number(key) - 1,
          uuid: courseToRegistersBySection[key].map(course => course.uuid)
        };
        await this.courseModel.updateMany(
          {
            uuid: {
              $in: section.uuid
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
