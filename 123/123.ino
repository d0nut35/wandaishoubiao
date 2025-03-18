#define LED_BUILTIN 2 
#include <ESP8266WiFi.h>

const char* ssid = "123";
const char* password = "12345678";

const char* host = "43.139.43.195";
const int port = 9002;//demo1 tcp 使用 9002端口

const char* id = "abc";
int tick = 1000;

WiFiClient client;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  pinMode(LED_BUILTIN,OUTPUT);
  //连接WIFI
  WiFi.begin(ssid, password);
  //设置读取socket数据等待时间为100ms
  client.setTimeout(100);

   //等待WIFI连接成功
  while (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi connecting...");
    delay(500);
  }
  Serial.println("WiFi connected!.");
  
}

void loop() {
  // put your main code here, to run repeatedly:
  if (client.connect(host,port))
  {
    Serial.println("host connected!");
    //发送第一条TCP数据，发送ID号
    client.print(id);
  }
  else
  {
    // TCP连接异常
    Serial.println("host connecting...");
    delay(500);
  }

    while (client.connected()) {
    //      接收到TCP数据
    if (client.available())
    {
      String line = client.readStringUntil('\n');
      if (line == "1") {
        Serial.println("command:open led.");
        digitalWrite(LED_BUILTIN, LOW);
        client.print("OK");
      }
      else if (line == "0") {
        Serial.println("command:close led.");
        digitalWrite(LED_BUILTIN, HIGH);
        client.print("OK");
      }
    }
    else {
      //若没收到TCP数据，每隔一段时间打印并发送tick值
      Serial.print("tem:");
      Serial.println(tick);
      client.print(tick);
      tick++;
      delay(1000);
    }
  }

}
