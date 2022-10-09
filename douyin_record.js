const moment = require('moment');
const request = require("request")
const fs = require('fs');

let data = [];
!(async () => {
    data = fs.readFileSync('./douyin_record.json', 'UTF-8').toString();
    data = JSON.parse(data);

    fs.exists("./douyin", function (exists) {
        //console.log(exists ? "创建成功" : "创建失败");
        if (!exists) fs.mkdirSync("./douyin");
    });

    main();
    setInterval(async () => {
        main();
    }, 1000 * 30);

})().catch((e) => {
    console.log("\r\n❌失败! 原因: " + e + "!");
}).finally(() => {

});

async function main() {
    try {

        for (let iterator of data) {
            if (!iterator.status) iterator.status = 0;
            down(iterator);
        }
    } catch (error) {
        console.log('error111:' + error);
    }
}

async function down(user) {
    try {

        let option = {
            method: "GET",
            url: 'https://live.douyin.com/' + user.roomid,
            headers: {
                'cookie': 'ttwid=1%7CocLTvuebNS1CoiuPVjyiKuMQFemtAaip0SNLkBkb8mY%7C1654164276%7C6703334c9acea626ab0bdd4e1909a8bbed3d0e090e4868414946591a67fb985c; odin_tt=e9316bbab8c21e1bb1af5bc83e306d3f3d8b4b2936fcb00308f4313360594d9516235e6c803a35ec1ebb70d2fdb759b594a8efd4494e39c70e5c65aff578a498; xgplayer_user_id=639743819245; ttcid=0a9453807da74f6294588dcbf6b0b27672; passport_csrf_token=ec6605fffb8c3ff2838b84c24baf6d3e; passport_csrf_token_default=ec6605fffb8c3ff2838b84c24baf6d3e; csrf_session_id=1a499dae486f8685592de55078f0332c; SEARCH_RESULT_LIST_TYPE=%22single%22; download_guide=%223%2F20220920%22; strategyABtestKey=1663834198.091; home_can_add_dy_2_desktop=%221%22; __ac_nonce=0632c185d00d615681cb; __ac_signature=_02B4Z6wo00f011Osi7AAAIDCMKZL2PoqDJdTjI8AALfSFYLTTkovjkKPWrSe7fXHSwNw4ghOjw25NbI7qFzaDpeQfhCOtPU7nB7TSTIas.L1US3e03jhSZR8Gy27gwJVSrPXu0i5UA5mWI3J6a; live_can_add_dy_2_desktop=%221%22; tt_scid=gpCIOHtknqrUnNYk5MiMW9grJIHFiV7GFUHNeu.FbwKLYv9gg-nqbFCFpFVc-YcQd0c0; msToken=INr_8mY3LRri-ZMrFw2MUBzFSsrVCvNvWO8KZgXMBN68CK5vRAY-uaJ0pC-4hbIbTPGWlHyHMfKoKyDXk2EdqjOFn3XJY2S3i_C7Zoy7_Utu6HDUun-w; msToken=56idsPYRrJocMLWvWZSb70NrakxoCvcxko2lwUNHwUVtDv3jI-UU35rzndIkL4taxRWzBB9DCkEPG3lWuI15Oqk-Aq0dSqzYS5qhwKXAtI52RpJU8dAe',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
            }
        };
        request(option, (error, response, body) => {
            try {
                let RENDER_DATA = body.match(/<script id=\"RENDER_DATA\" type=\"application\/json\">.*?<\/script>/);
                RENDER_DATA = RENDER_DATA[0].replace('<script id="RENDER_DATA" type="application/json">', '').replace('</script>', '');
                RENDER_DATA = JSON.parse(decodeURIComponent(RENDER_DATA));

                if (RENDER_DATA?.app?.initialState?.roomStore?.roomInfo?.room?.status == 2 && user.status == 0) {
                    user.status = 1;
                    console.log(user.name + ':开始下载!');
                    let url = RENDER_DATA.app.initialState.roomStore.roomInfo.room.stream_url.flv_pull_url.FULL_HD1;
                    let videoName = RENDER_DATA.app.initialState.roomStore.roomInfo.room.owner.nickname;
                    let title = RENDER_DATA.app.initialState.roomStore.roomInfo.room.title;
                    let file_name = `${moment().format('YYYY-MM-DD HH-mm-ss')}[${videoName}-${title}].flv`;
                    downloadFile(url, './douyin/' + file_name);
                }
                if (RENDER_DATA?.app?.initialState?.roomStore?.roomInfo?.room?.status != 2) {
                    user.status = 0;
                    console.log(user.name + ':未开播!');
                }
            } catch (error) {
                console.log('error:' + error);
            }
        })
    } catch (error) {
        console.log('error222:' + error);
    }
}

function showProgress(received, total) {
    //var percentage = (received * 100) / total;
    //console.log(percentage + "% | " + received + " bytes out of " + total + " bytes.");

    if (((received / 1000000).toString().split('.')[0]) % 10 == 0) {
        console.log(received / 1000000 + 'M');
    }
}

function downloadFile(file_url, targetPath) {
    try {
        // Save variable to know progress
        var received_bytes = 0;
        var total_bytes = 0;

        var req = request({
            method: 'GET', uri: file_url
        });

        var out = fs.createWriteStream(targetPath);
        req.pipe(out);

        req.on('response', function (data) {
            // Change the total bytes value to get progress later.
            total_bytes = parseInt(data.headers['content-length']);
        });

        req.on('data', function (chunk) {
            // Update the received bytes
            received_bytes += chunk.length;

            showProgress(received_bytes, total_bytes);
        });

        req.on('end', function () {
            console.log('下载成功')
        });
    } catch (error) {
        console.log('error333:' + error);
    }

}

