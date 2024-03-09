import express, { Express, Request, Response } from "express";
import apicache from "apicache";

import { connectDB } from "./db";

import {
  createBookEntry,
  getAllBooks,
  getSpecificBook,
} from "./controllers/books";

import {
  createMemberEntry,
  getAllMembers,
  getSpecificMember,
} from "./controllers/members";
import {
  checkOutBookToMember,
  returnBookFromMember,
} from "./controllers/circulations";
import {
  getBookReserverations,
  getMemberReservations,
} from "./controllers/reservations";

const app: Express = express();
const port: number = 5001;

app.use(express.json());

let cache = apicache.middleware;

connectDB();

app.get("/", cache("5 minutes"), async (req: Request, res: Response) => {
  res.send("Welcome to Library");
});

app.get("/books/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  let result;
  try {
    result = await getSpecificBook(id);
    if (!result) {
      result = "No Book Found";
    }
  } catch (error) {
    result = error;
  }
  res.send(result);
});

app.get("/books", cache("5 minutes"), async (req: Request, res: Response) => {
  let result = await getAllBooks();
  if (result instanceof Error) {
    res.status(500);
    res.render("Error", result);
  }
  res.send(result);
});

app.post("/books", async (req: Request, res: Response) => {
  let result = await createBookEntry({
    title: req.body.title,
    author: req.body.author,
    numberOfCopies: req.body.numberOfCopies,
  });

  res.send(result);
});

app.get(
  "/members/:id",
  cache("5 minutes"),
  async (req: Request, res: Response) => {
    const { id } = req.params;

    let result = await getSpecificMember(id);
    res.send(result);
  }
);

app.get("/members", async (req: Request, res: Response) => {
  let result = await getAllMembers();
  res.send(result);
});

app.post("/members", async (req: Request, res: Response) => {
  let result = await createMemberEntry({
    age: req.body.age,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });
  res.send(result);
});

app.post("/circulations", async (req: Request, res: Response) => {
  let result;
  if (req.body.type == "checkout") {
    result = await checkOutBookToMember(
      req.body.bookId,
      req.body.memberId,
      req.body.startDate
    );
  } else if (req.body.type == "return") {
    result = await returnBookFromMember(
      req.body.bookId,
      req.body.memberId,
      req.body.startDate
    );
  }

  res.send(result);
});

app.get("/reservations/:type", async (req: Request, res: Response) => {
  let result;
  let { type } = req.params;
  let { bookId, memberId } = req.query;
  if (type === "book" && bookId) {
    result = await getBookReserverations(bookId.toString());
  } else if (type === "member" && memberId) {
    result = await getMemberReservations(memberId.toString());
  }

  res.send(result);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
