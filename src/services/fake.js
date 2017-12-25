import Fake from '../schemes/Fake';
import request from '../utils/request';

export async function addFake(newFake) {
  return request('/api/addFake', {
    method: 'POST',
    body: newFake,
  });
}

export async function addFake1(newFake) {
  const fake = new Fake(newFake);

  return fake.save((err, doc) => {
    // let name = fluffy.name;
    if (err) return console.error(' 保存 失败！');
    console.log('保存 成功！');
    return doc;
  });
}
