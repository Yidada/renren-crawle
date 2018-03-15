> renren.com crawler

# Required
```
node.js >=8.9.1
```

# Installation
```
git clone https://github.com/Yidada/renren-crawle.git

npm i

mkdir config
touch renren.js
```

# Config
you may config your `config/renren.js` like this:
```
module.exports = {
    albumList: 'http://photo.renren.com/photo/XXXXXXX/albumlist/v7',  // which XXXXX represent the album key 
    username: 'xxxxxxxxxxxxxxxxxxxxx',                                // whatever renren acount
    password: 'XXXXXXXX',                                             // password
    jsonPath: './data/renren.json'                                    // don't change 
}
```

# Start
```
node index.js
```

wait for a moment, there will be a `tmp` directory appear under your project path.
you can open the Finder and you will find all the images according the album name is under your project.


# Be caution!
This project is used for crawle your friends pictures or pictures yourself!
Do not use this crawler for business, all the consequence will be self negative；

