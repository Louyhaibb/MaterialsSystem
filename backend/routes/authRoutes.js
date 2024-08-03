const express = require('express');
const router = express.Router();
const { register, login, adminlogin } = require('../controllers/authController');

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new user (client or company)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *               role:
 *                 type: string
 *                 enum: [client, company]
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               businessLicense:
 *                 type: string
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: User successfully registered with access token returned.
 *       400:
 *         description: Registration error
 */
router.post('/register', register);
// Endpoint: Login user
/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Log in an user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: User successfully logged in with access token and refresh token returned.
 *       400:
 *         description: Login error
 */
router.post('/login', login);
/**
 * @openapi
 * /api/auth/adminlogin:
 *   post:
 *     summary: Admin login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: yourpassword
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Successful login with tokens returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userData:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     lastLogin:
 *                       type: string
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 status:
 *                   type: string
 *                   example: success
 *       400:
 *         description: Login error
 *       500:
 *         description: Internal server error
 */
router.post('/admin-login', adminlogin);

module.exports = router;
