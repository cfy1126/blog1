const { exec } = require('../db/mysql');

const getList = (author, keyword) => {
    let sql = `select * from blogs where 1=1 `;
    if (author) {
        sql += `and author=${author}`;
    }
    if (keyword) {
        sql += `and title like '%${keyword}%`;
    }
    sql += `order by createtime desc;`;

    // 返回promise
    return exec(sql);
};

const getDetail = (id) => {
    // 先返回假数据
    return {
        id: 1,
        title: "标题A",
        content: "内容A",
        createTime: 1546610491112
    };
};

const newBlog = (blogData = {}) => {
    // blogData 是一个博客对象，包含 title content 属性
    return {
        id: 3 // 表示新建博客，插入到数据列表中
    }
}

const updateBlog = (id, blogData = {}) => {
    // id 就是要更新博客的 id
    // blogData 是一个博客对象，包含 title content 属性
    return true
}

const delBlog = (id) => {
    // id 就是要更新博客的 id
    console.log(id);
    return true
}
module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
};
