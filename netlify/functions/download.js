// netlify/functions/download.js
const fetch = require('node-fetch');

exports.handler = async (event) => {
  const imageUrl = event.queryStringParameters.url;
  if (!imageUrl) {
    return {
      statusCode: 400,
      body: "Missing 'url' parameter",
    };
  }

  try {
    const response = await fetch(imageUrl);
    const contentType = response.headers.get('content-type');
    const buffer = await response.buffer();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': 'attachment; filename="meme.jpg"',
      },
      body: buffer.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: 'Error downloading image: ' + error.message,
    };
  }
};
