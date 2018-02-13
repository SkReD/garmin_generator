const args = require('yargs')
    .strict(true)
    .usage('Usage: garmin_generator [options]')
    .option('name', {
        type: 'string',
        name: 'Название трека',
        default: 'Track_' + new Date().toString()
    })
    .option('output-file', {
        type: 'number',
        describe: 'Куда сохранить результат',
        default: 'garmin_' + new Date().valueOf() + '.gpx'
    })
    .option('start-longitude', {
        type: 'number',
        describe: 'Начальная долгота',
        demandOption: true,
    })
    .option('end-longitude', {
        type: 'number',
        describe: 'Конечная долгота',
        demandOption: true,
    })
    .option('start-latitude', {
        type: 'number',
        describe: 'Начальная широта',
        demandOption: true,
    })
    .option('end-latitude', {
        type: 'number',
        describe: 'Конечная широта',
        demandOption: true,
    })
    .option('start-time', {
        type: 'string',
        describe: 'Начальное время',
        default: new Date().valueOf() / 1000
    })
    .option('end-time', {
        type: 'string',
        describe: 'Конечное время',
        default: new Date().valueOf() / 1000 + 1 * 3600
    })
    .option('general-height', {
        type: 'string',
        describe: 'Средняя высота',
        default: 260
    })
    .option('height-delta', {
        type: 'string',
        describe: 'Разброс высоты',
        default: 2
    })
    .option('steps-count', {
        type: 'number',
        describe: 'Количество шагов',
        default: 300
    })
    .option('distance-delta', {
        type: 'number',
        describe: 'Разброс отрезков',
        default: 0.1
    })
    .option('time-delta', {
        type: 'number',
        describe: 'Разброс времени',
        default: 0.1
    })
    .help('h')
    .alias('h', 'help')
    .parse(process.argv.slice(2));

const fs = require('fs-extra');
const template = fs.readFileSync('track_template.xml', 'utf-8');
const mustache = require('mustache');

const trackpts = [];
const latitudeStep = (args.endLatitude - args.startLatitude) / args.stepsCount;
const longitudeStep = (args.endLongitude - args.startLongitude) / args.stepsCount;
const timeStep = (args.startTime - args.endTime) / args.stepsCount;
const heightGenerator = () => (Math.random() > 0.5 ? 1 : -1) * Math.random() * args.heightDelta + args.generalHeight;
const measure = function(lat1, lon1, lat2, lon2) {  // generally used geo measurement function
    var R = 6378.137; // Radius of earth in KM
    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d * 1000; // meters
}

let lat = args.startLatitude;
let lon = args.startLongitude;
let time = args.startTime;
const sinAlpha = (i, min) => Math.abs(Math.sin(i * Math.PI * 2 / args.stepsCount)) + min;
const randAlpha = (delta) => ((0.5 + delta / 2) + (Math.random() * (1 - delta / 2)))
const distanceAlpha = i => sinAlpha(i, 0.1) * randAlpha(args.distanceDelta);
const timeAlpha = (i) => sinAlpha(i, 0.4) * randAlpha(args.timeDelta);
for (let i = 0; i < args.stepsCount; i++) {
    lat = lat + latitudeStep * distanceAlpha(i);
    lon = lon + longitudeStep * distanceAlpha(i);

    if (latitudeStep > 0) {
        if (lat > args.endLatitude) {
            lat = args.endLatitude;
        }
    } else {
        if (lat < args.endLatitude) {
            lat = args.endLatitude;
        }
    }

    if (longitudeStep > 0) {
        if (lon > args.endLongitude) {
            lon = args.endLongitude;
        }
    } else {
        if (lon < args.endLongitude) {
            lon = args.endLongitude;
        }
    }

    time = Math.min(args.endTime, time + timeStep * timeAlpha(i));

    trackpts.push({
        lat,
        lon,
        ele: heightGenerator(),
        time: new Date(time * 1000).toISOString()
    });

    if (lon === args.endLongitude && lat === args.endLatitude) {
        break;
    }
}

const distance = measure(args.startLatitude, args.startLongitude, args.endLatitude, args.endLongitude);

fs.outputFileSync(args.outputFile, mustache.render(template, {
    maxLat: Math.max(args.startLatitude, args.endLatitude),
    minLat: Math.min(args.startLatitude, args.endLatitude),
    maxLon: Math.max(args.startLongitude, args.endLongitude),
    minLon: Math.min(args.startLongitude, args.endLongitude),
    trackpts,
    name: args.name,
    distance
}), 'utf-8');