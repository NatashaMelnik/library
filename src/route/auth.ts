import { Router, Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { config as dotenv } from "dotenv";

dotenv();

const router = Router();
const secret: any = process.env.secretKEY;

const generateToken = (user: { id: number }) => {
  const data = {
    id: user.id,
  };
  const expiration = "6h";
  return jwt.sign({ data }, secret, { expiresIn: expiration });
};

export const authGuard = async (req: Request, res: Response, next: any) => {
  next();
  // try {
  // 	const decoded = jwt.verify(
  // 		req.headers.authorization !== undefined ? req.headers.authorization.split(" ")[1] : "",
  // 		secret
  // 	);
  // 	const userRepository = getRepository(User);
  // 	const decodedId = JSON.parse(JSON.stringify(decoded)).data.id;
  // 	const user = await userRepository.findOne({ where: { id: decodedId } });
  // 	if (user && user.id === decodedId) {
  // 		next();
  // 	} else {
  // 		res.send("error");
  // 	}
  // } catch (e) {
  // 	res.send("unauthorized");
  // }
};

router.post("/login", async function (req: Request, res: Response) {
  const userRepository = getRepository(User);
  const user = await userRepository.findOne({
    where: { email: req.body.email },
  });
  if (user) {
    bcrypt.compare(
      req.body.password,
      user.passwordHash,
      function (err, result) {
        if (err) {
          console.error(err);
          res.sendStatus(500);
        }
        if (result) {
          const { passwordHash, ...users } = user;
          res.status(200);
          res.json({ user: users, token: generateToken(user) });
        }
      }
    );
  } else {
    res.status(401);
    res.end("Error");
  }
});

router.post("/create", async function (req: Request, res: Response) {
  const userRepository = getRepository(User);
  bcrypt.hash(req.body.password, 2, async function (err, hash) {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      const newUser = { email: req.body.email, passwordHash: hash };
      const user = userRepository.create(newUser);
      try {
        const results = await userRepository.save(user);
        res.send(results);
      } catch {
        res.sendStatus(500);
      }
    }
  });
});

export default router;
