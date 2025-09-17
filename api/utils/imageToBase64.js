const fs = require("fs");
const path = require("path");
const axios = require("axios");

const imageToBase64 = async (imagePath) => {
  // Si c'est une URL externe
  if (imagePath.startsWith("http")) {
    const response = await axios.get(imagePath, { responseType: "arraybuffer" });
    const base64 = Buffer.from(response.data, "binary").toString("base64");
    const mimeType = response.headers["content-type"] || "image/png";
    return `data:${mimeType};base64,${base64}`;
  }

  // Si c'est une image locale
  const filePath = path.resolve(imagePath);
  const fileData = fs.readFileSync(filePath);
  const ext = path.extname(filePath).substring(1); // ex: jpg, png
  return `data:image/${ext};base64,${fileData.toString("base64")}`;
}

module.exports = imageToBase64;