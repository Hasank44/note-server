const userRoute = require('./userRoute');
const noteRoute = require('./noteRoute');

const routes = [
    {
        path: '/api/users',
        handler: userRoute
    },
    {
        path: '/api/notes',
        handler: noteRoute
    }
];

module.exports = app => {
    routes.forEach(route => {
        if (route.path === '/') {
            app.get(route.path, route.handler);
        } else {
            app.use(route.path, route.handler);
        };
    });
};