const express = require("express");
const Router = express.Router();
const { login, ViewAdminDetails } = require("../controller/adminController");
const {
  Register,
  Login,
  ViewAllUser,
} = require("../controller/userController");
const teacherRoutes = require("./teacherRoutes");

//user routes
Router.post("/register", Register);
Router.post("/login", Login);
Router.get("/all-users", ViewAllUser);

//teacher routes
Router.use("/teacher", teacherRoutes);

module.exports = Router;
