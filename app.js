const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const filePath = path.join(__dirname, 'hospitalData.json');

app.use(bodyParser.json());


const readData = () => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data:', error.message);
    return null;
  }
};


const writeData = (data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log('Data written successfully');
  } catch (error) {
    console.error('Error writing data:', error.message);
  }
};


app.get('/api/hospital', (req, res) => {
  const data = readData();
  if (data) {
    res.json({ hospital: data.hospital });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/api/hospital', (req, res) => {
  const newData = req.body;
  const data = readData();
  if (data) {
    data.hospital = { ...data.hospital, ...newData };
    writeData(data);
    res.json({ message: 'Hospital data updated successfully', hospital: data.hospital });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/hospital', (req, res) => {
});

app.delete('/api/hospital', (req, res) => {
  const initialData = {
    name: 'General Hospital',
    patientCount: 100,
    location: 'Cityville',
  };
  writeData({ hospital: initialData });
  res.json({ message: 'Hospital data reset successfully', hospital: initialData });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});