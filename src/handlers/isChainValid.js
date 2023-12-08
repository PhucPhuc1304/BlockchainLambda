const mongoose = require('mongoose');
const connectDatabase = require('../database/db');
const { Block } = require('../models/blockchain');
const { SHA256 } = require('crypto-js');

exports.handler = async (event) => {
  try {
    const { headers } = event;
    const accessToken = headers['access-token'];
    const apiKey = headers['x-api-key'];

    // Check API key and token
    if (accessToken !== 'phucphuctest123' || apiKey !== 'hutech_hackathon@123456') {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Forbidden' }),
      };
    }

    await connectDatabase();
    const blocks = await Block.find().sort({ index: 1 }); // Fetch all blocks sorted by index

    function isChainValid() {
      for (let i = 1; i < blocks.length; i++) {
        const currentBlock = blocks[i];
        const previousBlock = blocks[i - 1];

        if (currentBlock.previousHash !== previousBlock.hash) {
          return false; // PreviousHash doesn't match the previous block's hash
        }

        const hashString = currentBlock.previousHash + currentBlock.timestamp + currentBlock.data;
        const computedHash = SHA256(hashString).toString();

        if (currentBlock.hash !== computedHash) {
          return false; // The block's hash doesn't match the computed hash
        }
      }
      return true; // If all checks pass, the chain is valid
    }

    const isValid = isChainValid();

    return {
      statusCode: 200,
      body: JSON.stringify({ isValid }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error while checking blockchain integrity' }),
    };
  }
};
