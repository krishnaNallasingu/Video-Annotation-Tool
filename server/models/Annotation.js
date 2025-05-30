const mongoose = require('mongoose');

const AnnotationSchema = new mongoose.Schema({
  videoId: { type: String }, // Optional: only if you support multiple videos
  type: { type: String, required: true },
  timestamp: { type: Number, required: true },
  duration: { type: Number, default: 3 },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  width: { type: Number },    // Optional for text
  height: { type: Number },   // Optional for text
  color: { type: String, default: '#0d6efd' },
  text: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Annotation', AnnotationSchema);