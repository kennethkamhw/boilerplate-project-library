/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const { bookModel, commentModel } = require('../model/model.js');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      console.log("returning the list of the book!");
      bookModel.find({}, (err, docs) => {
        if (err) {
          
          console.log(`Database error: ${err}`);
          res.send(`Database error!`);
          
        } else {
          
          let result = docs.map((e) => {
            return {
              _id: e._id,
              title: e.title,
              commentcount: e.comments.length
            }
          });
          
          res.json(result);
          
        }
      });
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      console.log(`book title = ${title}`);

      if (!title) {
        
        console.log("missing required field title");
        res.send("missing required field title");
        
      } else {

        const newBook = new bookModel({
          title: title
        });
  
        bookModel.findOne({ title: title }, (err, bookData) => {
          
          console.log(`finding book with title = ${title}`);
  
          if (err) {
            console.log(`Database error: ${err}`);
            res.send(`Database error!`);
          } else {
  
            if (!bookData) {
              console.log("no such book exists, creating new book");
              newBook.save((err, data) => {
                if (err) {
                  console.log(`Database error: ${err}`);
                  res.send(`Database error!`);
                } else {
                  console.log(`New book added: ${data}`);
                  res.json(data);
                }
              });
            } else {
              console.log(`book with title ${title} existed, return the data from database`);
              res.json(bookData);
            }
            
          }
        });
      }      
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      bookModel.deleteMany({}, (err, data) => {
        if (err) {
          console.log(err.message);
          res.send("Database error");
        } else {
          console.log(`Completly removed: ${JSON.stringify(data)}`);
          res.send('complete delete successful');
        }
      })
    });

  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}

      console.log(`Getting comment: bookid = ${bookid}`);


      bookModel.findById(bookid, (err, bookData) => {
        if (err) {
          console.log(err.message);
          res.send(`Database Error!`);
        } else {
          if (!bookData) {
            console.log("no book exists");
            res.send("no book exists");
          } else {

            bookData = {
              _id: bookData._id,
              title: bookData.title,
              comments: bookData.comments.map(e=>e.comment),
              commentcount: bookData.comments.length
            }
            
            console.log(`Found book ${bookData.title}`);
            console.log("returning found data");
            res.json(bookData);
          }
        }
      }); 
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get

      console.log(`Posting comment: bookid = ${bookid}, comment = ${comment}`);
      console.log()

      if (!comment) {
        
        console.log("missing required field comment");
        res.send("missing required field comment");
        
      } else {
        
        const newComment = new commentModel({
          comment: comment
        });
  
        bookModel.findById(bookid, (err, bookData) => {
          if (err) {
            console.log(err.message);
            res.send(`Database Error!`);
          } else {
            if (!bookData) {
              console.log("no book exists");
              res.send("no book exists");
            } else {
              console.log(`Found book ${bookData.title}`);
              console.log("returning found data");
              bookData.comments.push(newComment);
              bookData.save((err, updatedData) => {
                
                if (err) {
                  console.log("Database error");
                  res.send(err.message);
                } else {

                  let result = {
                      _id: updatedData._id,
                      title: updatedData.title,
                      comments: updatedData.comments.map(e=>e.comment),
                      commentcount: updatedData.comments.length
                    }
                  console.log(`new comment added, data = ${result}`);
                  res.json(result);
                  
                }
              });
            }
          }
        }); 
      }
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'

      if (!bookid) {
        console.log("missing required field bookid");
        res.send("missing required field bookid");
      } else {

        bookModel.findById(bookid, (err, bookData) => {
          if (err) {
            console.log("Database error");
            res.send(err.message);
          } else {
            
            if (!bookData) {
              console.log("no book exists");
              res.send("no book exists");
            } else {
              console.log(`Found one book ${bookData.title}`);
              bookData.remove((err, data) => {
                if (err) {
                  console.log("Database error");
                  res.send(err.message);
                } else {
                  console.log(`delte successful: ${data}`);
                  res.send("delete successful")
                }
              });
            }
            
          }
        });
        
      }
      
    });
  
};
