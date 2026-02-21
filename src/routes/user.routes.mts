import { Router } from "express";
import { sanitize } from "../services/util.mts";
import { login } from "../services/user.service.mts";
import { error } from "console";
import { addUser } from "../models/user.model.mts";
import authorize from "../middleware/authorize.mts";
import type { Request, Response, NextFunction  } from 'express';


const router: Router = Router();

router.post('/login', async (req, res) => {
  // get the email and password from the body of the request
  const { email, password } = sanitize(req.body);
  // sanitize them
  // call the service function, pass in the email and password.
  // the service function should return a valid user and token  or null for either
  const tokenObj = await login(email, password);
  const { token, user } = tokenObj;
  // forward a 401 error if either is null
  if (!token || !user) {
    return res.status(401).json({error: 'Incomplete token || user'});
  }
  // if both values exist, Send back the token and some user info in the response 
  // { token, user: { _id: user._id, email: user.email, name: user.name } }
  return res.status(200).json(tokenObj);
});

router.post('/', async (req, res) => {
  const { email, password, name } = sanitize(req.body);
  try {
    addUser(email, password, name);
    res.status(200).json("Created new user");
  } catch (error) {
    res.status(401).json({error: "Fail to create user"});
  }
})

// Protect a route with JWT authentication. Note the authorize middleware! Make sure to import it as well.
router.get('/protected', authorize, (req: Request, res: Response) => {
    console.log(res.locals.user)
  res.json({ message: `Hello, ${res.locals.user.email}!` });
});

export default router;