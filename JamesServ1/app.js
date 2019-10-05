const express = require('express')
const app = express()
const path = require('path')

const exphbs = require('express-handlebars')

const handlebrs = require('handlebars')

const fs = require('fs');

const node_dir = require('node-dir');

const url = require('url');

var b64 = require('js-base64').Base64;



var vidName = 'vids//t.mp4';
var RelativePathMin = "/C:/Users/longe/source/repos/JamesServ1/JamesServ1/";

var qq = {
    name: "James",
    links: [
        { link: "<a href ='http://www.youtube.com' > some text </a>" },
        { link: "hi mom2" }]
};

//register helpers 
var hbs = exphbs.create({
    helpers: {
        foo: function () { return 'FOO!'; },
        bar: function () { return 'BAR!'; },
        bold: function (options) {
            return new handlebrs.SafeString(
                '<div class="mybold">'
                + options.fn(this)
                + '</div>');
        }
    }
});

app.engine('handlebars', hbs.engine);



app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts')
}))



app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'views'))




app.use((request, response, next) => {
    console.log(request.headers)
    next()
})

app.use((request, response, next) => {
    request.chance = Math.random()
    next()
})

app.get('/', (request, response, next) => {
    

   


    node_dir.paths(path.join(__dirname, '/vids'), function (err, files) {
        var videosFound = [];
        //generate the body 
        var Body = [];
        var bodyLink = { link: '' };
        var bodyVid = { video: '' };


        for (var i = 0; i < files.files.length; i++) {
 
            var str2 = files.files[i];
            var str3 = str2.replace(RelativePathMin, '');

            var str4 = b64.encode(str3);
            str4 += '.movie';
            str4 = 'vids/' + str4;

            videosFound.push(str4);
        }

        var j = 0;
        while (videosFound.length > 0) {
            var bodyLink = { link: '' };
            var bodyVid = { video: '' };
            var vidSrc = videosFound.pop(); 


            bodyLink.link = '<a href="/download/' + vidSrc + '"> download </a>';
            bodyVid.video = '<video controls="" loop="" autoplay="" class="expandedWebm" src="/' + vidSrc + '" style="max-width: 960px; max-height: 540px;"></video>';

            //bodyVid.video = '< video controls="" loop="" autoplay="" class="expandedWebm" src= "/' + vidSrc + '" style = "max-width: 960px; max-height: 540px;" ></video > ';
     
            Body.push(bodyLink);
            Body.push(bodyVid);

            j++;
        }
        for (var i = 0; i < videosFound.length; ) {
            
           
            i++;
            j++;
        }


        response.render('home', {
            title: "James' video server",
            body: Body
            , helpers: {
                bold: function (options) {
                    return new handlebrs.SafeString(
                        '<div class="mybold">'
                        + options.fn(this)
                        + '</div>');
                },
                each: function (context, options) {
                    var ret = "";
                    for (var i = 0, j = context.length; i < j; i++) {
                        ret = ret + options.fn(context[i]);
                    }

                    return ret;
                }
            }
        });


    });


    

  
});

app.get('/vids*', function (req, res) {

    var newpath = req.url.replace('.movie', '');
    newpath = newpath.replace('/vids/', '');

    var pathN = b64.decode(newpath);

    fs.readFile(pathN, function (err, data) {
        if (!err) {
            console.log(data);
            res.send(data);
        }
    });
//   res.pipe()
});

app.get('/download*', function (req, res) {
    var newpath = req.url.replace('.movie', '');
    newpath = newpath.replace('/vids/', '');
    newpath = newpath.replace('/download', '');

    var pathN = b64.decode(newpath);
    try {
        res.download(pathN, function (err) {
        });
    } catch (e) {
        console.log(e);
    }
   

   
   
});


app.listen(5353)



node_dir.paths(path.join(__dirname, '/vids'), function (err, files) {
    for (var i = 0; i < files.files.length; i++) {
        var fname; //= files.files[i].replace(RelativePathMin, ''); 
        fname = url.pathToFileURL(files.files[i]);
        var str2 = fname.pathname;
        var str3 = str2.replace(RelativePathMin, '');
        var str4 = b64.encode(str3);
 
        console.log(str4+'\n'+b64.decode(str4));
    }
});