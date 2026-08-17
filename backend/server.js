import dns from "dns";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";

/* =========================================
   DNS
========================================= */

dns.setServers([
  "8.8.8.8",
  "1.1.1.1",
]);

/* =========================================
   ENV
========================================= */

dotenv.config();

/* =========================================
   APP
========================================= */

const app = express();

/* =========================================
   CORS
========================================= */

app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      "http://localhost:5173",

    credentials: true,
  })
);

/* =========================================
   BODY PARSER
========================================= */

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

/* =========================================
   REQUEST LOGGER
========================================= */

app.use(
  (req, res, next) => {
    console.log(
      `${req.method} ${req.originalUrl}`
    );

    next();
  }
);

/* =========================================
   STATIC UPLOADS
========================================= */

app.use(
  "/uploads",
  express.static("uploads")
);

/* =========================================
   HEALTH
========================================= */

app.get(
  "/api/health",
  (req, res) => {
    res.json({
      status: "ok",
    });
  }
);

/* =========================================
   ROUTES
========================================= */

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/posts",
  postRoutes
);

app.use(
  "/api/users",
  userRoutes
);

/* =========================================
   ERROR HANDLER
========================================= */

app.use(
  (err, req, res, next) => {
    console.error(
      "SERVER ERROR:",
      err
    );

    if (
      err instanceof Error &&
      err.message.includes(
        "Only image and video files"
      )
    ) {
      return res.status(400).json({
        message: err.message,
      });
    }

    if (
      err.code ===
      "LIMIT_FILE_SIZE"
    ) {
      return res.status(400).json({
        message:
          "File is too large. Maximum size is 50MB.",
      });
    }

    res.status(500).json({
      message:
        err.message ||
        "Internal server error",
    });
  }
);

/* =========================================
   SERVER
========================================= */

const PORT =
  process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(
      PORT,
      () => {
        console.log(
          `Server running on port ${PORT}`
        );

        console.log(
          `Uploads available at http://localhost:${PORT}/uploads`
        );
      }
    );
  })
  .catch((error) => {
    console.error(
      "Database connection failed:",
      error
    );

    process.exit(1);
  });