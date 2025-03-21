 //const tcpServer = require("../../bin/tcp-server");
 //const xyData = tcpServer.xyDATA;

//const { xyDATA } = require("../../bin/tcp-server");
// const host =window.location.host

// var equipmentId = window.location.pathname.split("/")[2] || "123456"

// const socket = new WebSocket('ws://'+host);

// // 如果建立连接
// socket.onopen=function () {
//   console.log("websocket connect!")
//   var data = JSON.stringify({equipmentId:equipmentId})
//   socket.send(data)
// }

// // 监听接收数据
// socket.onmessage=function (msg) {
//   console.log("-->",msg.data)
//   try {
//     // 将JSON字符串反转为JSON对象npm start
//     var data = JSON.parse(msg.data)
//     data.forEach(function (d) {
//       //将接收到的数据 更新到echart图表里
//       updateMyChart(d.time,d.value)
//     });
//   } catch (error) {
//     console.log('error:',error)
//   }
// }

function getXYData() {
  var httpRequest = null;
  if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
      httpRequest = new XMLHttpRequest();
  } else if (window.ActiveXObject) { // IE 6 and older
      httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
  }

  httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === 4 && httpRequest.status === 200) {
          var xyDATA = JSON.parse(httpRequest.responseText);
          updateMyChart1(xyDATA);
          updateMyChart2(xyDATA);
      }
  };
  httpRequest.open('GET', '/xyDATA');
  httpRequest.send();
}


// 基于准备好的 DOM，初始化第一个 ECharts 实例
var myChart1 = echarts.init(document.getElementById('chart1'));

// 指定第一个图表的配置项和数据
var option1 = {
    title: {
        text: '心率'
    },
    xAxis: {
        type: 'category',
        data: []
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: [],
        type: 'line',
        smooth: true
    }]
};

// 使用刚指定的配置项和数据显示第一个图表
myChart1.setOption(option1);

function updateMyChart1(xyDATA) {
  var time = new Date();
  var xinglv = xyDATA[0];
  option1.xAxis.data.push(time.getHours() + ":" + time.getMinutes() + ':' + time.getSeconds());
  option1.series[0].data.push(xinglv);

  if (option1.xAxis.data.length > 8) {
      option1.xAxis.data.shift();
      option1.series[0].data.shift();
  }
  myChart1.setOption(option1);
}

// 基于准备好的 DOM，初始化第二个 ECharts 实例
var myChart2 = echarts.init(document.getElementById('chart2'));

// 指定第二个图表的配置项和数据
var option2 = {
    title: {
        text: '血氧'
    },
    xAxis: {
        type: 'category',
        data: []
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: [],
        type: 'line',
        smooth: true
    }]
};

// 使用刚指定的配置项和数据显示第二个图表
myChart2.setOption(option2);

function updateMyChart2(xyDATA) {
  var xueyang = xyDATA[1];
  var time = new Date();
  option2.xAxis.data.push(time.getHours() + ":" + time.getMinutes() + ':' + time.getSeconds());
  option2.series[0].data.push(xueyang);

  if (option2.xAxis.data.length > 8) {
      option2.xAxis.data.shift();
      option2.series[0].data.shift();
  }
  myChart2.setOption(option2);
}





// 获取选中设备的信息
function getEquipmentInfo() {
  var selector = document.getElementById('dev-selector');
  var str = selector.value
  if(!str){
    return console.log("无设备")
  }
  var addr = str.split(' - ')[0]
  var id = str.split(' - ')[1]
  // console.log(addr,id)
  return {
    addr:addr,
    id:id
  }
  
}

// 将下次框 选中的值 记录下来，刷新数据时再重新选上
let selectValue = null
document.getElementById('dev-selector').onchange=(val)=>{
  selectValue = document.getElementById('dev-selector').value
}

function addSelectorData(equipment) {
  // 给select 添加新数据
  var selector = document.getElementById('dev-selector');
  var option = document.createElement('option');
  // 添加这个类名是方便后面删除时定位到这些元素
  option.className = 'equipment-select-item' 
  option.innerText = equipment.addr+' - '+equipment.id
  // 若与之前选中值一样，则添加选中标记
  if(selectValue && option.innerText === selectValue){
    option.selected = 'selected'
  }

  selector.append(option)
}



function addTableData(equipment) {
    // 给table 添加新数据
    var tbody = document.createElement('tbody');
    // 添加这个类名是方便后面删除时定位到这些元素
    tbody.className = 'equipment-table-item'
    var tr = document.createElement('tr');

    var td1 = document.createElement('td');
    td1.innerText = '0'
    var td2 = document.createElement('td');
    td2.innerText = equipment.addr
    var td3 = document.createElement('td');
    td3.innerText = equipment.id
    var td4 = document.createElement('td');
    td4.innerText = equipment.lastValue
    td4.setAttribute("style", "overflow: hidden;");

    tr.append(td1)
    tr.append(td2)
    tr.append(td3)
    tr.append(td4)
    tbody.append(tr)
    var devTable = document.getElementById('dev-table');
    devTable.append(tbody)
}

function postData(equipment,actionString){
  // 发送控制指令
  if(!equipment){
    return console.log('没设备，不可发送指令')
  }
  var httpRequest = null;
  if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
    httpRequest = new XMLHttpRequest();
  } else if (window.ActiveXObject) { // IE 6 and older
      httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
  }
  var params = 'action='+actionString+'&addr='+equipment.addr+'&id='+equipment.id
  httpRequest.open('POST', '/');
  httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  httpRequest.send(params);
}

// 点击按钮事件
document.getElementById('open').onclick = ()=>{
  var equipment = getEquipmentInfo()
  postData(equipment,'open')
}

document.getElementById('close').onclick = ()=>{
  var equipment = getEquipmentInfo()
  postData(equipment,'close')
}

function getData() {
  var httpRequest = null;
  if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
    httpRequest = new XMLHttpRequest();
  } else if (window.ActiveXObject) { // IE 6 and older
      httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
  }

  httpRequest.onreadystatechange = ()=>{
    if( httpRequest.readyState === 4){
      // 0	UNSENT	代理被创建，但尚未调用 open() 方法。
      // 1	OPENED	open() 方法已经被调用。
      // 2	HEADERS_RECEIVED	send() 方法已经被调用，并且头部和状态已经可获得。
      // 3	LOADING	下载中； responseText 属性已经包含部分数据。
      // 4	DONE	下载操作已完成。

      // 删除select里的旧数据（根据类名来找到那些元素）
      var selectItems = document.getElementsByClassName('equipment-select-item')
      Array.from(selectItems).forEach(item=>{
        item.remove()
      })

      // 删除table里的旧数据（根据类名来找到那些元素）
      var tableItems = document.getElementsByClassName('equipment-table-item')
      Array.from(tableItems).forEach(item=>{
        item.remove()
      })

      var responseData = JSON.parse(httpRequest.responseText)
      responseData.forEach(equipment=>{
        // 给select 添加新数据
        addSelectorData(equipment)
        // 给table 添加新数据
        addTableData(equipment)
      })

    }
  };
  httpRequest.open('GET', '/equipmentArray');
  httpRequest.send();
}

// 马上使用一次。
getData();
getXYData();



// 每一秒轮询一次
setInterval(() => {
  getData();
  getXYData();
}, 1000);
