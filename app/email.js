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
  imap.openBox('INBOX', true, cb);
}

function search(keyword) {
    return "You are searching for " + keyword;
}

imap.once('ready', function() {
  openInbox(function(err, box) {
    console.log("total :" + box.messages.total);
    if (err) throw err;
    if(cursor == null){
        cursor = box.messages.total;
    }
    var f = imap.seq.fetch(cursor + ":" +box.messages.total, {
      bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
      struct: true
    });

    cursor = box.messages.total;

    f.on('message', function(msg, seqno) {
      console.log('Message #%d', seqno);
      var prefix = '(#' + seqno + ') ';
      msg.on('body', function(stream, info) {

        var buffer = '';
        stream.on('data', function(chunk) {
          buffer += chunk.toString('utf8');
        });
        stream.once('end', function() {
        console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
        var header = Imap.parseHeader(buffer);
          transporter.sendMail({
              from: configEmail,
              to: header['from'],
              subject: 'result of ' + header['subject'],
              text: search(header['subject'])
          });
        });
      });
    });
    f.once('error', function(err) {
      console.log('Fetch error: ' + err);
    });
    f.once('end', function() {
      console.log('Done fetching all messages!');
      imap.end();
    });
  });
});

imap.once('error', function(err) {
  console.log(err);
});

imap.once('end', function() {
  console.log('Connection ended');
});

imap.connect();
