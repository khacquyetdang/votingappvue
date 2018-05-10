// normally move these params into env file
var whitelist = ['http://127.0.0.1:3000/', 'http://192.168.0.10:3000', 
'https://votingappvueapi.khacquyetdang.com', 'https://votingapp.khacquyetdang.com']
exports.corsOptions = {
    origin: whitelist
}