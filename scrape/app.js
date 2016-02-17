"use strict";

let request = require('request');
let cheerio = require('cheerio');
let express = require('express');
let app = express();

app.get('/hn_front_page', req, res => {
    getResponse((err, result) => {
        if (err) {
            res.status(400).send('Something is broken');
        } else {
            res.send(JSON.stringify(result));
        }
    });
});

// get rank, title, url details for HN articles
let getResponse = callback => {
    request('https://news.ycombinator.com', function (error, response, html) {
        if (error) {
            console.log('error');
            callback(error);
        } else if (response.statuscode !== 200) {
            console.log('try again');
            callback(new Error('error try again'));
        } else {
            let $ = cheerio.load(html);
            let newparsedresults = $('span.comhead').map(function (i, element) {
                let a = $(this).prev();
                let rank = a.parent().parent().text();
                let title = a.text();
                let url = a.attr('href');
                let subtext = a.parent().parent().next().children('.subtext').children();
                let credits = $('.subtext').eq(0).text();
                let metadata = {
                    rank: parseint(rank),
                    title: title,
                    url: url,
                    credits: credits
                };
                callback(null, metadata);
            });
        }
    });
}

app.listen(3000, () => {
    console.log('Listen to port 3000');
});
