import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'CloudLock API' });
});

// Password vault endpoints will be added here

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});