import express from "express";
import pkg from "pg";
import { postPW, postHost, postDB, postUser, postPort } from "./config.js";
const { Pool } = pkg;

const app = express();
const port = 3000;

const pool = new Pool({
  user: postUser,
  host: postHost,
  database: postDB,
  password: postPW,
  port: postPort,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Returns all tables in the public schema.
app.get("/tables", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error querying database");
  }
});

// Returns all settings
app.get("/settings", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Settings"');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error querying database");
  }
});

// Returns all featured items.
app.get("/featured", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "Featured"');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error querying database");
    }
    });

// Returns all users.
app.get("/users", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "Users"');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error querying database");
    }
    });

// Returns all publics users
app.get("/public-users", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "Settings" WHERE "isPublic" = true');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error querying database");
    }
    });

// Returns true or false if user exists.
app.get("/users/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const result = await pool.query('SELECT * FROM "Users" WHERE "userId" = $1', [
      userId,
    ]);
    if (result.rows.length > 0) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error querying database");
  }
});

app.listen(port, () => {
  console.log(`App running on port http://localhost:${port}`);
});
