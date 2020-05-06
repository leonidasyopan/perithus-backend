const Router = require('express');
const { check } = require('express-validator');
const taxController = require('../controllers/taxController');

const taxRoutes = Router();

taxRoutes.post(
  '/imposto-por-periodo',
  [
    check('ini_date', 'Data inicial inválida. Tente novamente.').isISO8601(),
    check('end_date', 'Data final inválida. Tente novamente.').isISO8601(),
  ],
  taxController.handleOrdersTaxByPeriod,
);

module.exports = {
  taxRoutes,
};
