const querystring = require("querystring");
const handleBlogRouter = require("./src/router/blog");
const handleUserRouter = require("./src/router/user");

// 获取cookie的过期时间
const getCookieExpires = ()=>{
    const d = new Date();
    d.setTime(d.getTime() + (24*60*60*1000));
    console.log('d.toGMTString() is ', d.toGMTString());
    // GMT格式
    return d.toGMTString();
}

// session 数据
const SESSION_DATA = {};

// 用于处理 post data
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        if (req.method !== "POST") {
            resolve({});
            return;
        }
        if (req.headers["content-type"] !== "application/json") {
            resolve({});
            return;
        }
        let postData = "";
        req.on("data", (chunk) => {
            postData += chunk.toString();
        });
        req.on("end", () => {
            if (!postData) {
                resolve({});
                return;
            }
            resolve(JSON.parse(postData));
        });
    });
    return promise;
};

const serverHandle = (req, res) => {
    // 设置返回格式
    res.setHeader("Content-type", "application/json");

    // 获取 path
    req.path = req.url.split("?")[0];

    // 解析query
    req.query = querystring.parse(req.url.split("?")[1]);

    // 解析cookie
    req.cookie = {};
    const cookieStr = req.headers.cookie || ''; // k1=v1;k2=v2;k3=v3
    cookieStr.split(';').forEach(item => {
        if (!item) {
            return;
        }
        const arr = item.split('=');
        const key = arr[0].trim();
        const val = arr[1].trim();
        req.cookie[key] = val;
    })

    // 解析session
    let needSetCookie = false;
    let userId = req.cookie.userId;
    if (userId) {
        if (!SESSION_DATA[userId]) {
            SESSION_DATA[userId] = {};
        } 
    }else{
        needSetCookie = true;
        userId = `${Date.now()}_${Math.random()}`;
        SESSION_DATA[userId] = {};
    }
    req.session = SESSION_DATA[userId] || {};
    

    // 处理 post data
    getPostData(req).then((postData) => {
        req.body = postData;
        // 处理blog路由
        const blogResult = handleBlogRouter(req, res);
        if (blogResult) {
            blogResult.then(blogData => {
                if(needSetCookie){
                    res.setHeader('Set-Cookie',`userId=${userId};path=/;httpOnly;expires=${getCookieExpires()}`)
                }
                res.end(JSON.stringify(blogData));
            })
            return;
        }

        // 处理user路由
        const userData = handleUserRouter(req, res);
        if (userData) {
            userData.then(userData => {
                if(needSetCookie){
                    res.setHeader('Set-Cookie',`userId=${userId};path=/;httpOnly;expires=${getCookieExpires()}`)
                }
                res.end(JSON.stringify(userData));
            })
            return;
        }

        // 未命中路由，返回 404
        res.writeHead(404, { "Content-type": "text/plain" }); // 返回的是纯文本
        res.write("404 Not Found\n");
        res.end();
    });
};

module.exports = serverHandle;

//process.env.NODE_ENV
