var express = require("express")
  , jade = require("jade")
  , fs = require("fs");

var app = express();

var root = __dirname
  , port = 3000;

app.use( express.static( root + "/public" ));

app.set( "views", root + "/views" );

app.set( "view engine", "jade" );

app.use( express.urlencoded());

app.use( express.multipart({ uploadDir: root + "/tmp" }));

app.get( "/settings/profile", function editProfileCb ( req, res ) {

  res.render( "profile-form" );

});

app.post( "/settings/profile", function postProfileCb ( req, res ) {

  var data = req.body;

  if ( req.files.photoField != undefined ) {

    var filePath = req.files.photoField.path 

      , fileName = req.files.photoField.originalFilename;

    var finalPath = root + "/public/images/" + fileName;

    fs.renameSync( filePath, finalPath );

    data.photoPath = "images/" + fileName;

  }

  fs.writeFile( "data.json", JSON.stringify( data, null, 2 ), function writeCb ( err ) {

    if ( err ) {

      res.json({ err: true, msg: err.msg });

      return console.log( err )

    }

    res.redirect( "/profile" );

  });

});


app.get( "/profile", function profileCb ( req, res ) {


  fs.readFile( "data.json", function readCallback ( err, data ) {

    if ( err ) {

      res.json({ err: true, msg: err.msg });

      return console.log( err )

    }

    var profileData = JSON.parse( data );

    res.render( "profile", {
      firstname: profileData.firstNameField,
      lastname: profileData.lastNameField,
      bio: profileData.bioField,
      photo: profileData.photoPath
    });

  });

});

app.listen( port, function listenCallback () {
  console.log( "Express server is listening on port " + port );
  console.log( "To test, browse to http://localhost:" + port );
});
