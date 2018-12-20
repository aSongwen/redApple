function stringToJson(data) {
  return JSON.parse(data);
}
/**
*字符串转json
*/
function jsonToString(data) {
  return JSON.stringify(data);
}

/**
*对象转换为Map
*/
function objToStrMap(obj) {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}

/**
  *json转换为map
  */
function jsonToMap(jsonStr) {
  return objToStrMap(JSON.parse(jsonStr));
}
function strMapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k, v] of strMap) {
    obj[k] = v;
  }
  return obj;
}

const getUiParam = data => {
  var uipara=data.uiparas;
  var requi=data.requi;
  if (uipara == null) return null;
  var jui = stringToJson(uipara);
  return strMapToObj(jsonToMap(uipara));
}

module.exports = {
  getUiParam: getUiParam
}