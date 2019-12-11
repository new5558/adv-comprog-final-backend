require("dotenv").config({ path: "src/config/.env" });

export default {
  port: process.env.PORT,
  databaseURL: process.env.DATABASE_URL,
  secret: process.env.SECRET,
  env: process.env.NODE_ENV
};
