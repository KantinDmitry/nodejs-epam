import express from 'express';
import cookieParser from 'middlewares/cookie-parser';
import queryParser from 'middlewares/query-parser';
import get from 'lodash.get';
import bodyParser from 'body-parser';

const NOT_FOUND_JSON = JSON.stringify({ message: 'Not found' });
const WRONG_FORMAT_JSON = JSON.stringify({ message: 'Wrong format' });
const DONE_JSON = JSON.stringify({ message: 'Done' });

const fakeData = {
    products: [{
        id: 1,
        name: 'product #1',
        reviews: ['very dank product', 'value for money!'],
    }, {
        id: 2,
        name: 'product #2',
        reviews: ['poor quallity'],
    }],
    users: [
        { id: 1, name: 'user1' },
        { id: 2, name: 'user2' },
        { id: 3, name: 'user3' },
    ],
};
const app = express();

app.use(cookieParser);
app.use(queryParser);
app.use(bodyParser.json());

app.get('/api/products', (req, res) => {
    res.status(200).json(fakeData.products);
});

app.get('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const product = fakeData.products[id];

    if (product) {
        res.status(200).json(product);
    } else {
        res.status(404).json(NOT_FOUND_JSON);
    }
});

app.get('/api/products/:id/reviews', (req, res) => {
    const { id } = req.params;
    const productReviews = get(fakeData, `products[${id}].reviews`);

    if (productReviews) {
        res.status(200).json(productReviews);
    } else {
        res.status(404).json(NOT_FOUND_JSON);
    }
});

app.get('/api/users', (req, res) => {
    res.status(200).json(fakeData.users);
});

app.post('/api/products', (req, res) => {
    const MANDATORY_FIELDS = ['name'];
    const { body } = req;
    const isRequestInvalid = MANDATORY_FIELDS.some(field => !body[field]);

    if (isRequestInvalid) {
        return res.status(400).json(WRONG_FORMAT_JSON);
    }

    const product = Object.assign({}, body, { id: fakeData.products.length + 1 });
    fakeData.products.push(product);

    return res.status(200).json(DONE_JSON);
});

export default app;
