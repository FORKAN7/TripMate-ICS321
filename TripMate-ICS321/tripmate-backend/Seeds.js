import db from "./config/db.js";

const cities = ["AlHassa", "Jeddah", "Abha", "AlUla", "Riyadh"];

const places = [
  { city: "AlHassa", name: "Jabal Al-Qara", description: "Ancient limestone mountain with caves and tunnels", category: "nature", rating: 4.8, image: "Jabal-Alqara.jpg" },
  { city: "AlHassa", name: "Flavors restaurant", description: "A popular dining spot in Al Hassa", category: "food", rating: 4.6, image: "flavors-restaurant.jpg" },
  { city: "AlHassa", name: "Qaisariah Souq", description: "Historic market", category: "landmark", rating: 4.8, image: "Qaisariah.jpg" },
  { city: "Jeddah", name: "Red Sea Mall", description: "Shopping center", category: "shopping", rating: 4.9, image: "RedSea.jpg" },
  { city: "Riyadh", name: "Boulevard World", description: "Entertainment zone", category: "entertainment", rating: 4.9, image: "Boulevardworld.webp" }
];

const seed = async () => {
  try {
    console.log("Seeding started...");

    await db.query("DELETE FROM PLACE");
    await db.query("DELETE FROM CITY");

    for (let city of cities) {
      await db.query(
        "INSERT INTO CITY (name, region) VALUES (?, ?)",
        [city, "Saudi Arabia"]
      );
    }

    console.log("Cities inserted ✅");

    for (let place of places) {
      const [cityRow] = await db.query(
        "SELECT city_id FROM CITY WHERE name = ?",
        [place.city]
      );

      if (cityRow.length === 0) continue;

      await db.query(
        `INSERT INTO PLACE 
        (name, category, description, city_id, image_url)
        VALUES (?, ?, ?, ?, ?)`,
        [
          place.name,
          place.category,
          place.description,
          cityRow[0].city_id,
          place.image
        ]
      );
    }

    console.log("Places inserted ✅");

    process.exit();

  } catch (error) {
    console.error("ERROR:", error.message);
    process.exit(1);
  }
};

seed();