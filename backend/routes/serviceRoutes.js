const express = require('express');
const router = express.Router();
const { createTransferService, getServices, updateTransferService, deleteTransferService, getOneService } = require('../controllers/serviceController');
const validateToken = require('../utils/validateToken');

/**
 * @openapi
 * /api/services:
 *   get:
 *     summary: Get list of services for the logged-in user's company
 *     tags:
 *       - Services
 *     responses:
 *       200:
 *         description: A list of services
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60f6bfe54f1a462d7c5e8de3"
 *                   company:
 *                     type: string
 *                     example: "60f6bfe54f1a462d7c5e8de2"
 *                   serviceType:
 *                     type: string
 *                     example: "office"
 *                   description:
 *                     type: string
 *                     example: "This is a description of the service."
 *                   basePrice:
 *                     type: number
 *                     example: 100.0
 *                   availability:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-10-25T13:45:00Z"
 *                   location:
 *                     type: string
 *                     example: "Downtown"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Error message"
 */
router.get('/', validateToken(['company', 'client']), getServices);
/**
 * @openapi
 * /api/services/create:
 *   post:
 *     summary: Create a new transfer service
 *     tags:
 *       - Services
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serviceType
 *               - description
 *               - basePrice
 *               - availability
 *               - location
 *             properties:
 *               serviceType:
 *                 type: string
 *                 enum: ['Office', 'Apartment', 'Small Transfer', 'Warehouse', 'History']
 *                 example: Office
 *               description:
 *                 type: string
 *                 example: "This is a description of the service."
 *               basePrice:
 *                 type: number
 *                 example: 100.0
 *               availability:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-10-25T13:45:00Z"
 *               location:
 *                 type: string
 *                 example: "Downtown"
 *     responses:
 *       200:
 *         description: Service created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: "Service created successfully!"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Error message"
 */
router.post('/create', validateToken(['company']), createTransferService);
/**
 * @openapi
 * /api/services/update/{id}:
 *   post:
 *     summary: Update an existing service
 *     tags:
 *       - Services
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the service to update
 *         example: "60f6bfe54f1a462d7c5e8de3"
 *     requestBody:
 *       description: Fields to update in the service
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serviceType:
 *                 type: string
 *                 example: "office"
 *               description:
 *                 type: string
 *                 example: "Updated service description."
 *               basePrice:
 *                 type: number
 *                 example: 150.0
 *               availability:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-11-01T10:00:00Z"
 *               location:
 *                 type: string
 *                 example: "Uptown"
 *     responses:
 *       200:
 *         description: Service updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Service updated successfully!
 *       404:
 *         description: Service not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Service not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Error message"
 */
router.put('/update/:id', validateToken(['company']), updateTransferService);

/**
 * @openapi
 * /api/services/delete/{id}:
 *   delete:
 *     summary: Delete an existing service
 *     tags:
 *       - Services
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the service to delete
 *         example: "60f6bfe54f1a462d7c5e8de3"
 *     responses:
 *       200:
 *         description: Service deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Service deleted successfully!
 *       404:
 *         description: Service not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Service not found!
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Error message
 */
router.delete('/delete/:id', validateToken(['company']), deleteTransferService);

router.get('/getOneService/:id', validateToken(['company', 'client']), getOneService);

module.exports = router;
