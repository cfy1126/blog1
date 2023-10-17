const getList = (author, keyword) => {
    // 先返回假数据 （格式是正确）
    return [
        {
            id: 1,
            title: "标题A",
            content: "内容A",
            createTime: 1546610491112,
            author: "zhangsan",
        },
        {
            id: 2,
            title: "标题B",
            content: "内容B",
            createTime: 1546610491112,
            author: "lisi",
        },
        {
            id: 3,
            title: "标题C",
            content: "内容C",
            createTime: 1546610491112,
            author: "wangwu",
        },
    ];
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
