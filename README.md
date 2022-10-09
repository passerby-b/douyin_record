# douyin_record
抖音录播

跨平台,支持windows,linux,macos,下面以windows为例:  

1.安装nodejs运行环境,去nodejs官网下载对应的版本安装  
2.下载源代码到本地,按住shift键鼠标右键->在此处打开命令窗口  
3.输入npm install安装所有的依赖包  
4.打开网页版的抖音,搜索你需要录制的主播名,复制ta的抖音号写在douyin_down.json文件里  
5.在命令窗口输入node douyin_down.js开始录制  
6.如果需要挂后台运行,在命令窗口输入npm install pm2 -g 安装pm2后台挂起模块,再输入pm2 start douyin_down.js --name douyin 就可以挂后台运行了  
