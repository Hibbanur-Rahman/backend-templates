const express = require("express");
const Router = express.Router();
const { login, ViewAdminDetails } = require("../controller/adminController");
const {
  registerUser,
  loginUser,
  ViewUsers,
} = require("../controller/userController");

//user routes
Router.post("/register", registerUser);
Router.post("/login", loginUser);
Router.get("/all-users", ViewUsers);



module.exports = Router;
