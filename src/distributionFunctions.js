
const bezieDistribute = (i, stepsCount, heightDelta, [hp1, hp2, hp3, hp4]) => {
    const t = i / stepsCount;
    return ((Math.random() > 0.5 ? 1 : -1) * Math.random() * heightDelta) +
        (Math.pow((1 - t), 3) * Number(hp1) + 3 * Math.pow((1 - t), 2) * t * Number(hp2) + 3 * (1 - t) * Math.pow(t, 2) * Number(hp3) +
            Math.pow(t, 3) * Number(hp4));
};

const sinAlpha = (i, stepsCount, min) => Math.abs(Math.sin(i * Math.PI * 2 / stepsCount)) + min;
const randAlpha = (delta) => ((0.5 + delta / 2) + (Math.random() * (1 - delta / 2)));
const sinRandDistribution = (i, stepsCount, min, delta) => sinAlpha(i, stepsCount, min) * randAlpha(delta); //0.1 и 0.4, distanceDelta, timeDelta

module.exports = {bezieDistribute, sinRandDistribution};
