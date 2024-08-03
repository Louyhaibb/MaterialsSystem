const express = require('express');
const validateToken = require('../utils/validateToken');
const { getPersonalMe, logout, getUsers, uploadAvatarFile, createUser, getOneUser, updateUser, deleteUser } = require('../controllers/usersController');
const router = express.Router();
const multer = require("multer");

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `public/img/profiles`);
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        const filename = `profile-${Date.now()}.${ext}`;
        cb(null, filename);
    }
});

const uploadProfile = multer({
    storage: multerStorage,
    limits: { fileSize: 1024 * 1024 * 5, files: 1 },
});

router.get('/', validateToken(['admin', 'company', 'client']), getUsers);
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

/**
 * @openapi
 * /api/users/upload/avatarFile:
 *   put:
 *     summary: Upload and update user's avatar.
 *     description: Allows users to upload a new avatar image. The server stores the image and updates user's profile with the new avatar URL.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatarFile:
 *                 type: string
 *                 format: binary
 *                 description: The avatar image file to upload.
 *     responses:
 *       200:
 *         description: Avatar updated successfully.
 *       400:
 *         description: Bad request, if the file is not provided or invalid.
 *       401:
 *         description: Unauthorized access, invalid or missing token.
 *       500:
 *         description: An unexpected error occurred.
 */
router.put('/upload/avatarFile', uploadProfile.single('avatarFile'), validateToken(['admin']), uploadAvatarFile);

/**
 * @openapi
 * /api/users/upload/avatarFile:
 *   put:
 *     summary: Upload and update user's avatar.
 *     description: Allows users to upload a new avatar image. The server stores the image and updates user's profile with the new avatar URL.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatarFile:
 *                 type: string
 *                 format: binary
 *                 description: The avatar image file to upload.
 *     responses:
 *       200:
 *         description: Avatar updated successfully.
 *       400:
 *         description: Bad request, if the file is not provided or invalid.
 *       401:
 *         description: Unauthorized access, invalid or missing token.
 *       500:
 *         description: An unexpected error occurred.
 */
router.put('/upload/profile/avatarFile', uploadProfile.single('avatarFile'), validateToken(['admin', 'company', 'client']), uploadAvatarFile);

router.post('/create', validateToken(['admin']), createUser);
router.put('/update/:id', validateToken(['admin']), updateUser);
router.get('/getOneUser/:id', validateToken(['admin']), getOneUser);
router.delete('/delete/:id', validateToken(['admin']), deleteUser);

module.exports = router;
