import { Router } from 'express';
import get from 'lodash.get';

const productsRouter = Router();
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
};

const NOT_FOUND_JSON = JSON.stringify({ message: 'Not found' });
const WRONG_FORMAT_JSON = JSON.stringify({ message: 'Wrong format' });
const DONE_JSON = JSON.stringify({ message: 'Done' });

productsRouter.post('/', (req, res) => {
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

productsRouter.get('/', (req, res) => {
    res.status(200).json(fakeData.products);
});

productsRouter.get('/:id', (req, res) => {
    const { id } = req.params;
    const product = fakeData.products[id];

    if (product) {
        res.status(200).json(product);
    } else {
        res.status(404).json(NOT_FOUND_JSON);
    }
});

productsRouter.get('/:id/reviews', (req, res) => {
    const { id } = req.params;
    const productReviews = get(fakeData, `products[${id}].reviews`);

    if (productReviews) {
        res.status(200).json(productReviews);
    } else {
        res.status(404).json(NOT_FOUND_JSON);
    }
});

export default productsRouter;
