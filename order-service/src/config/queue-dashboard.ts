import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { orderEventsQueue } from './queue.js';

const serverAdapter = new ExpressAdapter();

createBullBoard({
  queues: [new BullMQAdapter(orderEventsQueue)],
  serverAdapter: serverAdapter,
});

serverAdapter.setBasePath('/queue');

export const bullBoardRouter = serverAdapter.getRouter();
