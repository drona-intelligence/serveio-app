import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import { bullBoardRouter } from './config/queue-dashboard.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { ordersRouter } from './routes/orders.routes.js';
import cors from 'cors'
const app = express();
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:5173"],
  credentials: true,
}));
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

app.use('/queue', bullBoardRouter);

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Order service is running',
  });
});

app.use('/api/v1/serveio/orders', ordersRouter);

app.use(errorMiddleware);

export default app;
