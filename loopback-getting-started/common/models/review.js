'use strict';

module.exports = function(Review) {

    Review.beforeRemote('create', function(context, user, next) {
        console.log(context.req.accessToken.userId);
        console.log(user);
        context.args.data.date = Date.now();
        context.args.data.publisherId = context.req.accessToken.userId;
        next();
    });
};
