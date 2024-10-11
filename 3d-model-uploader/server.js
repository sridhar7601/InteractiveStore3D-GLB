const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route to handle file upload
app.post('/upload', upload.single('model'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const modelName = req.body.modelName || 'unnamedmodel';
  const fileExtension = path.extname(req.file.originalname);
  const newFilename = `${modelName}${fileExtension}`;
  const oldPath = req.file.path;
  const newPath = path.join(path.dirname(oldPath), newFilename);

  // Parse position, scale, and details from the request
  const position = JSON.parse(req.body.position || '[0, 0, 0]');
  const scale = JSON.parse(req.body.scale || '[1, 1, 1]');
  const details = req.body.details || '';

  fs.rename(oldPath, newPath, (err) => {
    if (err) {
      console.error('Error renaming file:', err);
      return res.status(500).send('Error processing file.');
    }

    // Save model info to a JSON file
    const modelInfo = {
      name: modelName,
      filename: newFilename,
      position: position,
      scale: scale,
      details: details
    };

    const modelsJsonPath = path.join(__dirname, 'models.json');
    let models = [];
    if (fs.existsSync(modelsJsonPath)) {
      models = JSON.parse(fs.readFileSync(modelsJsonPath, 'utf8'));
    }
    models.push(modelInfo);
    fs.writeFileSync(modelsJsonPath, JSON.stringify(models, null, 2));

    res.json({
      message: 'File uploaded successfully',
      model: modelInfo
    });
  });
});

// Route to get list of all models
app.get('/models', (req, res) => {
  const modelsJsonPath = path.join(__dirname, 'models.json');
  if (fs.existsSync(modelsJsonPath)) {
    const models = JSON.parse(fs.readFileSync(modelsJsonPath, 'utf8'));
    res.json(models);
  } else {
    res.json([]);
  }
});

// New route to edit model details
app.put('/models/:filename', (req, res) => {
  const { filename } = req.params;
  const { position, scale, details } = req.body;

  const modelsJsonPath = path.join(__dirname, 'models.json');
  if (!fs.existsSync(modelsJsonPath)) {
    return res.status(404).send('Models file not found.');
  }

  let models = JSON.parse(fs.readFileSync(modelsJsonPath, 'utf8'));
  const modelIndex = models.findIndex(model => model.filename === filename);

  if (modelIndex === -1) {
    return res.status(404).send('Model not found.');
  }

  // Update model details
  models[modelIndex] = {
    ...models[modelIndex],
    position: position || models[modelIndex].position,
    scale: scale || models[modelIndex].scale,
    details: details || models[modelIndex].details
  };

  // Save updated models back to the JSON file
  fs.writeFileSync(modelsJsonPath, JSON.stringify(models, null, 2));

  res.json({
    message: 'Model updated successfully',
    model: models[modelIndex]
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});