const mongoose = require('mongoose');
const connectDatabase = require('../database/db');
const { Block, Blockchain } = require('../models/blockchain');
const { SHA256 } = require('crypto-js');

exports.handler = async (event) => {
  try {
    const { headers, body } = event;
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

    // Parse the JSON data from the request body
    const requestData = JSON.parse(body);

    // Check if there are any blocks in the blockchain
    const blockCount = await Block.countDocuments();

    // If there are no blocks, create the first block with an empty previousHash
    let previousHash = '';
    if (blockCount > 0) {
      // If there are blocks, find the latest block and use its hash
      const latestBlock = await Block.findOne({}, {}, { sort: { timestamp: -1 } });
      previousHash = latestBlock.hash;
    }

    // Create a new block with data, previousHash, and calculate the hash
    const timestamp = new Date();
    const hashString = previousHash + timestamp + JSON.stringify(requestData.data);
    const hash = SHA256(hashString).toString();

    const newBlock = new Block({
      index: blockCount + 1,
      timestamp,
      data: JSON.stringify(requestData.data),
      previousHash,
      hash,
    });

    // Save the new block to the database
    await newBlock.save();

    // Update the blockchain
    const blockchain = new Blockchain({ chain: await Block.find() });
    await blockchain.save();

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Data has been successfully added to the blockchain' }),
    };
  } catch (error) {
    console.error(error); // Log the error for debugging

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error while adding data to the blockchain' }),
    };
  }
};
