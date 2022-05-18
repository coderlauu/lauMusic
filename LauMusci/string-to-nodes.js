// 封装
export default function stringToNodes(keyword, value) {
    const nodes = []
    if (keyword.startsWith(value)) { //.startsWith() -> ES6之后的新方法,判断关键字是否是以某个东西开头
        // 将匹配的关键字进行切割并做样式修改
        const key1 = keyword.slice(0, value.length)
        const node1 = {
            name: "span",
            attrs: {
                style: "color:#26ce8a;font-size:15px"
            },
            children: [{
                type: "text",
                text: key1
            }]
        }
        // 将node1放进node数组中
        nodes.push(node1)
        // 将不匹配的其他字符设置默认样式
        const key2 = keyword.slice(value.length)
        const node2 = {
            name: "span",
            attrs: {
                style: "color:black;font-size:15px"
            },
            children: [{
                type: "text",
                text: key2
            }]
        }
        nodes.push(node2)
    } else { //否则没有匹配到关键字的情况
        const node3 = {
            name: "span",
            attrs: {
                style: "color:black;font-size:15px"
            },
            children: [{
                type: "text",
                text: keyword
            }]
        }
        nodes.push(node3)
    }
    return nodes
}