'use strict';

var Transaction = require('loopback-datasource-juggler').Transaction;


module.exports = function(Service) {

    Service.createWithTransaction = function (cb) {
        let options;
        let tx;

        let promise = Service.beginTransaction({
            isolationLevel: Transaction.READ_COMMITTED,
            timeout: 30000 // 30000ms = 30s
        });
        promise.then(returnedTx => {
            tx = returnedTx;
            options = {transaction: tx};

            return Service.create({
                name: 'abc', price: 10
            }, options);
        }).then( () => {
            return Service.create({
                name: 'xyz', price: 20
            }, options);
        }).then( () => {
            tx.commit(function () {
                cb(null, 'thanh cong');
            });
        }).catch( err => {
            tx.rollback(function () {
                cb(null, 'that bai');
            });
        })
    };

    Service.remoteMethod('createWithTransaction', {
        http: { path: '/test-transaction', verb: 'get' },
        returns: { arg: 'engineSound', type: 'string' },
    })
};
