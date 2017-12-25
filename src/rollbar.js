import Rollbar from 'rollbar';
// import mongoose from 'mongoose';

// Track error by https://sentry.io/
if (location.host === 'preview.pro.ant.design') {
  Rollbar.init({
    accessToken: '033ca6d7c0eb4cc1831cf470c2649971',
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
      environment: 'production',
    },
  });
}


// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://yanyj:jun2436520@119.28.26.143:23333/yanyj', { useMongoClient: true });
//
// const db = mongoose.connection;
//
// db.on('error', console.error.bind(console, '连接错误:'));
// db.once('open', () => {
//   console.log('数据库连接成功');
// });
