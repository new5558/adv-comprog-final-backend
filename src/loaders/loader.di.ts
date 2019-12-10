import Container from "typedi";

interface InjectionModel {
  name: string;
  model: any;
}

export default () => {
  try {
    const models: InjectionModel[] = [
      {
        name: "userModel",
        model: require("../models/user").default
      },
      {
        name: "courseModel",
        model: require("../models/user").default
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
