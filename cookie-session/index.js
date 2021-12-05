// cookie的基本介绍
/* 
一、什么是cookie
我们在浏览器中，经常涉及到数据的交换，比如你登录邮箱，登录一个页面。我们经常会在此时设置30天内记住我，或者自动登录选项。那么它们是怎么记录信息的呢，答案就是今天的主角cookie了，Cookie是由HTTP服务器设置的，保存在浏览器中，但HTTP协议是一种无状态协议，在数据交换完毕后，服务器端和客户端的链接就会关闭，每次交换数据都需要建立新的链接。
从JavaScript的角度看，cookie 就是一些字符串信息。这些信息存放在客户端的计算机中，用于客户端计算机与服务器之间传递信息。
在JavaScript中可以通过 document.cookie 来读取或设置这些信息。由于 cookie 多用在客户端和服务端之间进行通信，所以除了JavaScript以外，服务端的语言（如PHP）也可以存取 cookie。
**

二、cookie的基础知识
cookie 是有大小限制的，每个 cookie 所存放的数据不能超过4kb，如果 cookie 字符串的长度超过4kb，则该属性将返回空字符串。
由于 cookie 最终都是以文件形式存放在客户端计算机中，所以查看和修改 cookie 都是很方便的，这就是为什么常说 cookie 不能存放重要信息的原因。
每个 cookie 的格式都是这样的：<cookie名>=<值>；名称和值都必须是合法的标示符。
cookie 是存在 有效期的。在默认情况下，一个 cookie 的生命周期就是在浏览器关闭的时候结束。如果想要 cookie 能在浏览器关掉之后还可以使用，就必须要为该 cookie 设置有效期，也就是 cookie 的失效日期。
alert(typeof document.cookie)　　结果是 string
cookie 有域和路径这个概念。域就是domain的概念，因为浏览器是个注意安全的环境，所以不同的域之间是不能互相访问 cookie 的(当然可以通过特殊设置的达到 cookie 跨域访问)。路径就是routing的概念，一个网页所创建的 cookie 只能被与这个网页在同一目录或子目录下得所有网页访问，而不能被其他目录下得网页访问。
其实创建cookie的方式和定义变量的方式有些相似，都需要使用 cookie 名称和 cookie 值。同个网站可以创建多个 cookie ，而多个 cookie 可以存放在同一个cookie 文件
 */

// 一个域最多可以存储20条cookie，浏览器最多存储300条cookie
// http请时会自动带上请求域的cookie，会增加请求体积消耗带宽。
// 登录a网站后跳到b网站，在b网站请求a的接口会自动带上a域的cookie(浏览器中已经有了a的cookie)，这种操作俗称crsf跨域伪造请求。

// 原生操作cookie
  // document.cookie获取cookie时，只是返回对应的key和value，不会返回其它配置，但是可以手动修改其他配置(httpOnly为false的情况下)
  function getAllCookie(cname){
    var allCookie = {};
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        const getport = ca[i].split('=');
        allCookie[getport[0]] = getport[1];
    }
    return allCookie;
  }
  // 设定cookie时，默认expires为session关闭页面自动清除，domain为当前页面域，path为当前访问路径，priority(清除优先级)为Medium，
  // httpOnly为false用户可操作，Secure为false不用完全协议就可传输，sameSite默认可通过其他站点访问携带
  function setCookie(cname,cvalue,exdays){
    var d = new Date();
    d.setTime(d.getTime()+(exdays*24*60*60*1000));
    var expires = "expires="+d.toGMTString(); // 注意为toGMTString时间
    document.cookie = cname+"="+cvalue+"; "+expires;
  }

  function getCookie(cname){
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name)==0) { return c.substring(name.length,c.length); }
    }
    return "";
  }
  function getCookie(name)
  {
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
    return unescape(arr[2]) || decodeURIComponent(arr[2])
    else
    return null;
  }

  function checkCookie(){
    var user=getCookie("username");
    if (user!=""){
        alert("欢迎 " + user + " 再次访问");
    }
    else {
        user = prompt("请输入你的名字:","");
          if (user!="" && user!=null){
            setCookie("username",user,30);
        }
    }
  }
  // 删除cookie就是将cookie的国企时间设置为0或者负数或者以前的时间。删除cokie时可以不指定cookie的值,设定size为0也是可以的
  function delCookie(name)//删除cookie
  {
     document.cookie = name+"=;expires="+(new Date(0)).toGMTString();
  }

// react-cookie 及 vue-cookie