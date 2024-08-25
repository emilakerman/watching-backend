import express from "express";
import pkg from "pg";
import { postPW, postHost, postDB, postUser, postPort, secretToken } from "./config.js";

const { Pool } = pkg;
const app = express();
// Need to use this process.env.PORT for Render to work.
const port = process.env.PORT || 3000;

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`App running on port http://localhost:${port}`);
});

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

// TODO: Test and implement endpoint in frontend!
// Returns all settings
app.get(`/${secretToken}/settings`, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Settings"');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error querying database");
  }
});

// TODO: Test and implement endpoint in frontend!
// Returns all featured items.
app.get(`/${secretToken}/featured`, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "Featured"');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error querying database");
    }
    });

// Returns all users.
// TODO: Test and implement endpoint in frontend!
app.get(`/${secretToken}/users`, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "Users"');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error querying database");
    }
    });

// Returns all publics users
app.get(`/${secretToken}/public-users`, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "Settings" WHERE "isPublic" = true');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error querying database");
    }
    });

// Returns true or false if user exists.
// TODO: Test and implement endpoint in frontend!
app.get(`/${secretToken}/users/:userId`, async (req, res) => {
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


export { app, server };

