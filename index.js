const app = require("./app.js");
const { PORT } = require("./config/config");

const port = PORT;

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});

// TODO:

// Handle Payment DB in Order and Create Payment
// Handle it in frontend
