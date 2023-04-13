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
convertGeometryCoordinatesToRectExtend = (geometry) => {
  let geoJSON = JSON.parse(geometry)
  /*后端geometry的格式目前是三维数组,可能是为了multipolygon而设计的, 本工具函数只考虑单要素, 所以给数组降维 */
  let coordinates = geoJSON.coordinates[0]
  return convertCoordinatesToExtendCorner(coordinates)
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