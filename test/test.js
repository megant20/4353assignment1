let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");

// Assertion styles
chai.should();

chai.use(chaiHttp);

describe('Tasks API', () => {
  // Get
  describe("GET /login", () => {
    it("It should GET login page", (done) => {
        chai.request(server)
            .get("/login")
            .end((err, response) => {
                response.should.have.status(200);
            done();
          });
    });
  });

  // Post
  describe("POST /addUser", () => {
    it("It should send signup info to database", (done) => {
        var userName = "bluefox";
        var userPass = "blue1234";
        chai.request(server)
            .post("/addUser")
            .query()
            .end((err, response) => {
              response.should.have.status(201);
            done();
            });

    });

  });



});
