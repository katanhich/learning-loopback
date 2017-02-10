var async = require('async');

module.exports = function (app) {
    let mongodb = app.dataSources.mongodb;

    async.parallel({
        coffees: createCoffeeShops,
        reviewers: createReviewers
    }, function (err, results) {
        if (err) throw err;
        createReviews(results.reviewers, results.coffees, function(err, reviews) {
            if (err) throw err;
            console.log('created models');
        })
    })

    function createCoffeeShops(cb) {
        mongodb.automigrate('CoffeeShop', function (err) {
            if (err) throw err;

            app.models.CoffeeShop.create([{
                name: 'Bel Cafe',
                city: 'Vancouver',
            }, {
                name: 'Three Bees Coffee House',
                city: 'San Mateo',
            }, {
                name: 'Caffe Artigiano',
                city: 'Vancouver',
            }], cb);
        });
    }

    function createReviewers(cb) {
        mongodb.automigrate('Reviewer', function (err) {
            if (err) return cb(err);

            var Reviewer = app.models.Reviewer;
            Reviewer.create([{
                email: 'foo@bar.com',
                password: 'foobar'
            }, {
                email: 'john@doe.com',
                password: 'johndoe'
            }, {
                email: 'jane@doe.com',
                password: 'janedoe'
            }], cb);
        });
    }

    function createReviews(reviewers, coffeeShops, cb) {
        mongodb.automigrate('Review', function (err) {
            if (err) return cb(err);
            var Review = app.models.Review;
            var DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
            Review.create([{
                date: Date.now() - (DAY_IN_MILLISECONDS * 4),
                rating: 5,
                comments: 'A very good coffee shop.',
                publisherId: reviewers[0].id,
                coffeeShopId: coffeeShops[0].id,
            }, {
                date: Date.now() - (DAY_IN_MILLISECONDS * 3),
                rating: 5,
                comments: 'Quite pleasant.',
                publisherId: reviewers[1].id,
                coffeeShopId: coffeeShops[0].id,
            }, {
                date: Date.now() - (DAY_IN_MILLISECONDS * 2),
                rating: 4,
                comments: 'It was ok.',
                publisherId: reviewers[1].id,
                coffeeShopId: coffeeShops[1].id,
            }, {
                date: Date.now() - (DAY_IN_MILLISECONDS),
                rating: 4,
                comments: 'I go here everyday.',
                publisherId: reviewers[2].id,
                coffeeShopId: coffeeShops[2].id,
            }], cb);
        });
    }
};