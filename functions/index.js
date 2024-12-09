// /**
//  * Import function triggers from their respective submodules:
//  *
//  * const {onCall} = require("firebase-functions/v2/https");
//  * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
//  *
//  * See a full list of supported triggers at https://firebase.google.com/docs/functions
//  */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started

// // exports.helloWorld = onRequest((request, response) => {
// //   logger.info("Hello logs!", {structuredData: true});
// //   response.send("Hello from Firebase!");
// // });
const functions = require("firebase-functions");
const {StreamChat} = require("stream-chat");

// Initialize the Stream Chat server-side client
const serverClient =StreamChat.getInstance("ts3zy4rvm9gj",
    "3wbmfh8589svmpvs7zgz5temv8ajn389439sh2t8zksk2kc7xean3ypx47tw8q66");


// Firebase Function to generate a token
exports.generateStreamToken = functions.https.onCall((data, context) => {
  // Ensure the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated to generate a Stream token.",
    );
  }

  const userId = context.auth.uid; // Firebase Auth UID as Stream user ID
  const token = serverClient.createToken(userId);

  return {token, userId};
});
