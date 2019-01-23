const { GeoPoint } = require("./geopoint.js");

module.exports.getArguments = function getArguments() {
  const args = require("yargs")
    .strict(true)
    .usage("Usage: garmin_generator [options]")
    .option("name", {
      type: "string",
      name: "Название трека",
      default: "Track_" + new Date().toString()
    })
    .option("output-file", {
      type: "string",
      describe: "Куда сохранить результат",
      default: "garmin_" + new Date().valueOf() + ".gpx"
    })
    .option("start-longitude", {
      type: "string",
      describe:
        "Начальная долгота (можно задать в градусах или в относительных величинах)",
      demandOption: true
    })
    .option("end-longitude", {
      type: "string",
      describe:
        "Конечная долгота (можно задать в градусах или в относительных величинах)",
      demandOption: true
    })
    .option("start-latitude", {
      type: "string",
      describe:
        "Начальная широта (можно задать в градусах или в относительных величинах)",
      demandOption: true
    })
    .option("end-latitude", {
      type: "string",
      describe:
        "Конечная широта (можно задать в градусах или в относительных величинах)",
      demandOption: true
    })
    .option("start-time", {
      type: "number",
      describe: "Начальное время",
      default: new Date().valueOf() / 1000
    })
    .option("end-time", {
      type: "number",
      describe: "Конечное время",
      default: new Date().valueOf() / 1000 + 1 * 3600
    })
    .option("height", {
      type: "string",
      describe: "4 значения выосты для расчета по функции кривой безье",
      default: "260,260,150,180"
    })
    .option("height-delta", {
      type: "number",
      describe: "Разброс высоты",
      default: 0.01
    })
    .option("steps-count", {
      type: "number",
      describe: "Количество шагов",
      default: 300
    })
    .option("distance-delta", {
      type: "number",
      describe: "Разброс отрезков",
      default: 0.1
    })
    .option("time-delta", {
      type: "number",
      describe: "Разброс времени",
      default: 0.03
    })
    .help("h")
    .alias("h", "help")
    .parse(process.argv.slice(2));

  if (isNaN(Number(args.startLongitude)) && isNaN(Number(args.startLatitude))) {
    const startPoint = new GeoPoint(args.startLongitude, args.startLatitude);
    args.startLongitude = Number(startPoint.getLonDec());
    args.startLatitude = Number(startPoint.getLatDec());
  }

  if (isNaN(Number(args.endLatitude)) && isNaN(Number(args.endLongitude))) {
    const startPoint = new GeoPoint(args.endLongitude, args.endLatitude);
    args.endLongitude = Number(startPoint.getLonDec());
    args.endLatitude = Number(startPoint.getLatDec());
  }

  args.startLongitude = Number(args.startLongitude);
  args.startLatitude = Number(args.startLatitude);
  args.endLatitude = Number(args.endLatitude);
  args.endLongitude = Number(args.endLongitude);

  args.height = args.height.split(",").map(Number);

  return args;
};
