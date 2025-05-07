const express = require("express");
const cors = require("cors");
const fs = require("fs");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ✅ 새로 만든 JSON 데이터 불러오기
const restaurantData = JSON.parse(fs.readFileSync("./data/restaurants_with_menus.json", "utf-8"));

// ✅ Swagger 설정
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
 *     summary: 전체 식당 리스트 (메뉴 포함)
 *     responses:
 *       200:
 *         description: 식당 및 메뉴 리스트 배열 반환
 */
app.get("/restaurants", (req, res) => {
    res.json(restaurantData);
});

/**
 * @swagger
 * /restaurants/{name}/menu:
 *   get:
 *     summary: 특정 식당의 메뉴 가져오기
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: 식당 이름
 *     responses:
 *       200:
 *         description: 해당 식당의 메뉴 리스트 반환
 */
app.get("/restaurants/:name/menu", (req, res) => {
    const { name } = req.params;
    const restaurant = restaurantData.find(r => r.name === name);
    if (!restaurant) return res.status(404).send("식당을 찾을 수 없습니다.");
    res.json(restaurant.menus);
});

app.listen(PORT, () => {
    console.log(`✅ API Server running at http://localhost:${PORT}`);
});
