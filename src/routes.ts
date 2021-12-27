import { Application, Router } from "express";
import { getRepository } from "typeorm";

import { User } from "./entity/User";
import { Book } from "./entity/Book";

import users from "./route/users";
import books from "./route/books";
import auth, { authGuard } from "./route/auth";

export function setupRoutes(app: Application) {
  const services = buildServices();

  const protectedResources = Router();
  protectedResources.use("/users", users(services));
  protectedResources.use("/book", books(services));
  protectedResources.use(authGuard);

  const api = Router();
  api.use("/auth", auth);
  api.use(protectedResources);

  app.use("/api", api);
}

function buildServices() {
  return {
    userRepository: getRepository(User),
    bookRepository: getRepository(Book),
  };
}
