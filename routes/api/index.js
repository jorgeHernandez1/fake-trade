const router = require('express').Router();
const userRoutes = require('./users');
const authRoutes = require('./auth');
const iexRoutes = require('./iex')
const transctionsRoutes = require('./transactions')

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/iex", iexRoutes);
router.use("/transactions", transctionsRoutes);

module.exports = router;
