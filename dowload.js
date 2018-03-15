/**
 * @file download
 * @author zhangyida<zydvip@yeah.net>
 */
const http = require('http');
const fs = require('fs');

/**
 * 根据图片地址链接下载图片
 *
 * @param {string} imgUrl 图片地址
 * @param {string} imgDir 目录
 * @param {Function} cb 回调函数
 */
module.exports = async (imgUrl, imgDir) => {
    // max img size
    const maxLength = 10;
    const dir = './tmp/';
    http.request(imgUrl)
    .on('response', res => {
        if (res.headers['content-length'] > maxLength * 1024 * 1024) {
            return Promise.reject(new Error('Image too large.'));
        }
        else if (!~[200, 304].indexOf(res.statusCode)) {
            return Promise.reject(new Error('Received an invalid status code.'));
        }
        else if (!res.headers['content-type'].match(/image/)) {
            return Promise.reject(new Error('Not an image.'));
        }
        else {
            let fileType = res.headers['content-type'].split('/')[1];
            let body = '';
            res.setEncoding('binary');
            res.on('error', err => {
                return Promise.reject(err);
            })
            .on('data', chunk => {
                body += chunk;
            })
            .on('end', () => {
                // ignore windows
                const path = dir + imgDir + '/' + Math.random().toString().split('.').pop() + '.' + fileType;
                fs.stat(dir, (err, info) => {
                    if (err || !info) {
                        fs.mkdir(dir, (err, info) => {
                            if (err) {
                                return Promise.reject(err);
                            }
                            fs.writeFile(path, body, function (err, info) {
                                if (err) {
                                    return Promise.reject(err);
                                }
                                return Promise.resolve();
                            })                
                        });
                    }
                    fs.writeFile(path, body, 'binary', function (err) {
                        if (err) {
                            return Promise.reject(err);
                        }
                        return Promise.resolve();
                    })
                });
            });
        }
    })
    .on('error', err => {
        return Promise.reject(err);
    })
    .end();
};
