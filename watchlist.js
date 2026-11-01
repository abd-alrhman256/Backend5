import express from "express";

import { authenticate } from "../middleware/authenticate.js";
import { authorizeModification } from "../middleware/authorize.js";

import {
  getWatchlist,
  addMovie,
  updateMovie,
  deleteMovie
} from "../utils/db.js";

const router = express.Router();

// GET: Get user's watchlist
router.get("/:userId", authenticate, (req, res) => {
  const watchlist = getWatchlist(req.params.userId);

  if (watchlist === null) {
    return res.status(404).json({
      error: "User not found"
    });
  }

  return res.status(200).json(watchlist);
});

// POST: Add movie
router.post(
  "/:userId/movies",
  authenticate,
  authorizeModification,
  (req, res) => {
    const movie = addMovie(req.params.userId, req.body);

    if (movie === null) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    return res.status(201).json(movie);
  }
);

// PUT: Update movie
router.put(
  "/:userId/movies/:movieId",
  authenticate,
  authorizeModification,
  (req, res) => {
    const movie = updateMovie(
      req.params.userId,
      Number(req.params.movieId),
      req.body
    );

    if (movie === null) {
      return res.status(404).json({
        error: "Movie not found"
      });
    }

    return res.status(200).json(movie);
  }
);

// DELETE: Delete movie
router.delete(
  "/:userId/movies/:movieId",
  authenticate,
  authorizeModification,
  (req, res) => {
    const result = deleteMovie(
      req.params.userId,
      Number(req.params.movieId)
    );

    if (result === null) {
      return res.status(404).json({
        error: "Movie not found"
      });
    }

    return res.status(200).json({
      message: "Movie deleted successfully"
    });
  }
);

export default router;