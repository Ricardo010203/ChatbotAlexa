const AppController = {};

AppController.index = (req, res) => {
    res.render('index');
}

AppController.comments = (req, res) => {
    res.render('comment');
}

AppController.login = (req, res) => {
    res.render('login');
}

module.exports = AppController;