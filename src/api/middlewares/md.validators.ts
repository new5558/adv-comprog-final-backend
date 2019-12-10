import { body } from "express-validator";

export const loginValidator = () => {
  return [
    body("username")
      .isString()
      .isLength({ min: 10, max: 10 })
      .trim()
      .escape(),
    body("password")
      .isString()
      .trim()
      .escape()
  ];
};

export const signupValidator = () => {
  return [
    body("username")
      .isString()
      .isLength({ min: 10, max: 10 })
      .trim()
      .escape(),
    body("password")
      .isString()
      .isLength({ min: 8 })
      .trim()
      .escape(),
    body("name")
      .isString()
      .trim()
      .escape(),
    body("role")
      .isString()
      .trim()
      .escape(),
    body("faculty")
      .isNumeric()
      .trim()
      .escape(),
    body("major")
      .isString()
      .trim()
      .escape(),
    body("studentType")
      .isNumeric()
      .trim()
      .escape(),
    body("degree")
      .isNumeric()
      .trim()
      .escape()
  ];
};

export const registerValidator = () => {
  return [
    body().isArray(),
    body("*.uuid")
      .isString()
      .trim()
      .escape(),
    body("*.sectionNumber")
      .isString()
      .trim()
      .escape()
  ];
};
