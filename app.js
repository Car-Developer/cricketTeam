const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "cricketTeam.db");

const app = express();
app.use(express.json());

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//Get players API

app.get("/players/", async (request, response) => {
  const getPlayersQuery = `SELECT * FROM cricket_team;`;
  const players = await db.all(getPlayersQuery);
  response.send(players);
});

//create Player API

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const createPlayerQuery = `INSERT INTO cricket_team (player_name,jersey_number,role)
    VALUES
    (
        '${playerName}',
        ${jerseyNumber},
        '${role}'
    ) ;
    `;
  const dbResponse = await db.run(createPlayerQuery);
  const playerId = dbResponse.lastID;
  response.send("Player Added to Team");
});

//get player by playerId API
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
    SELECT * FROM cricket_team WHERE player_id =${playerId};`;

  const player = await db.get(getPlayerQuery);
  response.send(player);
});

//Update player API
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;

  const UpdatePlayerQuery = `UPDATE cricket_team
    SET 
    player_name='${playerName}',
    jersey_number =${jerseyNumber},
    role='${role}'
    WHERE
    player_id = ${playerId};`;

  await db.run(UpdatePlayerQuery);
  response.send("Player Details Updated");
});

//DELETE PLAYER API

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;

  const deletePLayerQuery = `
  DELETE FROM
      cricket_team
    WHERE
      player_id = ${playerId};`;
  await db.run(deletePLayerQuery);
  response.send("Player Removed");
});

module.exports = app;
