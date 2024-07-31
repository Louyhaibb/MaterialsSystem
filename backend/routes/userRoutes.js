const express = require('express');
const validateToken = require('../utils/validateToken');
const { getPersonalMe, logout } = require('../controllers/usersController');
const router = express.Router();

/**
 * @openapi
 * /api/users/personal/me:
 *   get:
 *     summary: Get the personal information of the logged-in user
 *     description: Retrieve personal information for the current authenticated user.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Successfully retrieved user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     firstname:
 *                       type: string
 *                     lastname:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       500:
 *         description: Internal server error
 */
router.get('/personal/me', validateToken(['admin', 'company', 'client']), getPersonalMe);

/**
 * @openapi
 * /api/users/logout:
 *   get:
 *     summary: Log out the current user
 *     description: Clear cookies to log the user out of the application.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'successfully logout'
 *       500:
 *         description: Internal server error
 */
router.get('/logout', validateToken(['admin', 'company', 'client']), logout);

module.exports = router;
