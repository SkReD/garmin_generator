const {bezieDistribute, sinRandDistribution} = require('./distributionFunctions.js');

module.exports.getTrackPoints = function getTrackPoints(stepsCount, startLatitude, startLongitude, endLatitude, endLongitude,
                                         startTime, endTime, distanceDelta, timeDelta, heightDelta, heightPoints) {
    const trackpts = [];
    const timeStep = (endTime - startTime) / stepsCount;
    const latitudeStep = (endLatitude - startLatitude) / stepsCount;
    const longitudeStep = (endLongitude - startLongitude) / stepsCount;
    let lat = startLatitude;
    let lon = startLongitude;
    let time = startTime;
    let coordsDistributionFunc = (i, stepsCount) => sinRandDistribution(i, stepsCount, 0.1, distanceDelta);
    let timeDistributionFunc = (i, stepsCount) => sinRandDistribution(i, stepsCount, 0.4, timeDelta);
    let heightDistributionFunc = (i, stepsCount) => bezieDistribute(i, stepsCount, heightDelta, heightPoints);

    for (let i = 0; i < stepsCount; i++) {
        lat = lat + latitudeStep * coordsDistributionFunc(i, stepsCount);
        lon = lon + longitudeStep * coordsDistributionFunc(i, stepsCount);

        if (latitudeStep > 0) {
            if (lat > endLatitude) {
                lat = endLatitude;
            }
        } else {
            if (lat < endLatitude) {
                lat = endLatitude;
            }
        }

        if (longitudeStep > 0) {
            if (lon > endLongitude) {
                lon = endLongitude;
            }
        } else {
            if (lon < endLongitude) {
                lon = endLongitude;
            }
        }

        time = Math.min(endTime, time + timeStep * timeDistributionFunc(i, stepsCount));

        trackpts.push({
            lat,
            lon
        });

        if (lon === endLongitude && lat === endLatitude) {
            break;
        }

        //обязательно дойдем до конечной заданной точки
        if ((lon !== endLongitude || lat !== endLatitude) && i === stepsCount - 1) {
            stepsCount++;
        }
    }

    //распределим высоты и время только когда точно рассчитаем количество шагов
    trackpts.forEach((trackPoint, i) => {
        time = Math.min(endTime, time + timeStep * timeDistributionFunc(i, stepsCount));
        trackPoint.ele = heightDistributionFunc(i, stepsCount);
        trackPoint.time = new Date(time * 1000).toISOString();
    });

    return trackpts;
};