module.exports = {
    // other webpack configuration...
    plugins:[
        new webpack.DefinePlugin({
            process: {env: {}}
        })
    ],
    module: {
        
    },
};
