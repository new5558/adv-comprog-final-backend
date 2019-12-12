import CourseService from "../../services/service.course";
import { Request, Response, Router } from "express";
import Container from "typedi";
import { wrapCatch } from "../../helpers/utils";
import AcademicYearService from "../../services/service.academicYear";

const router = Router();

export default (app: Router) => {
  app.use("/commons", router);

  router.get(
    "/courses",
    wrapCatch(async (_: Request, res: Response) => {
      const courses = await Container.get(CourseService).getAllCourses();
      res.status(200).json(courses);
    })
  );

  router.get(
    "/course/:uuid",
    wrapCatch(async (req: Request, res: Response) => {
      const { params } = req;
      const courses = await Container.get(CourseService).getFullCourseInfo(
        params.uuid
      );
      res.status(200).json(courses);
    })
  );

  router.get(
    "/academic-year",
    wrapCatch(async (_: Request, res: Response) => {
      const academicYear = await Container.get(
        AcademicYearService
      ).getAllAcademicYears();
      res.status(200).json(academicYear);
    })
  );
};
