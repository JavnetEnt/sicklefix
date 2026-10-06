const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

function loadClinics() {
  const file = path.join(__dirname, 'data', 'clinics.json');
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

app.use(express.json());
app.use(express.static('public'));

const questions = [
  {
    id: 1,
    text: "You can catch sickle cell disease by touching or sharing food with a warrior.",
    options: ["Myth", "Fact"],
    answer: 0,
    explain: "Sickle cell is genetic. It is inherited from parents, never spread by contact."
  },
  {
    id: 2,
    text: "Two parents with genotype AS have a 25% chance of a child with SS in each pregnancy.",
    options: ["Myth", "Fact"],
    answer: 1,
    explain: "Each pregnancy carries a 25% chance of SS, 50% of AS, and 25% of AA."
  },
  {
    id: 3,
    text: "Warriors often exaggerate crisis pain to get attention.",
    options: ["Myth", "Fact"],
    answer: 0,
    explain: "Crisis pain is real and can be severe. Disbelief is one of the biggest struggles warriors face."
  },
  {
    id: 4,
    text: "A fever in a person with sickle cell disease is an emergency.",
    options: ["Myth", "Fact"],
    answer: 1,
    explain: "Infections can become serious quickly. A fever needs urgent medical attention."
  },
  {
    id: 5,
    text: "Staying hydrated can help reduce the risk of a crisis.",
    options: ["Myth", "Fact"],
    answer: 1,
    explain: "Dehydration is a common trigger, so drinking enough water matters every day."
  }
];

// Send questions WITHOUT the answers
app.get('/api/questions', (req, res) => {
  const safe = questions.map(q => ({ id: q.id, text: q.text, options: q.options }));
  res.json(safe);
});

// Check one answer
app.post('/api/check', (req, res) => {
  const { id, choice } = req.body;
  const q = questions.find(item => item.id === id);
  if (!q) return res.status(404).json({ error: 'Question not found' });
  res.json({ correct: choice === q.answer, explain: q.explain });
});

// List clinics, with optional filters: /api/clinics?state=Oyo&q=hospital
app.get('/api/clinics', (req, res) => {
  let list = loadClinics();
  const { state, q } = req.query;

  if (state) {
    list = list.filter(c => c.state.toLowerCase() === state.toLowerCase());
  }
  if (q) {
    const term = q.toLowerCase();
    list = list.filter(c =>
      (c.name + ' ' + c.city + ' ' + c.type).toLowerCase().includes(term)
    );
  }
  res.json(list);
});

// List of states that have entries (for the dropdown)
app.get('/api/states', (req, res) => {
  const states = [...new Set(loadClinics().map(c => c.state))].sort();
  res.json(states);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Running on port ' + PORT));