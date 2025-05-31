require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Annotation = require('./models/Annotation');

const app = express();
// const PORT = 5001;
// MongoDB connection
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5001;
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.connect(
//   "mongodb+srv://jagankrishna369:Cvg9IbZ2qwZbW8Bb@videoannotationdb.szwwqx2.mongodb.net/video-annotations?retryWrites=true&w=majority",
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   }
// );
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

// Helper to map _id to id
function mapAnnotation(doc) {
  const obj = doc.toObject ? doc.toObject() : doc;
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
}

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('<hr><h2><center>Welcome to the Video Annotation Tool Backend API</h2><p>Use <code>/api/annotations</code> for annotation endpoints.<i> Thank You..</i></center></p>');
});


app.get('/api/annotations', async (req, res) => {
  const { videoId } = req.query;
  const filter = videoId ? { videoId } : {};
  const annotations = await Annotation.find(filter).sort({ timestamp: 1 });
  res.json(annotations.map(mapAnnotation));
});

// Create a new annotation
app.post('/api/annotations', async (req, res) => {
  try {
    const annotation = new Annotation(req.body);
    await annotation.save();
    res.status(201).json(mapAnnotation(annotation));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update an annotation
app.put('/api/annotations/:id', async (req, res) => {
  try {
    const annotation = await Annotation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(mapAnnotation(annotation));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an annotation
app.delete('/api/annotations/:id', async (req, res) => {
  try {
    await Annotation.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


// working fine and deploying...