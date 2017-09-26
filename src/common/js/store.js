export function saveTolocal (id, key, value) {
  let seller = window.localStorage.__seller__;// 第一次进入时查找localstorage,
  if (!seller) {
    seller = {};// 若seller是空的，即首次使用local,则创建空对象seller
    seller[id] = {};// 创建空对象seller.[id]
  } else {
    seller = JSON.parse(seller);// 不为空时，将seller字符串转码为对象
    if (!seller[id]) {
      seller[id] = {};// 继续判断商家id,是否为当前商家的id
    }
  }
  seller[id][key] = value; // 赋值
  localStorage.__seller__ = JSON.stringify(seller); // 转换为字符串，存入localstrage
};
export function loadfromLoacl (id, key, def) {
  let seller = window.localStorage.__seller__;
  if (!seller) {
    return def; // 没有seller返回默认值
  }
  seller = JSON.parse(seller);
  if (!seller[id]) {
    return def; // 有seller但是没有当前商家id,返回默认值
  } else if (seller[id][key]) {
    return seller[id][key]; // 有key,即value则返回
  } else {
    return def; // 没有key返回默认值
  }
};
