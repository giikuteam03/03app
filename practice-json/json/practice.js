
//実行時　node practiceが必要 
var fs = require('fs');
var jsonData = {
  istext:true
}
// ファイルの書き込み関数
function writeFile(path, data) {
  const jsonStr = JSON.stringify(data);
  fs.writeFile(path, jsonStr, (err) => {
    if (err) rej(err);
    if (!err) {
      console.log('Jsonの更新が成功');
      console.log(data);
    }
  });
}

// ファイルの確認の関数
function isExistFile(file) {
  try {
    fs.statSync(file);
    return true
  } catch(err) {
    if(err.code === 'ENOENT') return false
  }
}

function main(path, input) {
  const stats = isExistFile(path);
  if (stats) {
    console.log('path is file.');
  } else {
    console.log('path is not file.');
    writeFile(path, input);
  }
}

//実行例
main(`create.json`, jsonData);