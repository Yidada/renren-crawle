const CONFIG = require('./config/renren');
const download = require('./dowload');
const crawlRenren = require('./renren');
const fs = require('fs');

(async() => {
    // clear old data;
    let imgs = {};
    async function clearJson () {
        fs.stat(CONFIG.jsonPath, (err, stats) => {
            if (stats) {
                fs.unlink(CONFIG.jsonPath, () => {
                    return Promise.resolve();
                })
            }
            return Promise.resolve();
        });
    }
    await clearJson();
    
    async function deleteFolderRecursive(path) {
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach(function(file, index) {
                let curPath = path + "/" + file;
                if (fs.lstatSync(curPath).isDirectory()) { 
                    // recurse
                    deleteFolderRecursive(curPath);
                }
                else { 
                    // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
            return Promise.resolve();
        }
    }
    await deleteFolderRecursive('./tmp');

    async function createEmptDir () {
        fs.mkdir('./tmp', () => {
            return Promise.resolve();
        });
    }
    await createEmptDir();

    // start crawling!!
    await crawlRenren();
    
    // read json file
    function readJson () {
        return new Promise((r, j) => {
            fs.readFile(CONFIG.jsonPath, {
                encoding: 'utf-8'
            }, (err, data) => {
                if (err) {
                    j(err);
                }
                r(JSON.parse(data));
            });
        })
    }
    try {
        imgs = await readJson();
    }
    catch (err) {
        console.warn(err);
    }
    
    async function createDir(dirName) {
        fs.mkdir('./tmp/' + dirName, err => {
            if (!err) {
                return Promise.resolve();
            }
        });
    };
    
    // download images
    const downloadImgs = async (imgArr, title) => imgArr.map(item => download(item, title));
    try {
        imgs.forEach(async (elem, index) => {
            await createDir(elem.title);
            await downloadImgs(elem.content, elem.title);
            console.log('download ' + elem.title + ' finish!');
        });
    }
    catch (err) {
        console.log(err);
    }
})();