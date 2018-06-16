const express = require('express');
const app = express();
const cors = require('cors');
// const bodyParser = require('body-parser');  // only needed to access post request body
const port = process.env.PORT || 3000;

const topicsController = require('./controllers/topics.controller.js');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(cors());

// this is so the following can access a post request body
// app.use(bodyParser.json({ type: 'application/json' }));

app.get('/:numString', topicsController.predictWord);
// app.get('/topics', topicsController.listTopics);
// app.post('/topics/:id', topicsController.addTopic);
// app.delete('/topics/:id', topicsController.deleteTopic);
// app.put('/topics/:id/up', topicsController.voteUp);
// app.put('/topics/:id/down', topicsController.voteDown);

// same as above
// app.get('/topics', (req, res) => res.send('GET /topics'));
// app.post('/topics/:id', (req, res) => res.send('POST /topics'));
// app.delete('/topics/:id', (req, res) => res.send('DELETE /topics/:id'));
// app.put('/topics/:id/up', (req, res) => res.send('PUT /topics/:id'));
// app.put('/topics/:id/down', (req, res) => res.send('PUT /topics/:id'));

app.listen(port, () => console.log('app listening on https port number', port));
