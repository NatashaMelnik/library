import { Router, Request, Response } from "express";
import { Repository, getRepository } from "typeorm";
import { User } from "../entity/User";
import { Book } from "../entity/Book";
import bcrypt from "bcrypt";

interface Deps {
  userRepository: Repository<User>;
  bookRepository: Repository<Book>;
}

export default function ({ userRepository }: Deps) {
  const router = Router();

  router.get("/", async function (req: Request, res: Response) {
    const users = await userRepository.find();
    res.json(users);
  });

  router.get("/profile/:id", async function (req: Request, res: Response) {
    const results = await userRepository.findOne({ id: 1 });
    const bookRepository = await getRepository(Book);
    const readedIds_ = results!.readed.split(",").map(function (i) {
      return parseInt(i, 10);
    });
    const readedIds = readedIds_.filter(function (x, i, a) {
      return a.indexOf(x) === i;
    });
    const likedIds_ = results!.liked.split(",").map(function (i) {
      return parseInt(i, 10);
    });
    const likedIds = likedIds_.filter(function (x, i, a) {
      return a.indexOf(x) === i;
    });
    const recomendedIds_ = results!.liked.split(",").map(function (i) {
      return parseInt(i, 10);
    });
    const recomendedIds = recomendedIds_.filter(function (x, i, a) {
      return a.indexOf(x) === i;
    });
    console.log(readedIds);
    let readed = [];
    let liked = [];
    let recomended = [];
    for (let i = 0; i < readedIds.length; i++) {
      if (!isNaN(+readedIds[i])) {
        const book = await bookRepository.findOne({ id: +readedIds[i] });
        readed.push(book);
      }
    }
    for (let i = 0; i < likedIds.length; i++) {
      if (!isNaN(+likedIds[i])) {
        const book = await bookRepository.findOne({ id: +likedIds[i] });
        liked.push(book);
      }
    }
    for (let i = 0; i < recomendedIds.length; i++) {
      if (!isNaN(+recomendedIds[i])) {
        const book = await bookRepository.findOne({ id: +recomendedIds[i] });
        recomended.push(book);
      }
    }
    const fakeres: any = results;
    fakeres.readed = readed;
    fakeres.liked = liked;
    fakeres.recomended = recomended;
    console.log(fakeres);
    return res.send(fakeres);
  });

  router.get("/:id/read/:bookid", async function (req: Request, res: Response) {
    console.log("in read");
    console.log(req.params.id);
    console.log(req.params.bookid);
    const results = await userRepository.findOne({ id: +req.params.id });
    const bookRepository = await getRepository(Book);
    const book = await bookRepository.findOne({ id: +req.params.bookid });
    if (book && results) {
      if (results!.readed === "" || !results!.readed) {
        results!.readed = req.params.bookid + ",";
        userRepository.save(results);
      } else {
        results!.readed = results!.readed + req.params.bookid + ",";
        userRepository.save(results);
      }
    }
    return res.send(results);
  });

  router.get("/:id/like/:bookid", async function (req: Request, res: Response) {
    const results = await userRepository.findOne({ id: +req.params.id });
    const bookRepository = await getRepository(Book);
    const book = await bookRepository.findOne({ id: +req.params.bookid });
    if (book && results) {
      if (results!.liked === "" || !results!.liked) {
        results!.liked = req.params.bookid + ",";
        userRepository.save(results);
      } else {
        results!.liked = results!.liked + req.params.bookid + ",";
        userRepository.save(results);
      }
    }
    return res.send(results);
  });

  router.get(
    "/:id/recomend/:bookid",
    async function (req: Request, res: Response) {
      const results = await userRepository.findOne({ id: +req.params.id });
      const bookRepository = await getRepository(Book);
      const book = await bookRepository.findOne({ id: +req.params.bookid });
      if (book && results) {
        if (results!.recomended === "" || !results!.recomended) {
          results!.recomended = req.params.bookid + ",";
          userRepository.save(results);
        } else {
          results!.recomended = results!.recomended + req.params.bookid + ",";
          userRepository.save(results);
        }
      }
      return res.send(results);
    }
  );

  router.post("/create", async function (req: Request, res: Response) {
    bcrypt.hash(req.body.password, 2, async function (err, hash) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      }
      const newUser = { email: req.body.email, passwordHash: hash };
      const user = await userRepository.create(newUser);

      const results = await userRepository.save(user);
      return res.send(results);
    });
  });

  router.put("/:id", async function (req: Request, res: Response) {
    const user = await userRepository.findOne(req.params.id);
    if (user) {
      userRepository.merge(user, req.body);
      const results = await userRepository.save(user);
      return res.send(results);
    } else {
      res.sendStatus(404);
    }
  });

  router.delete("/:id", async function (req: Request, res: Response) {
    const results = await userRepository.delete(req.params.id);
    return res.send(results);
  });

  return router;
}
