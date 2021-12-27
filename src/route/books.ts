import { Router, Request, Response } from "express";
import { Repository } from "typeorm";
import { Book } from "../entity/Book";

interface Deps {
  bookRepository: Repository<Book>;
}

export default function ({ bookRepository }: Deps) {
  const router = Router();

  router.get("/", async function (req: Request, res: Response) {
    const users = await bookRepository.find();
    res.json(users);
  });

  router.get("/:id", async function (req: Request, res: Response) {
    const results = await bookRepository.findOne(req.params.id);
    return res.send(results);
  });

  router.get("/books/:str", async function (req: Request, res: Response) {
    const results = await bookRepository.findOne(req.params.id);
    return res.send(results);
  });

  router.post("/create", async function (req: Request, res: Response) {
    const newBook = {
      // question: req.body.question,
      // max_mark: req.body.max_mark,
    };

    const results = await bookRepository.save(newBook);

    return res.send(results);
  });

  return router;
}
