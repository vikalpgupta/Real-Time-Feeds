"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const server = require("http").createServer(app), io = require("socket.io").listen(server);
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

let users = [];
let timeLineData = [];

app.get("/api/create-user", (req, res) => {
    users.push("UserId-" + (users.length + 1));
    res.send({ userId: users[users.length - 1] });
});

app.get("/api/timeline", (req, res) => {
    res.send({ data: timeLineData });
});

app.post("/api/send-post", (req, res) => {
    const { userId, text } = req.body;
    const data = {
        id: timeLineData.length + 1,
        userId,
        text
    };

    timeLineData.unshift(data);

    res.send({ data });
});

app.post("/api/send-comment", (req, res) => {
    const { userId, text, postId } = req.body;
    let data;

    timeLineData && timeLineData.some(function (timeline) {
        if (timeline.id === postId) {
            if (!timeline.comments) {
                timeline.comments = [];
            }

            data = {
                userId,
                text,
                id: timeline.comments.length + 1
            };

            timeline.comments.push(data);

            return true;
        }
    });

    res.send({ postId, data });
});

app.post("/api/send-reply", (req, res) => {
    const { userId, text, postId, commentId } = req.body;
    let data;

    timeLineData && timeLineData.some(function (timeline) {
        if (timeline.id === postId) {
            timeline.comments && timeline.comments.some(function (comment) {
                if (comment.id === commentId) {
                    if (!comment.replies) {
                        comment.replies = [];
                    }

                    data = {
                        userId,
                        text,
                        id: comment.replies.length + 1
                    };

                    comment.replies.push(data);
                    return true;
                }
            });

            return true;
        }
    });

    res.send({ postId, commentId, data });
});

io.sockets.on("connection", function (socket) {
    socket.on("send_post", function (data) {
        io.emit("receive_post", data);
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));