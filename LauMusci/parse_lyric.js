// 解析歌词函数，并包装在数组里
export function parseLyric(lyricString) {
    const lyricInfos = []
    // 1.对歌词的换行符作分割
    const lyricStrings = lyricString.split("\n")
    // 2.拿到每一行的歌词
    // 3.先用正则表达式截取每一行的时间文本
    const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/ //以[00:58.65]为例
    for (const lineString of lyricStrings) {
        // 对每一行歌词执行正则匹配
        const timeResult = timeRegExp.exec(lineString)
        // 匹配到空字符(空格)则跳过
        if(!timeResult) continue

        // 将结果分别保存为分、秒、毫秒，然后包装
        const minute = timeResult[1] * 60 * 1000
        const second = timeResult[2] * 1000
        // 对于有的毫秒数会显示两位，这里需要判断，对只有两位数的要再乘10
        const millsecondTime = timeResult[3]
        const millsecond = millsecondTime.length === 2 ? millsecondTime * 10 : millsecondTime * 1
        const time = minute + second + millsecond

        // 4.获取歌词文本
        const lyricText = lineString.replace(timeRegExp,"") //replace(参数一，参数二)方法：参数一为被替换字符，参数二为替换后字符
        
        //5.将解析好的歌词文本与时间文本包装在对象中，然后将对象放进数组返回
        lyricInfos.push({time,lyricText})
    }
    return lyricInfos
}