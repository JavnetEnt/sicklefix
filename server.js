const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public'));

function loadJSON(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'data', name), 'utf8'));
}

// ---------- Quiz ----------
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// /api/questions?topic=myths&n=8  (answers are NOT sent)
app.get('/api/questions', (req, res) => {
  let list = loadJSON('questions.json');
  const { topic, n } = req.query;
  if (topic && topic !== 'all') list = list.filter(q => q.topic === topic);
  list = shuffle(list);
  const count = parseInt(n, 10);
  if (count > 0) list = list.slice(0, count);
  res.json(list.map(q => ({ id: q.id, topic: q.topic, text: q.text, options: q.options })));
});

app.post('/api/check', (req, res) => {
  const { id, choice } = req.body;
  const q = loadJSON('questions.json').find(item => item.id === id);
  if (!q) return res.status(404).json({ error: 'Question not found' });
  res.json({ correct: choice === q.answer, answer: q.answer, explain: q.explain });
});

// ---------- Clinics ----------
app.get('/api/clinics', (req, res) => {
  let list = loadJSON('clinics.json');
  const { state, q } = req.query;
  if (state) list = list.filter(c => c.state.toLowerCase() === state.toLowerCase());
  if (q) {
    const term = q.toLowerCase();
    list = list.filter(c => (c.name + ' ' + c.city + ' ' + c.type).toLowerCase().includes(term));
  }
  res.json(list);
});

app.get('/api/states', (req, res) => {
  res.json([...new Set(loadJSON('clinics.json').map(c => c.state))].sort());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Running on port ' + PORT));