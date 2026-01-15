const redis = require("../common/redis");

async function lockSeat(eventId, seatId, userId) {
    const key = `seat:${eventId}:${seatId}`;
    const result = await redis.set(key, userId, "NX", "EX", 600);
    return result === "OK";
}

async function unlockSeat(eventId, seatId, userId) {
    const key = `seat:${eventId}:${seatId}`;
    const owner = await redis.get(key);

    if (!owner) {
        return;
    }

    if (owner !== String(userId)) {
        throw new Error("Not seat owner");
    }

    await redis.del(key);
}


module.exports = { lockSeat, unlockSeat };
