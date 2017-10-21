var Twit = require('twit');
var es_client = require('./search_tool.js')

var T = new Twit({  // You need to setup your own twitter configuration here!
    consumer_key:    'W4hNtuvw7cYOYqqS96rM1xM4x',
    consumer_secret: 'yTrNlbGZCanfCfL7zA8gJmlgxwvbhozHQo3rxC4gZ0swNm5Kzr',
    access_token:    '919056678645129216-wdJpU4YdNGLlShHJAio1WCKRpRFtE90',
    access_token_secret: 'j4AwgtZ0MqbVxd7Kh5JR5Tt0oCQWLyWg1XCXt34tjqhN6'
});
var world = [ '-180', '-90', '180', '90' ];
var stream = T.stream('statuses/filter', { locations: world});
//start config stream
stream.on('error',function(error){
    console.log(error);
});
// stream.on('limit', function (limitMessage) {
//   console.log("Limit:"+JSON.stringify(limitMessage));
// });
stream.on('tweet', function (tweet) {
    if(tweet.geo){
      var smallTweet={
          text: tweet.text,
          keyword: 'test',
          user: {  screen_name:       tweet.user.screen_name,
                   profile_image_url: tweet.user.profile_image_url,
                   id_str:            tweet.user.id_str
            },
          geo: {
              lat : tweet.geo.coordinates[0],
              lon : tweet.geo.coordinates[1]
            }
        };
        //send data to elasticsearch
        es_client.index({
            index : 'tweets',
            type : 'test',
            body : smallTweet
        }, function(err, resp, status){
            if(err){
                console.log(err)
            }else{
                //console.log('=================send data to elasticsearch===============')
            }
        });
    }
});

module.exports = stream;