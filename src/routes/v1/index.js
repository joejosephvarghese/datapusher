const express = require("express");
const authRoute = require("./auth.route");
const accountRoute = require("./account.route");
const destinationRoute = require("./destination.route");
const accountMember = require("./accountMember.route");
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
   {
    path: "/destination",
    route: destinationRoute
  },
     {
    path: "/accountMember",
    route: accountMember
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
