const mongoose = require('mongoose');
const { Block, Blockchain } = require('../models/blockchain');
const connectDatabase = require('../database/db');


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

    await connectDatabase(); // Assuming you have a connectDatabase function

    // Fetch all blocks from the database
    const blocks = await Block.find();

    // Format the blocks as needed for viewing
    const formattedBlocks = blocks.map((block) => {
      return {
        index: block.index,
        timestamp: block.timestamp,
        data: block.data,
        previousHash: block.previousHash,
        hash: block.hash,
      };
    });

    // Return the formatted blocks
    return {
      statusCode: 200,
      body: JSON.stringify(formattedBlocks),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error while fetching and viewing blocks' }),
    };
  }
};
