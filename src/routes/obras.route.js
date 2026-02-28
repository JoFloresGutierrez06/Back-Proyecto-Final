const express = require("express");
const controller = require("../controllers/obras.controller");
const { asyncHandler } = require("../utils/asyncHandler");
const { authMiddleware, requireRole } = require('../auth') 

const router = express.Router()

router.get("/", asyncHandler(controller.getAllPublish))     // Mostrar obras publicadas 
router.get("/all", asyncHandler(controller.getAll))         // todo esto se almacena en la variable router
router.get("/search", asyncHandler(controller.search))      // /search?titulo=caperucita+roja&autor=laura+quezada  
router.get("/:id", asyncHandler(controller.getById))        // Buscar obra por id
router.post("/", authMiddleware, requireRole('admin', 'autor'), asyncHandler(controller.create))
// router.post("/", asyncHandler(controller.create))
router.put("/:id", asyncHandler(controller.update))
router.delete("/:id", asyncHandler(controller.remove))  

module.exports = {router}; // se manda a llamar en el index