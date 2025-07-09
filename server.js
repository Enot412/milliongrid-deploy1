const express = require('express');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const fse = require('fs-extra');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.static('public'));

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

app.post('/submit-ad', upload.single('image'), (req, res) => {
  const { link, description, amount, cells } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const ad = {
    link,
    description,
    amount: parseFloat(amount),
    cells: JSON.parse(cells),
    imageUrl,
    timestamp: new Date().toISOString()
  };

  const dbPath = path.join(__dirname, 'ads.json');
  let ads = [];

  if (fs.existsSync(dbPath)) {
    try {
      ads = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    } catch (e) {
      ads = [];
    }
  }

  ads.push(ad);
  fs.writeFileSync(dbPath, JSON.stringify(ads, null, 2));
  res.status(200).json({ message: 'Ad saved.' });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
