import ejs from "ejs";
import pdf from "html-pdf";
import createError from "http-errors";
import { WithdawalResult } from "../interfaces/ICourse";

export default (withdrawalResult: WithdawalResult) => {
  return new Promise(resolve => {
    ejs.renderFile(
      "./src/views/pdf.ejs",
      {
        coursesToWithdraw: withdrawalResult.courseToWithdrawSuccess,
        year: withdrawalResult.year,
        semester: withdrawalResult.semester,
        studentID: withdrawalResult.username,
        studentType: withdrawalResult.studentType,
        faculty: withdrawalResult.faculty,
        name: withdrawalResult.name
      },
      function(err, result) {
        if (result) {
          pdf.create(result).toBuffer(function(err, buffer) {
            resolve(buffer);
          });
        } else {
          console.log(err);
          throw createError(500, "Internal Server Error");
        }
      }
    );
  });
};
