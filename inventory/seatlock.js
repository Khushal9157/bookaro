const redis = require("../common/redis");

async function lockSeat(eventId, seatId, userId) {
    const key = `seat:${eventId}:${seatId}`;
    const result = await redis.set(key, userId, "NX", "PX", 600000);
    return result === "OK";
}

async function unlockSeat(eventId, seatId) {
    await redis.del(`seat:${eventId}:${seatId}`);
}

module.exports = { lockSeat, unlockSeat };
