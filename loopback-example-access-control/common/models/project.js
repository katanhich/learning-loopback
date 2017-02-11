'use strict';

module.exports = function (Project) {

    Project.listProjects = function (cb) {
        Project.find({
            fields: {
                balance: false
            }
        }, cb);
    };

    Project.remoteMethod('listProjects', {
        returns: { arg: 'projects', type: 'array' },
        http: { path: '/list-projects', verb: 'get' }
    });

    Project.donate = function (id, amount, cb) {
        Project.findById(id)
            .then(project => {
                project.balance += amount;
                return project.save();
            })
            .then(project => cb(null, true))
            .catch(err => cb(err));
    };

    Project.remoteMethod('donate', {
        accepts: [
            { arg: 'id', type: 'string' },
            { arg: 'amount', type: 'number' },
        ],
        returns: { arg: 'success', type: 'boolean' },
        http: { path: '/donate', verb: 'post' }
    });

    Project.withdraw = function (id, number, cb) {
        Project.findById(id)
            .then(project => {
                project.balance = project.balance - number;
                return project.save();
            })
            .then(project => cb(null, true))
            .catch(err => cb(err));
    };

    Project.remoteMethod('withdraw', {
        accepts: [
            { arg: 'id', type: 'string' },
            { arg: 'amount', type: 'number' },
        ],
        returns: { arg: 'success', type: 'boolean' },
        http: { path: '/withdraw', verb: 'post' }
    });
};
