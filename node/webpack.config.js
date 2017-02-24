module.exports = {
  /* ビルドの起点となるファイルの設定 */
  entry: {
    main: ['./public/javascripts/calendar.js',
           './public/javascripts/schedule.js',
           './public/javascripts/modal.js',
           './public/javascripts/basic_modal.js',
           './public/javascripts/main_content.js',
           './public/javascripts/ajax_action.js',
          ],
    signin: ['./public/javascripts/signin.js'],
    signup: ['./public/javascripts/signup.js'],
  },
  /* 出力されるファイルの設定 */
  output: {
    path: './public/javascripts/build/', // 出力先のパス
    filename: '[name].bundle.js' // 出力先のファイル名
  },
  /* ソースマップをファイル内に出力させる場合は以下を追加 */
  devtool: 'inline-source-map',
  module: {
    /* loaderの設定 */
    loaders: [
      {
        test: /\.js$/, // 対象となるファイルの拡張子（正規表現可）
        exclude: /node_modules/, // 除外するファイル/ディレクトリ（正規表現可）
        loader: 'babel-loader', // 使用するloader
        query: {
          presets: ['es2015', 'react', 'stage-0'],
        }
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css?modeules'],
      },
    ]
  }
};
