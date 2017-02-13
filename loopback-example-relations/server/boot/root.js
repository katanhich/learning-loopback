'use strict';

module.exports = function (server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  var Customer = server.models.Customer;

  router.get('/', (req, res, next) => {
    Customer.findOne({
      where: { name: 'Customer A' }
    }, (err, customer) => {
      if (err) return next(err);
      res.render('index', { customer: customer });
    });
  });

  router.get('/email', function (req, res, next) {
    Customer.findOne({
      where: {
        name: 'Larry Smith'
		    }
    }, function (err, customer) {
      if (err) return next(err);
      res.render('email', { customer: customer });
    });
  });
  
  router.get('/address', function (req, res, next) {
    Customer.findOne({
      where: {
        name: 'John Smith'
		    }
    }, function (err, customer) {
      if (err) return next(err);
      res.render('address', { customer: customer });
    });
  });

  router.get('/account', function (req, res, next) {
    Customer.findOne({
      where: {
        name: 'Mary Smith'
		    }
    }, function (err, customer) {
      if (err) return next(err);
      res.render('account', { customer: customer });
    });
  });

  server.use(router);
};
