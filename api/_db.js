const mongoose = require('mongoose');

let cached = global._mongo;
if (!cached) cached = global._mongo = { conn: null, promise: null };

async function connect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, { dbName: 'pokemern' })
      .then(m => m.connection);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = { connect };
