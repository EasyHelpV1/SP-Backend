/*jshint esversion: 8*/
const notFound = (req, res) => res.status(404).send("Route does not exist");

module.exports = notFound;
