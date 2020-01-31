const bcrypt = require('bcryptjs');

module.exports = {
    register: async(req, res) => {
        const {isAdmin, username, password} = req.body;
        const db = req.app.get('db');

        const fetchingUser = await db.get_user([username]);
        const existingUser = fetchingUser[0]
        if(existingUser) {
            return res.status(400).send('Username Exists')
        }
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
       
        const registeredUser = await db.register_user([isAdmin, username, hash]);
        const user = registeredUser[0];
        req.session.user = {isAdmin: user.isAdmin, username: user.username, id: user.id}
        return res.status(201).send(req.session.user);
    },

    login: async(req, res) => {
        const {username, password} = req.body;
        const db = req.app.get('db');

        const foundUser = await db.get_user([username]);
        const user = foundUser[0];
        if(!user) {
            res.status(400).send('User not found');
        }
        const isAuthenticated = bcrypt.compareSync(password, user.hash)
        if(!isAuthenticated) {
            res.status(401).send('Invalid Password');
        }
        req.session.user = {isAdmin: user.is_admin, id: user.id, username: user.username};
        return res.send(req.session.user);
    },

    logout: (req, res) => {
        req.session.destroy();
        return res.sendStatus(200);
    }
}