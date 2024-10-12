const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

const s3 = new AWS.S3();
const BUCKET_NAME = '3d-store-challenge';

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Function to check if bucket exists and create if it doesn't
async function createBucketIfNotExists() {
  try {
    await s3.headBucket({ Bucket: BUCKET_NAME }).promise();
    console.log(`Bucket ${BUCKET_NAME} already exists`);
  } catch (error) {
    if (error.statusCode === 404) {
      console.log(`Bucket ${BUCKET_NAME} does not exist. Creating...`);
      await s3.createBucket({ Bucket: BUCKET_NAME }).promise();
      console.log(`Bucket ${BUCKET_NAME} created successfully`);
      await configureBucketCORS();
    } else {
      console.error('Error checking bucket:', error);
      throw error;
    }
  }
}

// Function to configure CORS for the bucket
async function configureBucketCORS() {
  const corsConfig = {
    CORSRules: [
      {
        AllowedHeaders: ['*'],
        AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE'],
        AllowedOrigins: ['*'], // Replace with your domain in production
        ExposeHeaders: ['ETag']
      }
    ]
  };

  try {
    await s3.putBucketCors({
      Bucket: BUCKET_NAME,
      CORSConfiguration: corsConfig
    }).promise();
    console.log('CORS configuration updated successfully');
  } catch (error) {
    console.error('Error updating CORS configuration:', error);
  }
}

// Helper function to get models from S3
async function getModelsFromS3() {
  const params = {
    Bucket: BUCKET_NAME,
    Key: 'models.json'
  };

  try {
    const data = await s3.getObject(params).promise();
    return JSON.parse(data.Body.toString());
  } catch (error) {
    if (error.code === 'NoSuchKey') {
      return [];
    }
    console.error('Error fetching models from S3:', error);
    throw error;
  }
}

// Helper function to save models to S3
async function saveModelsToS3(models) {
  const params = {
    Bucket: BUCKET_NAME,
    Key: 'models.json',
    Body: JSON.stringify(models),
    ContentType: 'application/json'
  };

  try {
    await s3.putObject(params).promise();
  } catch (error) {
    console.error('Error saving models to S3:', error);
    throw error;
  }
}

// Route to handle file upload
app.post('/upload', upload.single('model'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const modelName = req.body.modelName || 'unnamedmodel';
  const fileExtension = path.extname(req.file.originalname);
  const newFilename = `${modelName}${fileExtension}`;

  // Parse position, scale, and details from the request
  const position = JSON.parse(req.body.position || '[0, 0, 0]');
  const rotation = JSON.parse(req.body.rotation || '[0, 0, 0]'); // Add rotation parsing
  const scale = JSON.parse(req.body.scale || '[1, 1, 1]');
  const details = req.body.details || '';

  try {
    // Upload file to S3
    await s3.putObject({
      Bucket: BUCKET_NAME,
      Key: `models/${newFilename}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    }).promise();

    // Save model info
    const modelInfo = {
      name: modelName,
      filename: newFilename,
      position: position,
      rotation: rotation, // Include rotation in model info
      scale: scale,
      details: details
    };

    let models = await getModelsFromS3();
    models.push(modelInfo);
    await saveModelsToS3(models);

    res.json({
      message: 'File uploaded successfully',
      model: modelInfo
    });
  } catch (error) {
    console.error('Error uploading to S3:', error);
    res.status(500).send('Error processing file.');
  }
});

// Route to get list of all models
app.get('/models', async (req, res) => {
  try {
    const models = await getModelsFromS3();
    res.json(models);
  } catch (error) {
    res.status(500).send('Error fetching models.');
  }
});

// Route to edit model details
app.put('/models/:filename', async (req, res) => {
  const { filename } = req.params;
  const { position, scale, details } = req.body;

  try {
    let models = await getModelsFromS3();
    const modelIndex = models.findIndex(model => model.filename === filename);

    if (modelIndex === -1) {
      return res.status(404).send('Model not found.');
    }

    // Update model details
    models[modelIndex] = {
      ...models[modelIndex],
      position: position || models[modelIndex].position,
      rotation: rotation || models[modelIndex].rotation, // Include rotation in update
      scale: scale || models[modelIndex].scale,
      details: details || models[modelIndex].details
    };

    await saveModelsToS3(models);

    res.json({
      message: 'Model updated successfully',
      model: models[modelIndex]
    });
  } catch (error) {
    console.error('Error updating model:', error);
    res.status(500).send('Error updating model.');
  }
});

// Route to serve model files
app.get('/uploads/:filename', async (req, res) => {
  const { filename } = req.params;
  const params = {
    Bucket: BUCKET_NAME,
    Key: `models/${filename}`
  };

  try {
    const data = await s3.getObject(params).promise();
    res.set('Content-Type', data.ContentType);
    res.set('Cache-Control', 'public, max-age=31536000');
    res.send(data.Body);
  } catch (error) {
    console.error('Error fetching file from S3:', error);
    res.status(404).send('File not found');
  }
});

// Start the server
app.listen(PORT, async () => {
  try {
    await createBucketIfNotExists();
    console.log(`Server running on http://localhost:${PORT}`);
  } catch (error) {
    console.error('Failed to start server:', error);
  }
});