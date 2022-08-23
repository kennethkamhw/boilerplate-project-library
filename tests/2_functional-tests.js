/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const ObjectId = require("mongoose").Types.ObjectId;

chai.use(chaiHttp);

let bookid = "6304ddb38dbd578b177de486";

suite("Functional Tests", function() {
    /*
     * ----[EXAMPLE TEST]----
     * Each test should completely test the response of the API end-point including response status code!
     */
    test("#example Test GET /api/books", function(done) {
        chai
            .request(server)
            .get("/api/books")
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.isArray(res.body, "response should be an array");
                assert.property(
                    res.body[0],
                    "commentcount",
                    "Books in array should contain commentcount"
                );
                assert.property(
                    res.body[0],
                    "title",
                    "Books in array should contain title"
                );
                assert.property(
                    res.body[0],
                    "_id",
                    "Books in array should contain _id"
                );
                done();
            });
    });
    /*
     * ----[END of EXAMPLE TEST]----
     */

    suite("Routing tests", function() {
        suite(
            "POST /api/books with title => create book object/expect book object",
            function() {
                test("Test POST /api/books with title", function(done) {
                    chai
                        .request(server)
                        .post("/api/books")
                        .type("form")
                        .set("content-type", "application/json")
                        .send({
                            title: "testing-book-1",
                        })
                        .end((err, res) => {
                            console.log(res.body);
                            assert.equal(res.status, 200);
                            assert.equal(res.body.title, "testing-book-1");
                            done();
                        });
                });

                test("Test POST /api/books with no title given", function(done) {
                    chai
                        .request(server)
                        .post("/api/books")
                        .type("form")
                        .set("content-type", "application/json")
                        .send({})
                        .end((err, res) => {
                            console.log(res.text);
                            assert.equal(res.status, 200);
                            assert.equal(res.text, "missing required field title");
                            done();
                        });
                });
            }
        );

        suite("GET /api/books => array of books", function() {
            test("Test GET /api/books", function(done) {
                chai
                    .request(server)
                    .get("/api/books")
                    .end((err, res) => {
                        console.log(res.body);
                        assert.equal(res.status, 200);
                        assert.isArray(res.body, "response should be an array");
                        assert.property(
                            res.body[0],
                            "title",
                            "element in array should have a title property"
                        );
                        assert.property(
                            res.body[0],
                            "commentcount",
                            "element in array should have a commentcount property"
                        );
                        assert.property(
                            res.body[0],
                            "_id",
                            "element in array should have an id property"
                        );
                        done();
                    });
            });
        });

        suite("GET /api/books/[id] => book object with [id]", function() {
            test("Test GET /api/books/[id] with id not in db", function(done) {
                chai
                    .request(server)
                    .get("/api/books/6304dc399b9474a184413a23")
                    .end((err, res) => {
                        console.log(res.text);
                        assert.equal(res.status, 200);
                        assert.equal(res.text, "no book exists");
                        done();
                    });
            });

            test("Test GET /api/books/[id] with valid id in db", function(done) {
                chai
                    .request(server)
                    .get("/api/books/" + bookid)
                    .end((err, res) => {
                        console.log(res.body);
                        assert.equal(res.status, 200);
                        assert.equal(res.body._id, new ObjectId(bookid));
                        done();
                    });
            });
        });

        suite(
            "POST /api/books/[id] => add comment/expect book object with id",
            function() {
                test("Test POST /api/books/[id] with comment", function(done) {
                    chai
                        .request(server)
                        .post("/api/books/" + bookid)
                        .set("content-type", "application/json")
                        .type("form")
                        .send({
                            comment: "I don't give it a shit!",
                        })
                        .end((err, res) => {
                            console.log(res.body);
                            assert.equal(res.status, 200);
                            assert.equal(
                                res.body.comments[res.body.comments.length - 1],
                                "I don't give it a shit!"
                            );
                            done();
                        });
                });

                test("Test POST /api/books/[id] without comment field", function(done) {
                    chai
                        .request(server)
                        .post("/api/books/" + bookid)
                        .type("form")
                        .set("content-type", "application/json")
                        .send({})
                        .end((err, res) => {
                            console.log(res.text);
                            assert.equal(res.status, 200);
                            assert.equal(res.text, "missing required field comment");
                            done();
                        });
                });

                test("Test POST /api/books/[id] with comment, id not in db", function(done) {
                    chai
                        .request(server)
                        .post("/api/books/6304dc399b9474a184413a23")
                        .type("form")
                        .set("content-type", "application/json")
                        .send({
                            comment: "Let it go! Let it go!",
                        })
                        .end((err, res) => {
                            console.log(res.text);
                            assert.equal(res.status, 200);
                            assert.equal(res.text, "no book exists");
                            done();
                        });
                });
            }
        );

        suite("DELETE /api/books/[id] => delete book object id", function() {
            test("Test DELETE /api/books/[id] with valid id in db", function(done) {
                chai
                    .request(server)
                    .delete("/api/books/" + bookid)
                    .end((err, res) => {
                        console.log(res.text);
                        assert.equal(res.status, 200);
                        assert.equal(res.text, "delete successful");
                        done();
                    });
            });

            test("Test DELETE /api/books/[id] with  id not in db", function(done) {
                chai
                    .request(server)
                    .delete("/api/books/" + "6304dc399b9474a184413a23")
                    .end((err, res) => {
                        console.log(res.text);
                        assert.equal(res.status, 200);
                        assert.equal(res.text, "no book exists");
                        done();
                    });
            });
        });
    });
});