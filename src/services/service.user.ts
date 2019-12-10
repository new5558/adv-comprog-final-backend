import { Service, Inject } from "typedi";
import { ICourseRegisterDTO, ICourse } from "../interfaces/ICourse";
import { Model } from "mongoose";

@Service()
export default class UserService {
  constructor(@Inject('UserModel') private userModel: Model<ICourse>) {}

  public async register(courses: ICourseRegisterDTO[]) {
   courses.forEach(course => {
     this.userModel.findOne('')
    // check whether course is avaliable to register
        // check year and semester
        // check credit full
        // check studentType and degree
        // check capacity full?
        // check condition pass
        // check if course already registered?
        // allow registration if already registered but got F or W
   })   
  }
}
