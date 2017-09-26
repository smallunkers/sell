/**
*解析url字符串参数
*@example ?id=123&a=b
 *@return object{id:123,a:b}
*/
export function urlParse () {
  let url = window.location.search;
  let obj = {};
  let reg = /[?&][^?&]+[=][^?&]+/g;
  let arr = url.match(reg); // ['?id=123','&a=b']
  if (arr) {
    arr.forEach((item) => {
      let sub = item.substring(1).split('=');
      let key = decodeURIComponent(sub[0]);
      let val = decodeURIComponent(sub[1]);
      obj[key] = val;
    });
  }
  return obj;
}
