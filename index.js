var SerialPort = require("serialport").SerialPort;
var quotes=[
"Happy birthday, you're not getting older you're just a little closer to death.",
"To the nation's best kept secret; your true age.",
"Birthdays are like boogers, the more you have the harder it is to breathe.",
"Birthdays are good for you. Statistics show that people who have the most live the longest!",
"Growing old is mandatory; growing up is optional.",
"Better to be over the hill than burried under it.",
"You always have such fun birthdays; you should have one every year.",
"So many candles... so little cake.",
"Happy birthday to a person who is smart, good looking, and funny and reminds me a lot of myself.",
"We know we're getting old when the only thing we want for our birthday is not to be reminded of it.",
"Happy birthday on your very special day, I hope that you don't die before you eat your cake."
];

var serialPort = new SerialPort("/dev/tty.wwan", {
  baudrate: 230400,
  dataBits:8,
  stopBits:1,
  flowControl:false
}, true);

serialPort.on("open", function () {
  var fullData="";
  serialPort.on('data', function(data) {
    console.log("MODEM: "+data);
    fullData+=data;

    if(fullData.indexOf("OK")>-1){
      var obj={
        code:fullData.toString().split("=")[0],
        result:fullData.toString().split("\n")[1]
      };
      fullData="";
      stateMachine(obj);
    }

    if(fullData.indexOf(">")>-1){
      var rand=getRandomArbitrary(0,10);
      var message=quotes[rand];
      serialPort.write(message+String.fromCharCode(26));
      fullData="";
    }
  });
  serialPort.write("AT+CMGF=1"+String.fromCharCode(13));
});
function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
var stateMachine= function(data){
  console.log(data);
  switch(data.code){
  case "AT+CMGF":
    serialPort.write("AT+CSMP=17,167,0,0"+String.fromCharCode(13));
    break;
  case "AT+CSMP":
    serialPort.write("AT+CMGS=\"0040723721183\""+String.fromCharCode(13));
    break;
  }
  if(data.code.indexOf("+CMGS")>-1)
    serialPort.write("AT+CMGS=\"0040723721183\""+String.fromCharCode(13));
}
