var TYPE_TO_FIELDS_MAPPING = {
    submitted: ['id', 'permalink', 'created', 'title', 'score', 'subreddit'],
    comments: ['id', 'link_url', 'created', 'subreddit', 'link_title', 'body'],
    upvoted: ['id', 'permalink', 'created', 'subreddit', 'title'],
    downvoted: ['id', 'permalink', 'created', 'subreddit', 'title']
};
var CELL_SIZE = 20;
var NUMBER_OF_COLORS = 6;


data = randomData();
//console.log(data.dates);
createHeatMap(data, 2015, 2016);