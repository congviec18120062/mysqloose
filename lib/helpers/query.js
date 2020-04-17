const helpers = require("./helpers");

let mainFind = function mainFind(
  tableName,
  Connection,
  filter,
  projection,
  callback,
  limit = false
) {
  console.log(tableName);
  if (Connection) {
    if (tableName) {
      let tableField = "*";
      let filterString = "1 = 1";
      if (typeof projection == "function") {
        callback = projection;
        if (!helpers.isEmpty(filter))
          filterString = helpers.filterToString(filter);
      } else {
        if (typeof projection == "string") {
          tableField = projection.split(" ").join(", ");
          if (!helpers.isEmpty(filter))
            filterString = helpers.filterToString(filter);
        } else throw "Set of fields must be string.";
      }

      let selectString = `SELECT ${Connection.escapeId(
        tableField
      )} FROM ${Connection.escapeId(tableName)} WHERE ${filterString}`;

      if (limit) selectString += " LIMIT 1";
      Connection.query(selectString, (error, results, fields) => {
        if (error) callback(error, null);

        let resultObject = helpers.simplifyObject(results);
        if (resultObject.length == 0) {
          callback(false, {});
        } else if (resultObject.length == 1) {
          callback(false, resultObject[0]);
        } else {
          callback(false, resultObject);
        }
      });
    } else throw "Can not find model.";
  } else throw "Can not connect to database.";
};

let mainUpdate = function mainUpdate(
  tableName,
  Connection,
  filter,
  doc,
  callback,
  limit = false
) {
  if (Connection) {
    if (tableName) {
      if (typeof doc == "function") throw "Can not update";
      else {
        let filterString = "1 = 1";
        if (!helpers.isEmpty(filter))
          filterString = helpers.filterToString(filter);
        let setString = helpers.filterToString(doc);
        let updateString = `UPDATE ${Connection.escapeId(
          tableName
        )} SET ${setString} WHERE ${filterString}`;

        if (limit) updateString += " LIMIT 1";
        Connection.query(updateString, (error, results, fields) => {
          if (error) callback(error);

          callback(false);
        });
      }
    } else throw "Can not find model.";
  } else throw "Can not connect to database.";
};

let mainDelete = function mainDelete(
  tableName,
  Connection,
  filter,
  callback,
  limit = false
) {
  if (Connection) {
    if (tableName) {
      let filterString = "1 = 1";
      if (!helpers.isEmpty(filter))
        filterString = helpers.filterToString(filter);
      let deleteString = `DELETE FROM ${Connection.escapeId(
        tableName
      )} WHERE ${filterString}`;
      if (limit) deleteString += " LIMIT 1";
      Connection.query(deleteString, (error, results, fields) => {
        if (error) callback(error);

        callback(false);
      });
    } else throw "Can not find model.";
  } else throw "Can not connect to database.";
};

module.exports = {
  mainFind,
  mainUpdate,
  mainDelete,
};