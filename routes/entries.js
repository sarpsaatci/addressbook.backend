 var express = require('express');
 var router = express.Router();

/*
 * GET entrylist.
 */
 router.get('/entrylist', function(req, res) {

  var db = req.db;
  var collection = db.get('entries');

  collection.find({}, {sort: {'firstname': 1}}, (function (e, docs) {
    if (e) {
      console.log('error: ' + e);
      res.json({"error": e});
    }
    console.log('docs: ' + docs);
    res.send(JSON.stringify(docs))
  }));

 });

//GET to searchentry
router.get('/entrylist/:keyword', function(req, res) {
  var db = req.db;
  var collection = db.get('entries');
  var searchKeyword = req.params.keyword;
  console.log(searchKeyword);
  collection.find({ $or : [{'firstname' : {$regex: searchKeyword, $options:'i'}}, {'lastname' : {$regex: searchKeyword, $options:'i'}}]}, function (e, docs) {
    res.send(JSON.stringify(docs));
  })

  });

/*
 * POST to addentry.
 */
 router.post('/addentry', function(req, res) {

  var user = JSON.stringify(req.body);
  var db = req.db;
  var collection = db.get('entries');
  collection.insert(req.body, function(err, result){
    console.log(req.body);
    res.send(
      (err === null) ? { msg: ''} : { msg: err }
      );
  })

});


// * POST to updateentry
router.post('/updateentry/:id', function(req, res) {
  console.log(req.body);
  var db = req.db;
  var collection = db.get('entries');
  var userToUpdate = req.body;
  console.log(userToUpdate);
  var userId = req.params.id;
  console.log("userıd:" + userId);
  collection.update({'_id' : userId}, userToUpdate, function(err, result){
    res.send(
      (err === null) ? {msg: ' '} : {msg: err});
  })
});

/*  
 * DELETE to deleteentry
 */
 router.delete('/deleteentry/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('entries');
  var userToDelete = req.params.id;
  collection.remove({ '_id' : userToDelete }, function(err) {
    res.send((err === null) ? { msg: ' ' } : { msg:'error: ' + err });
  })
});


 module.exports = router;

