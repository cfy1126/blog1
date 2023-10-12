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

module.exports = {
    getList,
    getDetail
};
