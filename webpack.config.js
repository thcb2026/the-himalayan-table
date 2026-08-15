const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;

// Module Federation configuration
const mfConfig = {
  name: "the_himalayan_table",
  filename: "remoteEntry.js",
  exposes: {
    "./App": "./src/AppMUI",
    "./HomePageMUI": "./src/pages/HomePageMUI",
    "./MenuPageMUI": "./src/pages/MenuPageMUI",
    "./CheckoutPageMUI": "./src/pages/CheckoutPageMUI",
    "./CartDrawerMUI": "./src/pages/CartDrawerMUI",
    "./OrderFlowPageMUI": "./src/pages/OrderFlowPageMUI",
    "./CorporateCateringPageMUI": "./src/pages/CorporateCateringPageMUI",
    "./ContactPageMUI": "./src/pages/ContactPageMUI",
    "./store": "./src/store",
    "./types": "./src/types",
    "./content/data": "./src/content/data",
    "./theme": "./src/theme/theme",
  },
  shared: {
    react: { singleton: true, strictVersion: true, requiredVersion: "^19.0.0", eager: false },
    "react-dom": { singleton: true, strictVersion: true, requiredVersion: "^19.0.0", eager: false },
    "@mui/material": { singleton: true, strictVersion: false, requiredVersion: "^9.3.1", eager: false },
    "@mui/icons-material": { singleton: true, strictVersion: false, requiredVersion: "^9.3.1", eager: false },
    "@emotion/react": { singleton: true, requiredVersion: "^11.14.0", eager: false },
    "@emotion/styled": { singleton: true, requiredVersion: "^11.14.1", eager: false },
  },
};

module.exports = {
  // 1. Entry point: where Webpack starts bundling
  entry: './src/index.ts',

  // 2. Output: where the bundle goes
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
    publicPath: 'auto',
    clean: true,
  },

  // 3. Resolve TypeScript/React files correctly
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },

  // 4. Mode: 'development' or 'production'
  mode: 'development',

  // 5. Dev Server configuration
  devServer: {
    static: './dist',
    port: 4211,
    open: true,
    proxy: [
      {
        context: ['/api'],
        target: 'http://127.0.0.1:5002',
        changeOrigin: true,
        secure: false,
      },
    ],
  },

  // 6. Loaders: process non-JavaScript files (CSS, images, TS, Babel)
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  // 7. Plugins: perform broader tasks like HTML generation or Module Federation
  plugins: [
    new ModuleFederationPlugin(mfConfig),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new CopyPlugin({
      patterns: [
        { from: 'public/_headers', to: '.' },
      ],
    }),
  ],

  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: -10,
          reuseExistingChunk: true,
        },
        mui: {
          test: /[\\/]node_modules[\\/](@mui|@emotion)[\\/]/,
          name: 'mui',
          priority: -5,
          reuseExistingChunk: true,
        },
      },
    },
  },

  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
};