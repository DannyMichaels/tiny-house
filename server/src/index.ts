import express from 'express';
const app = express();
const port = 9000;

const one = 1;
const two = 2;

app.get("/", (_req, res) => res.send(`1 + 2 = ${one + two}`));

app.listen(port);

console.log(`[app]: http://localhost:${port}`)

//npm install typescript ts-node -D
// ts-node will help me run typescript code directly from the terminal.
// next I have to make a tsconfig.json file

// for eslint support
// npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin