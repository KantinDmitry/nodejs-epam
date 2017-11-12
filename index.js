require('babel-register');
const app = require('app').default;

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`App listening on port ${port}!`));
