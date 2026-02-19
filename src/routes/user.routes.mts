import express from "express";
import { sanitize } from "../services/util.mts";
import { login } from "../services/user.service.mts";
import { error } from "console";

const router = express.Router();

router.post('/login', async (req, res) => {
  // get the email and password from the body of the request
  const { email, password } = req.body;
  // sanitize them
  const sanatizedEmail = sanitize(email);
  const sanatizedPassword = sanitize(password);
  // call the service function, pass in the email and password.
  // the service function should return a valid user and token  or null for either
  const tokenObj = login(sanatizedEmail, sanatizedPassword);
  const token = tokenObj.token;
  const user = tokenObj.user;
  // forward a 401 error if either is null
  if (!token || !user) {
    return res.status(401).json({error: 'Incomplete token || user'});
  }
  // if both values exist, Send back the token and some user info in the response 
  // { token, user: { _id: user._id, email: user.email, name: user.name } }
  return { token, user: { _id: user._id, email: user.email, name: user.name } };
});