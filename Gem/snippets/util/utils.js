/**calculate the dimension and the shape of the Array */
function getShapeOfArray(arr) {
  function arrayShapeRecursive(arr, shape = []) {
    if (0 === shape.length && !Array.isArray(arr)) {
      throw new Error('the param is not an Array')
    }
    if (Array.isArray(arr)) {
      shape.push(arr.length)
      return arrayShapeRecursive(arr[0], shape)
    } else return shape
  }
  return arrayShapeRecursive(arr)
}
/**
  * convert the Geojson coordinates array to geometry extend corner lng lat Object
  * @param {Array} coordinates [[lng,lat],[lng,lat],...]
  * @returns {Object} extendCorner
  */
function convertCoordinatesToExtendCorner(coordinates) {
  return coordinates.reduce(
    (pre, cur) => {
      let _boundsCorner = Object.assign({}, pre)
      /*组装此次reducer的经度/纬度 数组,排序后筛选极大值极小值 */
      let lats = [_boundsCorner.southWestLat, _boundsCorner.northEastLat]
      let lngs = [_boundsCorner.southWestLng, _boundsCorner.northEastLng]
      lats.push(cur[1])
      lngs.push(cur[0])
      /*升序经纬度排序, 提取此次reducer的极小值极大值, 存入结果对象 
      sort函数默认升序 a<b a-b为负值 则 将a前置 */
      lats.sort((a, b) => a - b)
      lngs.sort((a, b) => a - b)
      let southWestLat = lats[0]
      let northEastLat = lats[2]
      let southWestLng = lngs[0]
      let northEastLng = lngs[2]
      _boundsCorner = {
        southWestLat: southWestLat,
        southWestLng: southWestLng,
        northEastLat: northEastLat,
        northEastLng: northEastLng
      }
      return _boundsCorner
    }, {
    southWestLat: coordinates[0][1],
    southWestLng: coordinates[0][0],
    northEastLat: coordinates[0][1],
    northEastLng: coordinates[0][0]
  })
}
/**convert stringified GeoJSON to its extend rectangle corner
   * 
   * @param {String} geometry 
   * @returns {Object} extendCorner
   */
const convertGeometryCoordinatesToRectExtend = (geometry) => {
  let geoJSON = JSON.parse(geometry)
  /*后端geometry的格式目前是三维数组,可能是为了multipolygon而设计的, 本工具函数只考虑单要素, 所以给数组降维 */
  let coordinates = geoJSON.coordinates[0]
  return convertCoordinatesToExtendCorner(coordinates)
}
const getBoundsFromGeoJSON = (geojson)=>{
  if(typeof geojson === 'string'){
    geojson = JSON.parse(geojson);
  }
  let minLn = Math.min(...geojson.coordinates[0].map(point => { return point[0] }))
  let minLat = Math.min(...geojson.coordinates[0].map(point => { return point[1] }))
  let maxLn = Math.max(...geojson.coordinates[0].map(point => { return point[0] }))
  let maxLat = Math.max(...geojson.coordinates[0].map(point => { return point[1] }))
  let latLngBounds = new L.LatLngBounds([minLat, minLn], [maxLat, maxLn]);
  return latLngBounds
}
/**递归, 按照原型链模式设计的 dataRef=>parentDataRef 将当前用户所在的节点映射为'路径'数组,用于生成面包屑 
 * nodeData Example:
 * {
 *   parentDataRef: null,
 *   id: 'root',
 *   children:[
 *     { 
 *       id: 'childOne',
 *       parentDataRef:{
 *         parentDataRef: null,
 *         id: 'root',
 *       }
 *       children: [...]
 *      }
 *   ]
 *   
 * }
*/
function mapCurrentDataTreeNodeToPathArray(nodeData, pathArray = []) {
  if (!nodeData) {
    return pathArray
  }
  mapCurrentDataTreeNodeToPathArray(nodeData.parentDataRef, pathArray)
  pathArray.push(nodeData)
  return pathArray
}

/**
 * convert the bit size to a number with proper Unit
 */
function mapPowerToUnit(power) {
  let result = 0;
  switch (power) {
    case 1:
      result = 'KB';
      break;
    case 2:
      result = 'MB';
      break;
    case 3:
      result = 'GB';
      break;
    case 4:
      result = 'T';
      break
    default:
      break;
  }
  return result
}
function calculateSpace(Byte, n = 0) {
  let temp = Byte
  while (temp > 1024) {
    n++
    temp = temp / 1024
  }
  return `${temp.toFixed(2)}${mapPowerToUnit(n)}`
}
// 使用该补丁后,可以使用[-1]来提取数组最后一个元素
Object.defineProperty(Array.prototype, -1, {
  get: function () {
    return Array.prototype.slice.call(this, -1)[0]
  }
})

/**删去sources 与 target属性的交集 */
function _substract(target, ...sources){
  for (const source of sources) {
      for( let key in source){
          if(key in target){
              delete target[key];
          }
      }
  }
  return target;
}
let a1 = {name: 'a'};
let b1 = {name: 'b', prop:'do something'};
let c1 = _substract(a1,b1);
console.log(c1);
/**使用sources对象仅复写target中存在的属性 */
function _override(target,...sources){
  for (const source of sources) {
      for (const key in source) {
          console.log(key, target)
          if(key in target){
              target[key] = source[key];
          }
      }
  }
  return target;
}

/** analogous color map*/
function hslCalculator(source, dataRange, colorRange=[`hsl(190,100%,50%)`, `hsl(228,100%,50%)`]) {
  let _colorRange = colorRange
  let min = Math.min(...dataRange);
  let max = Math.max(...dataRange);
  let position = (source - min) / (max - min);
  return `hsl(${170 + (228 - 170) * position},100%,50%)`;
}