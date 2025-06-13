const express = require("express");
const authRoute = require("./auth.route");
const accountRoute = require("./account.route");
const router = express.Router();

const defaultRoutes = [
   {
    path: "/auth",
    route: authRoute
  },
    {
    path: "/account",
    route: accountRoute
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
