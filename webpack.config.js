module.exports = {
    entry: './src/index.js',
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        },
         { test: /\.css$/, use: ['style-loader', 'css-loader'] },
         {
           test: /\.(pdf|jpg|png|gif|svg|ico)$/,
           use: [
             {
               loader: 'url-loader'
             },
           ]
         },
         {  
           test: /\.(woff|woff2|eot|ttf|otf)$/,
           loader: "file-loader"
         }
      ]
    },
    resolve: {
      extensions: ['*', '.js', '.jsx', '.css']
    },
    output: {
      path: __dirname + '/dist',
      publicPath: '/',
      filename: 'bundle.js'
    },
    devServer: {
      contentBase: './dist'
    },
};