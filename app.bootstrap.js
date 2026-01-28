import { serverPort } from './Config/config.service.js';
import { globalErrorHandler } from './Src/Common/index.js';
import { auth, users, notes } from './Src/Modules/index.js';
import e from 'express';
import './Config/env.watcher.js';
import './Src/DB/index.js';
import { authorization } from './Src/Common/middlewares/auth.middleware.js';
export async function bootstrap() {
  const app = e();
  // File Parsing
  app.use(e.json());
  // Routing
  app.use('/auth', auth);
  app.use('/users', authorization, users);
  app.use("/notes",authorization,notes);
  // Error Handling
  app.use(globalErrorHandler);
  app.listen(serverPort, () => {
    console.log(`Server is running on port ${serverPort} Successfully 🚀🚀`);
  });
}
