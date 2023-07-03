const cors = require('cors');

const express = require('express');
const app = express();

require('./conn');
const Usage = require('./UsageSchema');

app.use(cors());

app.get('/', async function (req, res) {
  try {
    let { limit, rangeStart, rangeEnd } = req.query;

    limit = +limit;

    const defaultResponse = {
      title: 'Usage v/s limit chart',
      units: 'GiB',
      data: {
        names: ['Used', 'Limit'],
        values: [],
      },
    };

    if (!limit) {
      if (!rangeStart || !rangeEnd) {
        throw new Error('Please specify start and end');
      }

      res.send(defaultResponse).status(200);
      return;
    }

    const count = await Usage.count();

    if (limit > 360) {
      const data = await Usage.aggregate([
        { $sort: { timeStamp: 1 } },
        { $skip: count - limit },
        { $match: { timeStamp: { $mod: [60 * 10, 0] } } },
      ]);

      const response = { ...defaultResponse };
      response.data.values = data.map((item) => [
        item.timeStamp,
        item.usage,
        item.limit,
      ]);

      res.send(response).status(200);
      return;
    }

    const data = await Usage.aggregate([
      { $sort: { timeStamp: 1 } },
      { $skip: count - limit },
    ]);

    const response = { ...defaultResponse };
    response.data.values = data.map((item) => [
      item.timeStamp,
      item.usage,
      item.limit,
    ]);

    res.send(response).status(200);
  } catch (err) {
    if (err) console.log(err);
    res.send('Something went wrong').status(500);
  }
});

app.listen(3030);

module.exports = app;
