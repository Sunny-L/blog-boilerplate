网络安全是互联网开发中的一个很重要的问题，当公司业务体量比较小时，安全显得并不那么重要。但随着业务发展，业务壮大，网络安全显得越来越重要。

前端的网络安全作为最前面的一层防护，以有效的抵挡大部分的攻击。今天聊聊做活动时需要对接口参数加密的问题。

问题背景: 某个抽奖活动接口前端ajax可以直接发送，而不需要用户操作完成所有步骤，导致黑客可以直接起请求获得奖品。‘

安全处理: 对ajax请求参数做加密处理。这里我们利用的是[jencrypts](https://github.com/travist/jsencrypt)来做加解密操作。

生成公钥与私钥
```
## 公钥
openssl genrsa -out rsa_1024_priv.pem 1024
## 私钥
openssl rsa -pubout -in rsa_1024_priv.pem -out rsa_1024_pub.pem
```

这里也提供了一个[在线生成](http://travistidwell.com/jsencrypt/demo/)的方式

前端加密

```
    var publicKey = '取生成的公钥'
    var val = document.querySelector('#value').value
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    val = encrypt.encrypt(val)
```

Node层解密

```
    const privateKey = '取生成的私钥'
    const JSEncrypt = require('node-jsencrypt')
    const decrypt = new JSEncrypt()
    decrypt.setPrivateKey(privateKey)
    let val = decrypt.decrypt(req.body.val)
    # 发送请求参数给api层
```