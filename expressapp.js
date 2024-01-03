const express = require('express');
const fs = require('fs');
const multer = require('multer');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage();

const upload = multer({
  storage
});

app.post('/api/file', upload.single('file'), (req, res) => {
  try {
    const file = req.file;
  
    if (!file) {
      throw new Error("Please upload a file");
    }
    
    const multerText = Buffer.from(file.buffer).toString("utf-8");
  
    const filestream = fs.createWriteStream(`${__dirname}/uploads/${req.file.originalname}`);
  
    filestream.write(multerText);
  
    res.status(200).json({status: "success"});
  } catch (error) {
    console.error(error);
    res.status(400).json({status: "error", description: error})
  }
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log('Server started on port 5000')
});