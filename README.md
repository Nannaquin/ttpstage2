# ttpstage2 - A MERN Stack virtual stock trading platform.
Uses the MERN Stack (MongoDB, Express.js, React.js, Node.js).
Developed for a coding assignment.
I will note that this was my first venture into a full stack project, with very little experience prior to this.

Note: npm install will have to be run both in the root folder and the client folder.

Other notes: The update button works far more slowly than purchasing or selling.
Refreshing the dashboard/portfolio page visually reverts any changes made prior to it first being loaded. Using any of the buttons
besides logout returns the proper information.

---
# Design
I was tasked with creating a full stack web app that would allow users to buy and sell stocks (with virtual money). As such, from the outset I was concerned with a few things:
* User Authentication
* Accurate Stock Data
* Responsive Data Storage

## User Authentication

## Stock Data
I chose to use the the (https://www.alphavantage.co/)[AlphaVantage API] for my stock data as it was accessable and provided data in the minimum frequency that was required (daily). 


## Databases
I chose MongoDB, and by extension Mongoose.js (ORM) and MongoDB Atlas due to its quick prior experience with the technology due to its ability to access data quickly and prior experience with it in my Big Data class.
