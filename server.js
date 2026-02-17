const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/downloads", express.static("downloads"));

if (!fs.existsSync("downloads")) {
  fs.mkdirSync("downloads");
}

app.post("/download", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL required" });
    }

    const filePath = path.join(__dirname, "downloads", "nokiyapu-adare.mp4");

    const response = await axios({
      method: "GET",
      url: url,
      responseType: "stream"
    });

    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    writer.on("finish", () => {
      res.json({
        success: true,
        file: "/downloads/nokiyapu-adare.mp4"
      });
    });

    writer.on("error", () => {
      res.status(500).json({ error: "Download failed" });
    });

  } catch (error) {
    res.status(500).json({ error: "Invalid or protected URL" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
