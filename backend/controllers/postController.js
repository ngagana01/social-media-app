import Post from "../models/Post.js";

/* =========================================
   GET ALL POSTS
========================================= */

export async function getPosts(req, res) {
  try {
    const posts = await Post.find()
      .populate(
        "author",
        "name email profilePicture username"
      )
      .populate(
        "comments.user",
        "name email profilePicture username"
      )
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error("Get posts error:", error);

    res.status(500).json({
      message: "Failed to load posts",
    });
  }
}

/* =========================================
   GET SINGLE POST
========================================= */

export async function getPost(req, res) {
  try {
    const post = await Post.findById(req.params.id)
      .populate(
        "author",
        "name email profilePicture username"
      )
      .populate(
        "comments.user",
        "name email profilePicture username"
      );

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.json(post);
  } catch (error) {
    console.error("Get post error:", error);

    res.status(500).json({
      message: "Failed to load post",
    });
  }
}

/* =========================================
   CREATE POST
   TEXT + IMAGE + VIDEO
========================================= */

export async function createPost(req, res) {
  try {
    const content = req.body.content?.trim() || "";

    /*
      req.file is created by multer.
    */

    let mediaUrl = null;
    let mediaType = null;

    if (req.file) {
      mediaUrl = `/uploads/${req.file.filename}`;

      if (req.file.mimetype.startsWith("image/")) {
        mediaType = "image";
      }

      if (req.file.mimetype.startsWith("video/")) {
        mediaType = "video";
      }
    }

    /*
      A post must contain either text
      or an image/video.
    */

    if (!content && !req.file) {
      return res.status(400).json({
        message:
          "Please write something or upload an image/video.",
      });
    }

    const post = await Post.create({
      content,
      author: req.user._id,
      mediaUrl,
      mediaType,
    });

    const populatedPost = await post.populate(
      "author",
      "name email profilePicture username"
    );

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error("Create post error:", error);

    res.status(500).json({
      message: "Failed to create post",
      error: error.message,
    });
  }
}

/* =========================================
   UPDATE POST
========================================= */

export async function updatePost(req, res) {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (
      post.author.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    if (req.body.content !== undefined) {
      post.content =
        req.body.content.trim();
    }

    await post.save();

    const populatedPost = await post.populate(
      "author",
      "name email profilePicture username"
    );

    res.json(populatedPost);
  } catch (error) {
    console.error("Update post error:", error);

    res.status(500).json({
      message: "Failed to update post",
    });
  }
}

/* =========================================
   DELETE POST
========================================= */

export async function deletePost(req, res) {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (
      post.author.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await post.deleteOne();

    res.json({
      message: "Post deleted",
    });
  } catch (error) {
    console.error("Delete post error:", error);

    res.status(500).json({
      message: "Failed to delete post",
    });
  }
}

/* =========================================
   LIKE / UNLIKE
========================================= */

export async function toggleLike(req, res) {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const userId =
      req.user._id.toString();

    const alreadyLiked =
      post.likes.some(
        (id) =>
          id.toString() === userId
      );

    if (alreadyLiked) {
      post.likes =
        post.likes.filter(
          (id) =>
            id.toString() !== userId
        );
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();

    res.json({
      likes: post.likes,
      liked: !alreadyLiked,
    });
  } catch (error) {
    console.error("Like error:", error);

    res.status(500).json({
      message: "Failed to update like",
    });
  }
}

/* =========================================
   ADD COMMENT
========================================= */

export async function addComment(req, res) {
  try {
    const { postId } = req.params;

    const content =
      req.body.content?.trim() || "";

    if (!content) {
      return res.status(400).json({
        message:
          "Comment cannot be empty",
      });
    }

    const post =
      await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    post.comments.push({
      user: req.user._id,
      content,
    });

    await post.save();

    await post.populate(
      "comments.user",
      "name email profilePicture username"
    );

    const comment =
      post.comments[
        post.comments.length - 1
      ];

    res.status(201).json({
      message:
        "Comment added successfully",

      comment,
    });
  } catch (error) {
    console.error(
      "Add comment error:",
      error
    );

    res.status(500).json({
      message: "Failed to add comment",
      error: error.message,
    });
  }
}