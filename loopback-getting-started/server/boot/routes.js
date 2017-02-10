
module.exports = function (app) {

    app.get('/hello', (req, res) => {
        res.json({phuoc: 'hello'})
    });

    app.get('/find-all-cars', (req, res) => {
        app.models.car.find()
            .then(cars => res.json(cars));
    })
}