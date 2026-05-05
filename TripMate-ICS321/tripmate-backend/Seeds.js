import mongoose from "mongoose";
import dotenv from "dotenv";
import Place from "./models/Place.js";
import City from "./models/City.js";

dotenv.config();

const cities = ["AlHassa", "Jeddah", "Abha", "AlUla", "Riyadh"];

const places = [
    { city: "AlHassa", name: "Jabal Al-Qara", description: "Ancient limestone mountain with caves and tunnels", category: "nature", rating: 4.8, image: "Jabal-Alqara.jpg" },
    { city: "AlHassa", name: "Flavors restaurant", description: "A popular dining spot in Al Hassa serving a wide variety of delicious local and international dishes.", category: "food", rating: 4.6, image: "flavors-restaurant.jpg" },
    { city: "AlHassa", name: "Qaisariah Souq", description: "One of the oldest historic markets in Saudi Arabia, famous for its traditional architecture and handmade goods.", category: "landmark", rating: 4.8, image: "Qaisariah.jpg" },
    { city: "AlHassa", name: "Uqair Beach", description: "A beautiful and quiet coastline known for its clear blue waters and the historic port nearby.", category: "nature", rating: 4.3, image: "Uqair.jpg" },
    { city: "Jeddah", name: "Red Sea Mall", description: "One of the biggest shopping centers in Jeddah with international brands", category: "shopping", rating: 4.9, image: "RedSea.jpg" },
    { city: "Jeddah", name: "Albalad", description: "The historic center of Jeddah, famous for its ancient coral-stone houses and traditional markets.", category: "landmark", rating: 4.8, image: "Albalad.jpg" },
    { city: "Jeddah", name: "Jeddah Corniche", description: "A beautiful coastal resort area featuring a long walkway, parks, and stunning views of the Red Sea.", category: "nature", rating: 4.6, image: "Jeddah-Corniche.jpg" },
    { city: "Jeddah", name: "Twenty four restaurant", description: "A modern dining destination offering a unique menu with a focus on fresh, local ingredients.", category: "food", rating: 4.5, image: "24.jpg" },
    { city: "Abha", name: "Art Street", description: "A vibrant walkway lined with purple Jacaranda trees, colorful art installations, and cozy cafes.", category: "nature", rating: 4.4, image: "Art-Street.webp" },
    { city: "Abha", name: "Rijal Alma'a", description: "A famous heritage village known for its unique stone architecture and deep cultural history.", category: "nature", rating: 4.9, image: "RijalAlmaa.jpg" },
    { city: "AlUla", name: "Elephant Rock", description: "A massive, natural sandstone formation that resembles an elephant rising from the desert sands.", category: "nature", rating: 4.9, image: "ElephantRock.jpg" },
    { city: "AlUla", name: "Archi", description: "A stunning outdoor cafe nestled against AlUla's ancient mountains, offering specialty coffee in a serene, mud-brick setting.", category: "food", rating: 4.5, image: "archi.webp" },
    { city: "AlUla", name: "Marayeh", description: "The world's largest mirrored building, reflecting the breathtaking beauty of the surrounding desert canyon.", category: "landmark", rating: 4.9, image: "maraya.jpg" },
    { city: "AlUla", name: "Harrat Overview", description: "An incredible lookout over the oasis, offering a bird's-eye view of the city and the black volcanic rock fields.", category: "nature", rating: 4.5, image: "harrat.jpg" },
    { city: "AlUla", name: "SomeWhere", description: "A popular restaurant known for its unique Mediterranean-inspired dishes and beautiful outdoor seating.", category: "food", rating: 4.6, image: "somewhereResturant.jpg" },
    { city: "AlUla", name: "Marayeh social", description: "Located on the rooftop of the Maraya building, offering a menu created by a Michelin-starred chef.", category: "food", rating: 4.8, image: "MarayaSocial.webp" },
    { city: "Riyadh", name: "Al Maigliah", description: "A major traditional wholesale hub in downtown Riyadh, famous for authentic thobes, perfumes, and textiles.", category: "shopping", rating: 4.4, image: "almaigliaah.webp" },
    { city: "Riyadh", name: "North Yard", description: "A chic destination in Al Malqa blending modern design with upscale cafes and lifestyle boutiques.", category: "shopping", rating: 4.5, image: "northyard.webp" },
    { city: "Riyadh", name: "Chotto Matte", description: "A vibrant Nikkei restaurant in KAFD combining the bold flavors of Peru with Japanese precision.", category: "food", rating: 4.7, image: "Chotto.jpg" },
    { city: "Riyadh", name: "Tokyo", description: "One of the city's first Japanese restaurants, recently revamped with stunning modern interiors and fusion cuisine.", category: "food", rating: 4.6, image: "tokyoRes.jpg" },
    { city: "Riyadh", name: "Les Deux Magots", description: "The Riyadh branch of the legendary Parisian cafe, offering a historic literary atmosphere and French classics.", category: "food", rating: 4.5, image: "LesDeuxMagots.jpg" },
    { city: "Riyadh", name: "Em Sherif", description: "A luxurious Lebanese fine-dining experience known for its spectacular menu and elegant setting.", category: "food", rating: 4.8, image: "emsherif.jpg" },
    { city: "Riyadh", name: "Brunch & Cake", description: "Where art meets flavor; famous for its visually stunning, organic dishes and iconic interior design.", category: "food", rating: 4.7, image: "brunchcake.webp" },
    { city: "Riyadh", name: "A.O.K Kitchen", description: "Located in KAFD, this space focuses on conscious dining with a refined Mediterranean-inspired menu.", category: "food", rating: 4.6, image: "AOK.jpg" },
    { city: "Riyadh", name: "Al Faisaliah Mall", description: "An iconic shopping destination housed within one of Saudi Arabia's most famous skyscrapers.", category: "shopping", rating: 4.5, image: "AlfaisaliahMall.jpg" },
    { city: "Riyadh", name: "Boulevard World", description: "A massive entertainment zone featuring global cultures, boat rides, and international attractions.", category: "entertainment", rating: 4.9, image: "Boulevardworld.webp" },
    { city: "Riyadh", name: "Six Flags", description: "A world-class theme park featuring record-breaking roller coasters and high-energy entertainment.", category: "entertainment", rating: 4.8, image: "sixflags.webp" },
    { city: "Riyadh", name: "Aquarabia", description: "The region's largest water theme park, offering thrilling slides and aquatic adventures.", category: "entertainment", rating: 4.7, image: "Aquarabia.webp" },
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected ✅");

        await Place.deleteMany();
        await Place.insertMany(places);

        await City.deleteMany();
        await City.insertMany(cities.map(name => ({ name })));

        console.log(`${places.length} places inserted ✅`);
        console.log(`${cities.length} cities inserted ✅`);

        process.exit();
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

seed();