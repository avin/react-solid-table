var path = require('path');

module.exports = {
    module: {
        loaders: [
            {
                test: /\.less$/,
                loader: "style!css!less"
            }
        ],
    },
};