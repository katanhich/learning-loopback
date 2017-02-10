
module.exports = function (app) {

    app.get('/', (req, res) => {
        res.render('index', {
            loginFailed: false
        });
    });

    app.get('/projects', (req, res) => {
        res.render('projects');
    });

    app.post('/projects', (req, res) => {
        console.log(req.body);
        
        let email = req.body.email;
        let password = req.body.password;

        app.models.User.login({
            email: email,
            password: password
        }, 'user', (err, token) => {
            if (err) {
                return res.render('index', {
                    email: email,
                    password: password,
                    loginFailed: true
                });
            }

            token = token.toJSON();

            console.log(token);



            res.render('projects', {
                username: token.user.username,
                accessToken: token.id
            });
        })
    });

    app.get('/logout', (req, res) => {
        let AccessToken = app.models.AccessToken;
        let token = new AccessToken({id: req.query['access_token']});
        token.destroy();
        res.redirect('/'); 
    });
}