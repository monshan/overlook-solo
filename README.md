# Overlook

## Primary Contributor

[Marika Shanahan](https://github.com/monshan)

### Installation and Setup

1. Clone down the local API [here](https://github.com/turingschool-examples/overlook-api) using your terminal and run  <code>npm i</code> to install dependencies
2. Run <code>npm start</code> on the local API repo to run the server. If successful, you should see a message in the terminal that reads <code>Overlook API is now running on http://localhost:3001 !</code>
3. Clone down this repo and run <code>npm i</code> to install dependencies
4. Run <code>npm start</code> on this repo to 
5. Open localhost:8080 in your browser or click [here](http://localhost:8080/)
6. Start interacting with Overlook!

|   |Username|Password|
|---|---|---|
|Customer|<code>customer:id</code>|<code>overlook2021</code>|
|Administrator|<code>manager</code>|<code>overlook2021</code>|

The <code>:id</code> can be any number between <code>1</code> to <code>50</code>
<hr>

### What is this?

You can login as a customer or manager and make a hotel bookings *(with some fake data)* , if you do not enter the correct login credentials a popup will inform you.

![](https://media.giphy.com/media/eZsOu0INraup8DER34/giphy.gif)

You can see all the logged-in customers previous bookings in the right aside. Search for rooms with the date selector at the top of the page and see them populate in the actie area below. You can further filter them with the advanced search dropdown.

![](https://media.giphy.com/media/mGZIoS1OvxIHl44nCn/giphy.gif)

If no room is found that matches your query, a popup will inform you.

![](https://media.giphy.com/media/Qz9TlDLykQvtYYos9B/giphy.gif)

Upon selecting a room with its associated button a popup will appear that asks you to confirm the booking information, if successful another popup will inform you of the successful booking and it will appear in the right aside.

![](https://media.giphy.com/media/Tl0el51KB21VeDDMBW/giphy.gif)

This web application is responsive for screens down to 360px width.

### Tech Stack

- HTML5
- CSS3 in SASS / SCSS Conventions
- JavaScript ES6 Conventions (Vanilla JS)