module.exports.measureDistance = function measureDistance(startLatitude, startLongitude, endLatitude, endLongitude) {  // generally used geo measurement function
    const R = 6378.137; // Radius of earth in KM
    const dLat = endLatitude * Math.PI / 180 - startLongitude * Math.PI / 180;
    const dLon = endLongitude * Math.PI / 180 - startLongitude * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(startLongitude * Math.PI / 180) * Math.cos(endLatitude * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d * 1000; // meters
};