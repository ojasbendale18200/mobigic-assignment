const express = require("express");
const { registerUser, loginUser, getUsers } = require("../controllers/user.controller");

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/users", getUsers);

module.exports = { userRouter };
