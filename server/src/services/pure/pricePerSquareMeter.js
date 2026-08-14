function pricePerSquareMeter(price, area) {
    if (!area || area <= 0) return null;
    return Math.round((price / area) * 100) / 100;
}

module.exports = pricePerSquareMeter;