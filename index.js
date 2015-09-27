var http = require('http'),
    unirest = require('unirest'),
    dotenv = require('dotenv').load(),
    titles = [],
    titleToUse = '';

function chooseTitle(titles){
  return titles[Math.floor(Math.random() * titles.length)];
}

function chooseRandom(arr){
  return arr[Math.round(Math.random() * arr.length)];
}

var topStorySections = [
  'world',
  'national',
  'politics',
  'business',
  'opinion',
  'technology',
  'science',
  'health',
  'sports',
  'arts',
  'fashion',
]

http.get("http://api.nytimes.com/svc/topstories/v1/" + chooseRandom(topStorySections) + ".json?api-key=" + process.env.NY_TIMES_API_KEY, function(res){
  res.setEncoding('utf-8');
  var body = '';
  res.on('data', function(chunk) {
    body += chunk;
  });
  res.on('end', function() {
    var newBody = JSON.parse(body);
        results = newBody.results;
        resLength = results.length;
    for (var i = 0; i < resLength; i++) {
      title = results[i].title;
      titles.push(title);
    }
    titleToUse = chooseTitle(titles);
    while (titleToUse.length < 2){
      titleToUse = chooseTitle(titles);
    }
    var nounPhraseUrl = "https://textanalysis.p.mashape.com/textblob-noun-phrase-extraction?text=" + titleToUse;

    unirest.post("https://textanalysis.p.mashape.com/textblob-noun-phrase-extraction")
      .header("X-Mashape-Key", process.env.MASHAPE_API_KEY)
      .header("Content-Type", "application/x-www-form-urlencoded")
      .header("Accept", "application/json")
      .send("text=" + titleToUse)
      .end(function (result) {
         var phrases = result.body.noun_phrases,
             firstProblem = chooseRandom(phrases),
             secondProblem = chooseRandom(phrases);
        console.log("The two hardest problems in computer science are " + firstProblem + " and " + secondProblem + ".");
      });
    });
}).on('error', function(e){
  console.log(e);
});
