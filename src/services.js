const { default: axios } = require("axios");
const db = require("./config/db");
const logger = require("./lib/logger");

// This function will insert manually data to database
const insertData = async (req, res) => {
  const { positive, hospitalized, recovered, pass_away } = req.body;

  if (!positive || !hospitalized || !recovered || !pass_away) {
    res.status(400).send("Data yang dikirim tidak lengkap!");
  }

  const data = await db.query(
    "INSERT INTO covid_data (total_positive, total_hospitalize, total_recovered, total_pass_away) VALUES ($1, $2, $3, $4)",
    [positive, hospitalized, recovered, pass_away]
  );

  if (data.rowCount == 0) {
    res.status(400).send("Error! Additional covid data not inserted!");
  }

  res.status(201).send("Additional covid data inserted!");
};

// This function will fetch data from database order descending and limit to 1 data;
const fetchUpdate = async (req, res) => {
  try {
    const { rows: additional } = await db.query(
      "SELECT * FROM covid_data ORDER BY id DESC LIMIT 1"
    );

    res.status(200).json({
      additional,
    });
  } catch (error) {
    res.status(500).send("Error from server!");
  }
};

// This function will check the data change or not!
const checkUpdates = async (tanggal) => {
  try {
    const results = await db.query(
      "SELECT count(id) as count FROM covid_data WHERE date IN ($1)",
      [tanggal]
    );

    const [{ count }] = results.rows;
    return count > 0;
  } catch (error) {
    return error;
  }
};

// This function will get data from Public API and execute insert if there are changes from Public API.
const updateData = async (now) => {
  try {
    const { data } = await axios.get(
      "https://data.covid19.go.id/public/api/update.json"
    );

    if (!data) {
      throw Error("Failed to fetch data!");
    }

    const {
      update: {
        penambahan: {
          jumlah_positif,
          jumlah_meninggal,
          jumlah_dirawat,
          jumlah_sembuh,
          created,
          tanggal,
        },
      },
    } = data;

    const isUpdated = await checkUpdates(tanggal);

    if (!isUpdated) {
      const update_data = await db.query(
        "INSERT INTO covid_data (total_positive, total_hospitalize, total_recovered, total_pass_away, created_date, date) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          jumlah_positif,
          jumlah_dirawat,
          jumlah_sembuh,
          jumlah_meninggal,
          created,
          tanggal,
        ]
      );

      if (update_data.rowCount < 1) {
        throw Error("Failed to fetch data!");
      }
      logger.info(`Successfully updated!`);
    } else {
      logger.info(`No changes is made. Data is the lastest update`);
    }
  } catch (error) {
    logger.error(error);
    return error;
  }
};

module.exports = {
  checkUpdates,
  updateData,
  fetchUpdate,
  insertData,
};
