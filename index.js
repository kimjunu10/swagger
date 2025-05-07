const express = require("express");
const cors = require("cors");
const fs = require("fs");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// JSON 데이터 불러오기
const restaurantData = JSON.parse(fs.readFileSync("./data/restaurants_with_menus.json", "utf-8"));

// Swagger 설정
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Restaurant API",
            version: "1.0.0",
            description: "API for accessing restaurant menus"
        },
        servers: [{ url: "https://swagger-dr9i.onrender.com" }]
    },
    apis: ["./index.js"]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /restaurants:
 *   get:
 *     summary: 전체 식당 리스트 또는 특정 ID 식당 반환
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: false
 *         description: 식당 ID
 *     responses:
 *       200:
 *         description: 식당 및 메뉴 리스트 배열 반환
 */
app.get("/restaurants", (req, res) => {
    const { id } = req.query;

    if (id) {
        const restaurant = restaurantData.find(r => r.id === parseInt(id));
        if (!restaurant) {
            return res.status(404).json({ message: "해당 ID의 식당을 찾을 수 없습니다." });
        }
        return res.json([restaurant]); // FlutterFlow 호환을 위해 배열로 반환
    }

    res.json(restaurantData);
});

/**
 * @swagger
 * /restaurants/{id}/menu:
 *   get:
 *     summary: 특정 ID의 식당 메뉴 가져오기
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 식당 ID
 *     responses:
 *       200:
 *         description: 해당 식당의 메뉴 리스트 반환
 */
app.get("/restaurants/:id/menu", (req, res) => {
    const { id } = req.params;
    const restaurant = restaurantData.find(r => r.id === parseInt(id));
    if (!restaurant) {
        return res.status(404).json({ message: "해당 ID의 식당을 찾을 수 없습니다." });
    }
    res.json(restaurant.menus);
});

app.listen(PORT, () => {
    console.log(`✅ API Server running at http://localhost:${PORT}`);
});
