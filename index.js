const express = require("express");
const cors = require("cors");
const fs = require("fs");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const menuData = JSON.parse(fs.readFileSync("./data/restaurant_menu_data.json", "utf-8"));

// ✅ Swagger 설정
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Restaurant API",
            version: "1.0.0",
            description: "API for accessing restaurant menus"
        },
        servers: [{ url: `http://localhost:${PORT}` }]
    },
    apis: ["./index.js"]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /restaurants:
 *   get:
 *     summary: 전체 식당 리스트 가져오기
 *     responses:
 *       200:
 *         description: 식당 목록 배열 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 */
app.get("/restaurants", (req, res) => {
    const restaurants = [...new Set(menuData.map(item => item.restaurant_name))];
    res.json(restaurants.map((name, index) => ({ id: index + 1, name })));
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
 *         description: 메뉴 목록 배열 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   restaurant_name:
 *                     type: string
 *                   menu_name:
 *                     type: string
 *                   price:
 *                     type: number
 *                   image:
 *                     type: string
 *                   rating:
 *                     type: number
 */
app.get("/restaurants/:name/menu", (req, res) => {
    const { name } = req.params;
    const filtered = menuData.filter(item => item.restaurant_name === name);
    res.json(filtered);
});

app.listen(PORT, () => {
    console.log(`✅ API Server running at http://localhost:${PORT}`);
});
