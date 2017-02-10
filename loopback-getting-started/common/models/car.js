'use strict';

module.exports = function (Car) {

    Car.revEngine = function (sound, cb) {
        cb(null, sound + ' ' + sound + ' ' + sound);
    };

    Car.findAll = function (cb) {
        Car.find(cb);
    }

    Car.remoteMethod(
        'revEngine',
        {
            accepts: [{ arg: 'sound', type: 'string' }],
            returns: { arg: 'engineSound', type: 'string' },
            http: { path: '/rev-engine', verb: 'post' }
        }
    );

    Car.remoteMethod('findAll', {
        http: { path: '/find-all', verb: 'get' },
        returns: {type: 'array', root: true}
    })

    Car.beforeRemote('revEngine', function (context, unused, next) {
        console.log('Putting in the car key, starting the engine.');
        next();
    });

    Car.afterRemote('revEngine', function (context, xxx, next) {
        console.log('Turning off the engine, removing the key.');
        next();
    })

    Car.afterInitialize = function () {
        console.log('> afterInitialize triggered');
    };

    Car.observe('before save', function methodName(ctx, next) {
        console.log('> before save triggered:', ctx.Model.modelName, ctx.instance ||
            ctx.data);
        next();
    });

    Car.observe('after save', function methodName(ctx, next) {
        console.log('> after save triggered:', ctx.Model.modelName, ctx.instance ||
            ctx.data);
        next();
    });

    Car.observe('before delete', function methodName(ctx, next) {
        console.log('> before delete triggered:', ctx.Model.modelName, ctx.instance ||
            ctx.data);
        next();
    });

    Car.observe('after delete', function methodName(ctx, next) {
        console.log('> after delete triggered:', ctx.Model.modelName, ctx.instance ||
            ctx.data);
        next();
    });

    Car.observe('before save', function (ctx, next) {
        if (ctx.instance) {
            console.log('About to save a car instance:', ctx.instance);
        } else {
            console.log('About to update cars that match the query %j:', ctx.where);
        }
        next();
    });
};
