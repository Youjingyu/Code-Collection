## 接入 facebook 第三方授权登录经验

> 公司很多项目都有出海谋求进一步增长的需求，为了在海外环境下方便用户登录，接入 facebook、google 等用户基数非常大的第三方账号也就成了自然而然的需求，这篇文章就对 facebook 的授权登录流程做一个梳理。

其实 facebook 对第三方授权登录有比较详尽的[登录文档](https://developers.facebook.com/docs/facebook-login)，针对常见的平台，比如 android、ios、web，都有现成的 sdk，非常方便接入。针对想接入 facebook 账号体系的客户端应用，如果引入客户端 sdk ，会增加 app 包体积，如果应用对包体积比较敏感，则不太能接受。因此我们今天主要使用[手动构建登录流程](https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow)的方式，这种方式不需要接入客户端 sdk，并且可以利用 web 的灵活性。

### 创建 app 并配置重定向 url

facebook 支持多种环境下的登录方式，不管哪种方式都需要我们有一个 facebook 账号，facebook 账号注册流程就不赘述了，注册好账号后，在[应用面板](https://developers.facebook.com/apps)中创建一个 app，注意，app 的名字会在认证时展示给用户，所以一定要取一个正式的名字。

创建 app 后，我们点击[应用面板](https://developers.facebook.com/apps)中的 app 进入控制面板，然后在 `添加产品` 部分设置 `facebook 登录`，我们只需要设置 `有效 OAuth 跳转 URI` 就行了，其它配置你可以视情况自行配置，在开发阶段，为了方便调试，你可以将跳转 URI 设置为本地地址，比如 `https:localhost:8080`，注意就算是本地地址，也必须是 https 地址。

### 引导用户登录

用户在你的 app 种点击登录按钮后，app 需要打开 webview 加载如下的 url 从而进入 facebook 的登录流程：

```bash
https://www.facebook.com/v3.2/dialog/oauth?
  client_id={app-id}
  &redirect_uri={redirect-uri}
  &state={state-param}
  &response_type={type}
  &scope={scope}
```

url 参数意义如下：

- client_id：是创建 app 时分配的应用 id，直接在[应用面板](https://developers.facebook.com/apps)中就可以查看
- redirect_uri：上面配置的 `有效 OAuth 跳转 URI`
- state：跳转到你配置的 `有效 OAuth 跳转 URI` 时，facebook 会在 URI 中将该值回传给你，你可以用这个值验证，用户确实是从你的 app 跳转过来的，避免跨站请求伪造。这个值取决于你的安全性要求，你不处理，facebook 也不会有任何警告。比如 uc mini 就没有处理这个值。
- response_type：可选，具体取值你可以查看[文档](https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow#login)，我们使用默认值就行了
- scope：可选，要向应用用户请求的权限列表，列表项目以逗号或空格分隔。你可以不传这个值，默认情况下就能拿到 id、email、name、first name、last name、picture，但如果需要其他权限，需要显示地声明，并且需要通过 facebook 审核，详见[权限参考文档](https://developers.facebook.com/docs/facebook-login/permissions/#----)。另外，由于用户可能是通过手机号码注册的， email 不一定能拿到。

app 打开上述 url 后，会进入 facebook 的登录流程，用户完成登录后，就会重定向到我们配置的 URI，到我们的页面后，前端通过 js 拿到页面参数中的 code，然后通过 hybrid 或者其它方式将 code 传给客户端，客户端再拿着 code 到服务端换取用户信息。

### 获取 access_token 与用户信息

因为这一步需要用到 app 密匙，而密匙是不能暴露在前端或者客户端的，所以这一步必须在服务器进行。客户端带着上一步获取到的 code，请求服务器接口，服务器再通过如下 url 请获取 access_token：

```bash
https://graph.facebook.com/v3.2/oauth/access_token?
   client_id={app-id}
   &redirect_uri={redirect-uri}
   &client_secret={app-secret}
   &code={code-parameter}
```

参数意义：

- client_id：同上
- redirect_uri：同上
- client_secret：app 密匙，在 `app 控制面 > 设置 > 基本` 里可以查看
- code：上一步获取到的 code

拿到 access_token 后就可以去获取用户信息了，请求如下 url 即可：

```bash
https://graph.facebook.com/v3.2/me?
   access_token={access_token}
   &fields={id,email,name,name_format,middle_name,first_name,picture}
```

- 参数意义：

- access_token：上一步拿到的 token
- fields：需要获取的用户信息字段

> 注意，从上面的流程可以看出，其实在用户完成登录后，会跳转到我们配置的页面，这个页面是请求我们的服务器后输出的，服务器完全可以在这一步就拿到 code 了，然后服务器就可以去请求用户信息了，但是请求结果我们只能输出到页面中，然后再通过页面 js 代码传递给客户端，因为我们想将 access_token 传给客户端，但又不希望直接在页面中输出 access_token 等敏感信息，因此采用了客户端拿着 code 去请求服务端接口的方式（我们的客户端和服务器之间有 rpc 通道）。

### 登出

官方文档只是说退出时，由我们自己清除我们自己保存的用户登录标识，并没有说明如何清除 facebook 登录标识；如果不清除 facebook 的登录标识，用户再次登录时，在 facebook 的登录流程中会直接登录成功，不需要输入用户名、密码，给用户的感觉就是完全没有登出。

解决上述问题的一个粗暴方式是直接清除 facebook 域名下的 cookie（https://facebook.com、https://m.facebook.com、https://staticxxx.facebook.com 下的 cookie 最好都清除了），因为我们的 app 是浏览器，这样做会导致用户使用我们的浏览器在网页中登录的 facebook 账户也登出了，因此我们不能使用这种方式。

那要怎么登出呢？还有一种方式是，访问如下的 url 也能能够登出：

```bash
https://www.facebook.com/logout.php?
  access_token={token}
  next={redirect-url}
```

参数意义：

- access_token：上面步骤中获取到的 token
- next：必须是我们在上面配置的 `有效 OAuth 跳转 URI`

通过上述的方式其实和清除 cookie 的方式差不多，仍然会导致用户在其它网页中登录的 facebook 账号登出。

经过各种搜索，都没有找到合适的方式，只能借助于 facebook 的网页 sdk 了。最开始我们不想引入 sdk，我们只需要模拟 sdk 的行为就行了；但在查看 sdk 的源码以及登出时的请求后，发现要模拟非常麻烦，而且各种参数易于出错，鉴于 facebook 的网页 sdk 只有 1.9 KB，引入 sdk 完全可以接受，我们就直接使用这个 sdk 好了。

代码如下：

```html
<!DOCTYPE html>
<html>
<head>
<title>Facebook Logout</title>
<meta charset="UTF-8">
</head>
<body>
  <script>
    window.fbAsyncInit = function() {
      FB.init({
        appId      : '{your-app-id}', // app id
        version    : 'v3.2' // api 版本，我们使用的最新版本：v3.2
      });
      // 检查登录状态
      FB.getLoginStatus(function(response) {
        console.log(response)
        // 如果是登录状态，执行登出
        if (response.status === 'connected') {
          FB.logout(function(response) {
            console.log(response)
          });
        }
      });
    };
  </script>
  <script src="https://connect.facebook.net/en_US/sdk.js"></script>
</body>
```

这里有两个坑：

- 调用 `FB.logout` 会报错 `Refused to display 'https://www.facebook.com/home.php' in a frame because it set 'X-Frame-Options' to 'deny'`，需要在 `app 控制面板 设置 > 基本 > 添加平台 > 网站` 中添加执行 `FB.logout` 方法的域名才能退出。
- 不能在 `localhost` 域名下调用 `FB.logout` ，否则刷新页面后，用户仍旧是登录状态。你可以本地绑定 host，然后换一个域名测试即可。