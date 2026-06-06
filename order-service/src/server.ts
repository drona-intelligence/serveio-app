import app from './app.js';
const cors = require('cors')

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
});
