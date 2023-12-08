const mongoose = require('mongoose');
const { SHA256 } = require('crypto-js');

// Define schema for a block in the blockchain
const BlockSchema = new mongoose.Schema({
  index: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  data: {
    type: String,
    required: true,
  },
  previousHash: {
    type: String,
  },
  hash: {
    type: String,
    required: true,
  },
});

// Pre-save middleware to calculate and update the hash when data changes
BlockSchema.pre('save', function (next) {
  const hashString = this.previousHash + this.timestamp + JSON.stringify(this.data);
  this.hash = SHA256(hashString).toString();
  next();
});

// Define the model for a block
const Block = mongoose.model('Block', BlockSchema);

// Define schema for the blockchain
const BlockchainSchema = new mongoose.Schema({
  chain: [BlockSchema],
});

// Define the model for the blockchain
const Blockchain = mongoose.model('Blockchain', BlockchainSchema);

module.exports = { Block, Blockchain };
