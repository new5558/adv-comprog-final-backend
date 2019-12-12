import Container from "typedi";
import userModel from "../models/model.user";
import courseModel from "../models/model.course";
import academicYearModel from "../models/model.academicYear";

interface InjectionModel {
  name: string;
  model: any;
}

export default () => {
  try {
    const models: InjectionModel[] = [
      {
        name: "userModel",
        model: userModel
      },
      {
        name: "courseModel",
        model: courseModel
      },
      {
        name: "academicYearModel",
        model: academicYearModel
      }
    ];
    models.forEach(m => {
      Container.set(m.name, m.model);
    });
  } catch (e) {
    console.log("Depedencies Injection Error");
    throw e;
  }
};
