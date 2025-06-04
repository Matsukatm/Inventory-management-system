const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const DATA_PATH = path.join(__dirname, 'medicines.json');

app.use(cors());
app.use(express.json());

let medicines = [];

// Load data from file if exists
if (fs.existsSync(DATA_PATH)) {
  medicines = JSON.parse(fs.readFileSync(DATA_PATH));
}

const saveData = () => {
  fs.writeFileSync(DATA_PATH, JSON.stringify(medicines, null, 2));
};

// Get all medicines
app.get('/api/medicines', (req, res) => {
  res.json(medicines);
});

// Add new medicine
app.post('/api/medicines', (req, res) => {
  const newMedicine = { ...req.body, id: Date.now().toString() };
  medicines.push(newMedicine);
  saveData();
  res.status(201).json(newMedicine);
});

// Update medicine by id
app.put('/api/medicines/:id', (req, res) => {
  const { id } = req.params;
  medicines = medicines.map(med =>
    med.id === id ? { ...med, ...req.body } : med
  );
  saveData();
  res.json({ message: 'Medicine updated.' });
});

// Delete medicine by id
app.delete('/api/medicines/:id', (req, res) => {
  const { id } = req.params;
  medicines = medicines.filter(med => med.id !== id);
  saveData();
  res.json({ message: 'Medicine deleted.' });
});

// Get medicines with quantity below threshold
app.get('/api/low-stock', (req, res) => {
  const threshold = parseInt(req.query.threshold) || 5;
  const lowStock = medicines.filter(med => med.quantity <= threshold);
  res.json(lowStock);
});

// Client prescription request
app.post('/api/request-prescription', (req, res) => {
  const { clientName, medicineName } = req.body;
  console.log(`Client ${clientName} requested prescription for ${medicineName}`);
  res.json({ message: 'Prescription request received.' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
