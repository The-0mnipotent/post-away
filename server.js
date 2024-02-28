import "./env.js";
import express from "express";
import swagger from 'swagger-ui-express';
import userRouter from "./src/features/user/user.router.js";
import jwtAuth from "./src/middleware/jwt.token.auth.js";
import postRouter from "./src/features/post/post.route.js";
import commentRouter from "./src/features/comment/comment.routes.js";
import likesRouter from "./src/features/like/like.routes.js";
import { ApplicationError } from "./src/features/error-handeler/error-handeler.js";
import { logger } from "./src/middleware/logger.middleware.winston.js";
import loggerMiddleware from "./src/middleware/logger.middleware.winston.js";
import apiDocs from "./swagger.json" assert{type:'json'};
import {connecttomongoose} from "./src/config/monggose.connect.js"
import friendsRouter from "./src/features/friends/friends.routes.js"
import otpRoutes from "./src/features/opt.verification/otp.routes.js"
const server = express();
server.use(express.json()); 

server.use(loggerMiddleware);

//docs configration
server.use("/api-docs",
swagger.serve,
swagger.setup(apiDocs)
);
// Application level error handling
server.use((err, req, res, next) => {
  console.log(err);
  if (err instanceof ApplicationError) {
    res.status(err.code).send(err.message);
  }

logger.error({
    message: err.message,
    stack: err.stack,
  });

  res.status(500).send('Something went wrong, please try later');
});



// Using the user router
server.use("/api/users", userRouter);
server.use(
  "/api/posts",
  jwtAuth,
  postRouter
);
server.use("/api/comments",
              jwtAuth, 
             commentRouter
 );
server.use("/api/likes",
           jwtAuth, 
           likesRouter
           );
server.use("/api/friends",
           jwtAuth, 
           friendsRouter
           );
               
server.use("/api/otp",
           otpRoutes
           );
server.listen(8000, () => {
  console.log("Server is listening on 8000");
  connecttomongoose();
});


