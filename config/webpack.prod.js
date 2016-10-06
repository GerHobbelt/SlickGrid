const path                = require('path')
const webpack             = require('webpack')

const __OUTPUT__          = path.join(__dirname, '..', 'dist')
const __INPUT__           = path.join(__dirname, '..', 'src')
const __COMPONENT_NAME__  = 'slickgrid-es6'

module.exports = {

  devtool: 'source-map',

  debug: true,

  context: __dirname,

  entry: {
    index: [
      path.join(__INPUT__, 'index.js')
    ]
  },

  output: {
    path: __OUTPUT__,
    publicPath: '/',
    filename: `${__COMPONENT_NAME__}.min.js`
  },

  externals: {
    jquery: {
      root: 'jQuery',
      commonjs2: 'jquery',
      commonjs: 'jquery',
      amd: 'jquery'
    },
    flatpickr: {
      root: 'flatpickr',
      commonjs2: 'flatpickr',
      commonjs: 'flatpickr',
      amd: 'flatpickr'
    }
  },

  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /(node_modules)/,
      loader: 'babel',
      query: {
        presets: ['es2015', 'stage-0']
      }
    }, {
      test:   /\.less/,
      loader: 'style-loader!css-loader!less-loader?sourceMap=inline'
    }, {
      test: /\.(jpe?g|png|gif|svg)$/i,
      loaders: [
        'file?hash=sha512&digest=hex&name=[hash].[ext]',
        'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
      ]
    }]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: 'production'
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false, //prod
      mangle: {
        screw_ie8: true,
      }, //prod
      compress: {
        screw_issse8: true
      }, //prod
      comments: false //prod
    })
  ],

  resolve: {
    extensions: ['', '.js', '.jsx']
  }
}
