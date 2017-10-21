var elasticsearch = require('elasticsearch')

//add elastic search
var es_client = new elasticsearch.Client({
	host:['https://search-ccassignment-01-r5qc5ayzalbw5apkgjjdw2qp4u.us-east-1.es.amazonaws.com']
});

//create a mapping
es_client.indices.putMapping({
    index : 'tweets',
    type: 'test',
    body : {
        'properties' : {
            'text' : {'type' : 'text'},
            'user' : {
                'properties' : {
                    'screen_name' : {'type': 'text'},
                    'profile_image_url' : {'type': 'text'},
                    'id_str' : {'type':'text'}
                }
            },
            'geo' : { 'type': 'geo_point'}
        }
    }
},function(err, resp, status){
    if(err){
        console.log(err);
    }else{
        //console.log('=================create schema==================');
    }
});

module.exports = es_client;