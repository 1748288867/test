// 特效
window.onload = function () {
  // 轮播图
  var lunbo = document.getElementById('lunbo');
  var pre = document.getElementById('pre');
  var next = document.getElementById('next');
  var list = document.getElementById('list');
  var dot = document.getElementById('dot').getElementsByTagName('span');
  var index = 1;
  var timer;
  var animated = false;

  // 上一张
  pre.onclick=function(){
    if (!animated) {
    if (index==1) {
      index=5;
    }else {
      index -=1; 
    }
    showDot();
      animation(540);
    }
  };
  // 下一张
  next.onclick=function(){
    if (!animated) {
      if (index==5) {
        index=1;
      }else {
        index +=1; 
      }    
      showDot();
      animation(-540);
    }
  };
  // 点击焦点切换
  for (var i = 0; i < dot.length; i++) {
    dot[i].onclick=function(){
      if (this.className=="on") {
        return;
      }
      var myIndex=parseInt(this.getAttribute("index"));
      var offset=-540*(myIndex-index);
      if (!animated) {
        animation(offset);
      }
      index=myIndex;
      showDot();
    
    }
  }
      
  function play(){
    timer=setInterval(function(){
      next.onclick();
    },2000);
  }
  function stop(){
    clearInterval(timer);
  }
  play();
  lunbo.onmouseover=stop;
  lunbo.onmouseout=play;
  
  // 动画函数
  function animation(offset) {
    var time = 500;  // 总时长
    var inteval = 10;
    var speed = offset / (time / inteval);
    animated = true;
    var newLeft = parseInt(list.style.left) + offset;

    function go() {
      if (speed > 0 && parseInt(list.style.left) < newLeft || (speed < 0 && parseInt(list.style.left) > newLeft)) {
        list.style.left = parseInt(list.style.left) + speed + 'px';
        setTimeout(go, inteval);
      } else {
        animated = false;
        if (newLeft > -540) {
          list.style.left = -2700 + 'px';
        }
        if (newLeft < -2700) {
          list.style.left = -540 + 'px';
        }
      }
    }
    go();
  }
  // 焦点跟随
  function showDot() {
    for (var i = 0; i < dot.length; i++) {
      if (dot[i].className == 'current') {
        dot[i].className = '';
        break;
      }
    }
    dot[index - 1].className = 'current';
  }



  // 选项卡
  var lis = document.getElementsByClassName("general_bar_li");
  var line = document.getElementById("general_bar_line");
  var content = document.getElementsByClassName("general_content")[0];
  var container = document.getElementById("general");
  for (var i = 0; i < lis.length; i++) {
    (function(i) {
      lis[i].onclick = function() {
        $this = event.target;
        var index = Number($this.getAttribute("data-index"));

        var lineWidth = Number(window.getComputedStyle(line, null).width.split("px")[0])
        line.style.transform = "translateX(" + lineWidth * 1.35 * index + "px)";

        var containerWidth = Number(window.getComputedStyle(container, null).width.split("px")[0])
        content.style.transform = "translateX(" + -containerWidth * 1 * index + "px)";
      }
    })(i)
  }



  // 数据图表
  var chart1 = echarts.init(document.getElementById('graph'));    // 曲线图
  var chart2 = echarts.init(document.getElementById('pieChart'));    // 饼状图
  var chart3 = echarts.init(document.getElementById('columnChart'));    // 柱形图

  // 曲线图
  var option1 = {
    series: {
      type: 'line',
      smooth: true,
      data: [],
      areaStyle: {},  // 面积阴影
      itemStyle: {
        normal: {  // 折线样式
          label: { show: true },  // 折点显示数值
          color:'rgb(82, 178, 243)'
        },
      },
      
    },
    tooltip : {//鼠标浮动时的工具条
      trigger: 'axis'
    },
    legend: {// 图例，每条折线或者项对应的示例
      data:[]
    },
    calculable : true,
    xAxis: [
      {
        type: 'category',
        axisLine: {  // 主轴
          lineStyle: {
            color: '#999',
            type:'dashed'
          },
        },
        axisTick: {  // 隐藏坐标轴上的小点
          show: false
        },
        data: []
      }
    ],
    yAxis: {
      splitLine: { // 网格线
        show: true,
        lineStyle: {
          color: ['#999'],
          width: 1,
          type: 'dashed',
        }
      },
      axisLine: { show: false }, // 隐藏坐标轴
      axisTick: {  // 隐藏坐标轴上的小点
        show: false
      },
    },
    
  }
  $.ajax({
    url: 'https://edu.telking.com/api/?type=month',
    type: 'get',
    dataType: 'json',
    success: function (jsons) {
      var item = function () {
        return {
          type: 'line',
          label: { normal: { position: 'top' } },
          markLine: { data: [{ type: 'average', name: '平均值' }] },
          data: []
        }
      };
      // var legends = [];// 存放图例数据  
      // var Series = []; // 存放图表数据  
      var json = jsons.data;// 后台返回的json  
      console.log(json)

      option1.xAxis[0].data = json.xAxis;// 这一步是设置X轴数据了   
      option1.series.data = json.series;// 设置图例   
      console.log(option1.xAxis[0].data);

      chart1.setOption(option1);// 重新加载图表  
    },
    error: function () { }
  })
  chart1.setOption(option1);

  // 饼状图
  var option2 = {
    series: {
      name: '星期',
      type: 'pie',
      radius: '55%',
      data: [
        {value:120,name:'Mon'},
        {value:120,name:'Tue'},
        {value:100,name:'Wed'},
        {value:50,name:'Thu'},
        {value:500,name:'Fir'},
        {value:400,name:'Sat'},
        {value:440,name:'Sun'},
      ]
    }
  }
  chart2.setOption(option2);

  // 柱形图
  var option3 = {
    color: ['#259af9'],
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisLine: {  // 主轴
        lineStyle: {
          color: '#999',
          type:'dashed'
        },
      },
      axisTick: {  // 隐藏坐标轴上的小点
        show: false
      },
    },
    yAxis: {
      type: 'value',
      name: '商品数',
      splitLine: { // 网格线
        show: true,
        lineStyle: {
          color: ['#999'],
          width: 1,
          type: 'dashed',
        }
      },
      axisLine: { show: false }, // 隐藏坐标轴
      axisTick: {  // 隐藏坐标轴上的小点
        show: false
      },
    },
    series: [{
      data: [9, 11, 13, 10, 8, 13, 5],
      type: 'bar',
      barWidth: 30,
    }]
  }
  chart3.setOption(option3);
}