const fs = require("fs-extra");
const path = require("path");
const mustache = require("mustache");

const { measureDistance } = require("./distanceMeasure.js");
const { getTrackPoints } = require("./trackpoints.js");
const { getArguments } = require("./args.js");

const args = getArguments();
const trackPoints = getTrackPoints(
  args.stepsCount,
  args.startLatitude,
  args.startLongitude,
  args.endLatitude,
  args.endLongitude,
  args.startTime,
  args.endTime,
  args.distanceDelta,
  args.timeDelta,
  args.heightDelta,
  args.height
);
const distance = measureDistance(
  args.startLatitude,
  args.startLongitude,
  args.endLatitude,
  args.endLongitude
);

const template = fs.readFileSync(
  path.join(__dirname, "track_template.xml"),
  "utf-8"
);
fs.outputFileSync(
  args.outputFile,
  mustache.render(template, {
    maxLat: Math.max(args.startLatitude, args.endLatitude),
    minLat: Math.min(args.startLatitude, args.endLatitude),
    maxLon: Math.max(args.startLongitude, args.endLongitude),
    minLon: Math.min(args.startLongitude, args.endLongitude),
    trackPoints,
    name: args.name,
    distance
  }),
  "utf-8"
);
