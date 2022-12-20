import express from "express";
import uniqid from "uniqid"; // 3rd party module

// CORE MODULE THAT'S DOESN'T NEED INSTALL
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const authorsRouter = express.Router();

const authorsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "author.json"
);

authorsRouter.get("/", (request, response) => {
  const fileContent = fs.readFileSync(authorsJSONPath);
  const authors = JSON.parse(fileContent);
  response.send(authors);
});

authorsRouter.post("/", (request, response) => {
  const newAuthor = { ...request.body, createdAt: new Date(), ID: uniqid() };
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));
  authorsArray.push(newAuthor);
  fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray)); 
    response.status(201).send({ id: newAuthor.ID });
});
authorsRouter.get("/:authorId", (request, response) => {
    const authorID = request.params.authorId
    const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath))
    const foundAuthor = authorsArray.find(author => author.ID === authorID)
    response.send(foundAuthor)
});
authorsRouter.put("/:authorId", (request, response) => {
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath))
  const index = authorsArray.findIndex(author => author.ID === request.params.authorId)
  const oldAuthor = authorsArray[index]
  const updatedAuthor = { ...oldAuthor, ...request.body, updatedAt: new Date() }
  authorsArray[index] = updatedAuthor
  fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray))
  response.send(updatedAuthor)
});
authorsRouter.delete("/:authorId", (request, response) => {
    const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath))
    const remainingAuthors = authorsArray.filter(
      author => author.ID !== request.params.authorId
    )
    fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingAuthors))
    response.status(204).send('delete successfully')
});
export default authorsRouter;
