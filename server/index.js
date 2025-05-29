const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Dummy in-memory annotations store
let annotations = [];

app.get('/api/annotations', (req, res) => {
  res.json(annotations);
});

app.post('/api/annotations', (req, res) => {
  const annotation = req.body;
  annotation.id = Date.now();
  annotations.push(annotation);
  res.status(201).json(annotation);
});

app.put('/api/annotations/:id', (req, res) => {
  const { id } = req.params;
  annotations = annotations.map(ann =>
    ann.id == id ? { ...ann, ...req.body } : ann
  );
  res.json({ success: true });
});

app.delete('/api/annotations/:id', (req, res) => {
  const { id } = req.params;
  annotations = annotations.filter(ann => ann.id != id);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
