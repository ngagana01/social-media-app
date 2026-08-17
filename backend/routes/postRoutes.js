import { Router } from "express";

import multer from "multer";
import path from "path";
import fs from "fs";

import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
} from "../controllers/postController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = Router();

/* =========================================
   UPLOAD DIRECTORY
========================================= */

const uploadDirectory = "uploads";

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

/* =========================================
   MULTER STORAGE
========================================= */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },

  filename: function (req, file, cb) {
    const extension =
      path.extname(file.originalname);

    const filename =
      `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${extension}`;

    cb(null, filename);
  },
});

/* =========================================
   FILE VALIDATION
========================================= */

const fileFilter = (
  req,
  file,
  cb
) => {
  const allowedImages = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
    "image/gif",
  ];

  const allowedVideos = [
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime",
  ];

  if (
    allowedImages.includes(
      file.mimetype
    ) ||
    allowedVideos.includes(
      file.mimetype
    )
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only image and video files are allowed."
      ),
      false
    );
  }
};

/* =========================================
   MULTER
========================================= */

const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

/* =========================================
   AUTHENTICATION
========================================= */

router.use(protect);

/* =========================================
   GET ALL POSTS
========================================= */

router.get("/", getPosts);

/* =========================================
   CREATE POST
========================================= */

router.post(
  "/",
  upload.single("media"),
  createPost
);

/* =========================================
   ADD COMMENT
========================================= */

router.post(
  "/:postId/comments",
  addComment
);

/* =========================================
   SINGLE POST
========================================= */

router.get("/:id", getPost);

/* =========================================
   UPDATE
========================================= */

router.put("/:id", updatePost);

/* =========================================
   DELETE
========================================= */

router.delete("/:id", deletePost);

/* =========================================
   LIKE
========================================= */

router.put("/:id/like", toggleLike);

export default router;