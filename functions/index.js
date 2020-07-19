const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const calendar = google.calendar("v3");
const functions = require("firebase-functions");
const cors = require("cors");

const googleCredentials = require("./client_secret_1043408526545-3kk8hmudfnjjsg4nplspaii5361r0eni.apps.googleusercontent.com.json");

const ERROR_RESPONSE_500 = {
  status: "500",
  message: "There was an error accessing to google calendar",
};

exports.deleteEventOnCalendar = functions
  .region("asia-northeast1")
  .https.onRequest((request, response) => {
    console.log(request.headers);
    const eventId = request.body.eventId;
    console.log("Receive request body eventId: " + eventId);

    const oAuthClient = new OAuth2(
      googleCredentials.web.client_id,
      googleCredentials.web.client_secret,
      googleCredentials.web.redirect_uris[0]
    );

    oAuthClient.setCredentials({
      refresh_token: googleCredentials.refresh_token,
    });

    deleteEvent(eventId, oAuthClient)
      .then((data) => {
        console.log(data);
        console.log("Request successful");
        cors(request, response, () => {
          response.status(200).send(data);
        });
        return;
      })
      .catch((error) => {
        console.error("Error deleting event: " + error.message);
        cors(request, response, () => {
          response.status(500).send(ERROR_RESPONSE_500);
        });
        return;
      });
  });

const deleteEvent = (eventId, auth) => {
  return new Promise((resolve, reject) => {
    calendar.events.delete(
      {
        auth: auth,
        calendarId:
          "tohoku.ac.jp_04dkvupc678baalv9828uu6k4k@group.calendar.google.com",
        eventId: eventId,
      },
      (error, response) => {
        if (error) {
          console.log(error);
          reject(error);
        }
        console.log(response);
        resolve(response.data);
      }
    );
  });
};
