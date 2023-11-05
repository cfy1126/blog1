const querystring = require("querystring");
const { get, set } = require('./src/db/redis');
const handleBlogRouter = require("./src/router/blog");
const handleUserRouter = require("./src/router/user");

// 获取cookie的过期时间
const getCookieExpires = () => {
    const d = new Date();
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
    console.log('d.toGMTString() is ', d.toGMTString());
    // GMT格式
    return d.toGMTString();
}

// session 数据
// const SESSION_DATA = {};

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

    // 解析session 使用redis
    let needSetCookie = false;
    let userId = req.cookie.userId;
    if (!userId) {
        needSetCookie = true;
        userId = `${Date.now()}_${Math.random()}`;
        // 初始化redis中的session值
        set(userId, {});
    }
    // 获取session
    req.sessionId = userId;
    get(req.sessionId).then(sessionData => {
        if (sessionData == null) {
            // 初始化 redis 中的 session 值
            set(req.sessionId, {});
            // 设置 session
            req.session = {};
        } else {
            // 设置 session
            req.session = sessionData;
        }
        console.log('req.session ', req.session);

        // 处理 post data
        return getPostData(req);
    })
    .then((postData) => {
        req.body = postData;
        // 处理blog路由
        const blogResult = handleBlogRouter(req, res);
        if (blogResult) {
            blogResult.then(blogData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userId=${userId};path=/;httpOnly;expires=${getCookieExpires()}`)
                }
                res.end(JSON.stringify(blogData));
            })
            return;
        }

        // 处理user路由
        const userData = handleUserRouter(req, res);
        if (userData) {
            userData.then(userData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userId=${userId};path=/;httpOnly;expires=${getCookieExpires()}`)
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
