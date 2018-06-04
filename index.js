const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const topicsController = require('./controllers/topics.controller.js');

app.use(bodyParser.json()); // this is so the following can use the body


app.get('/:numberString', topicsController.listTopics);
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

app.listen(3000, () => console.log('app listening on https....'));
