var nodemailer = require('nodemailer')
var Imap = require('imap')
var inspect = require('util').inspect

var cursor;
var configEmail = 'abc@gmail.com';
var configPassword = '******';

var imap = new Imap({
  user: configEmail,
  password: configPassword,
  host: 'imap.gmail.com',
  port: 993,
  tls: true
});

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: configEmail,
        pass: configPassword
    }
});

function openInbox(cb) {
  imap.openBox('INBOX', /*readOnly*/false, cb);
}

function search(keyword) {
    return "You are searching for " + keyword;
}

imap.once('ready', function() {

  openInbox(function(err, box) {

    if (err) throw err;

    imap.search(['UNSEEN', ['SINCE', 'July 25, 2014']], function(err, results){
        
        if (err || results.length === 0){
            console.log('you are up to date');
            imap.end();
            return;
        }
       
        var f = imap.fetch(results, {bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)', struct:true, markSeen:true});
        
        f.on('message', function(msg, seqno){
            msg.on('body', function(stream, info){
                var buffer = '';
                stream.on('data', function(chunk){
                    buffer += chunk.toString('utf8');
                });
                stream.once('end', function(){
                    var header = Imap.parseHeader(buffer);
                    console.log('received: ' + seqno);
                    console.log(header['subject']);
                    transporter.sendMail({
                        from: configEmail,
                        to: header['from'],
                        subject: 'result of ' + header['subject'],
                        text: search(header['subject'])
                    });
                });   
            });

        });

        f.once('error', function(err){
            console.log('Fetch error: ' + err);
        });

        f.once('end', function(){
            console.log('Done');
            imap.end();
        });

    });
  });
});

function touch(request, response){
    try{
        imap.connect();
    }catch(exception){
        response.writeHead(500);
        response.write("failed");
        response.end();
        return;
    }
    response.writeHead(200);
    response.write('touched');
    response.end();
}

exports.touch = touch;
