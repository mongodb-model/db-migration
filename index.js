"use strict";

/**
 * @author Ericson S. Weah  <ericson.weah@gmail.com> <https://github.com/eweah>  <+1.385.204.5167>
 *
 * @module Migration
 * @kind class
 *
 * @extends Migration
 * @requires Migration
 * @requires createReadStream
 * @requires createWriteStream
 *
 * @classdesc Migration class
 */
 const { createReadStream, createWriteStream, promises } = require("fs");
const { join } = require("node:path");
const { existsSync } = require("fs");

const { exec } = require("node:child_process");

const schema = require('./lib/schema')

class Migration extends require("./base") {
  constructor(...arrayOfObjects) {
    super({ objectMode: true, encoding: "utf-8", autoDestroy: true });

    arrayOfObjects.forEach((option) => {
      if (Object.keys(option).length > 0) {
        Object.keys(option).forEach((key) => {
          if (!this[key]) this[key] = option[key];
        });
      }
    });

    // auto bind methods
    this.autobind(Migration);
    // auto invoke methods
    this.autoinvoker(Migration);
    // add other classes method if methods do not already exist. Argument order matters!
    // this.methodizer(..classList);
    //Set the maximum number of listeners to infinity
    this.setMaxListeners(Infinity);
  }

  types() {
    return [
      "double",
      "string",
      "object",
      "array",
      "objectId",
      "data",
      "bool",
      "null",
      "regex",
      "int",
      "timestamp",
      "long",
      "decimal",
      "uuid",
      "bindData",
      "mixed"
    ];
  }
  cmd(cmdCommand = "User") {
    return cmdCommand.endsWith("s")
      ? cmdCommand.toLowerCase()
      : `${cmdCommand}s`.toLocaleLowerCase();
  }

  path(path = "/app/schemas") {
    return require("path").join(process.cwd(), path);
  }
  async addDirectory(path = this.path()) {
    if (!existsSync(path)) {
      await require("fs").promises.mkdir(path, { recursive: true });
    }
  }

  checkForInstallation() {
    // exec("npm list db-migration", (error, stdout, stderr) => {
    //   if (error) {
    //     exec("npm link db-migration", (err, sto, sdi) => {
    //       if (err) return error;
    //       if (sto) {
    //         console.log(sto);
    //       }
    //     });
    //   }
    // });
  }
  modelPath(command) {
    const paths = command.split("/");
    paths.pop();
    const modelPath = "/app/schemas/" + paths.join("/");
    return this.path(modelPath);
  }
  modelName(command) {
    const paths = command.split("/");
    const name = paths.pop();
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
  collectionName(command) {
    const paths = command.split("/");
    const name = paths.pop();
    return this.cmd(name);
  }
  hasType(type = "object") {
    if (type.startsWith("--type=")) {
      if (this.types().includes(type.split("=")[1])) {
        return true;
      } else {
        return false;
      }
    }
  }

  isSchemaNameValid(name = "User") {
    if (name.startsWith("--schema=")) {
      if (name.trim().length <= "--schema=".length) return false;
      return true;
    } else {
      return false;
    }
  }
  schemaName(name = "User") {
    if (name.startsWith("--schema=")) {
      name = name.split("=")[1].trim();
      if (name.length === 0) return false;
      return name;//this.cmd(name);
    }
    return false;
  }

  schemaPath(command) {
    return join(
      this.modelPath(this.schemaName(command)),
      `${this.modelName(this.schemaName(command))}`
    )
      .split("/app/")[1]
      .split("app/schemas/")
      .join("");
  }
  schemaType(type = "--type=object") {
    return this.hasType(type) ? type.split("=")[1] : "object";
  }

  requireSchemaPath(command) {
    let scPath = `../`;
    for (let i = 0; i < this.schemaPath(command).split("/").length; i++) {
      scPath += "../";
    }
    scPath += "src/schema";
    return scPath;
  }
  async makeMigration(command, type = "object") {
    // return console.log(command)
    //  console.log(scPath);
    // return console.log(this.modelPath(this.schemaName(command)));

    if (this.hasType && this.isSchemaNameValid(command)) {
      this.checkForInstallation();
      await this.addDirectory(this.modelPath(this.schemaName(command)));
      if (
        !existsSync(
          join(
            this.modelPath(this.schemaName(command)),
            `${this.modelName(this.schemaName(command))}.js`
          )
        )
      ) {
        const writable = this.createWriteStream(
          join(
            this.modelPath(this.schemaName(command)),
            `${this.modelName(this.schemaName(command))}.js`
          )
        );
        writable.write(
          schema({
            name: this.cmd(this.modelName(this.schemaName(command))),
            type: this.schemaType(type),
            options: {},
            path: this.requireSchemaPath(command)
          })
        );
        writable.end("");
        console.log(
          `\x1b[32m${this.modelName(
            this.schemaName(command)
          )} schema successfully created!\x1b[0m`
        );
      } else {
        console.log(
          `\x1b[32m${this.modelName(
            this.schemaName(command)
          )}\x1b[0m\x1b[31m schema already exists!\x1b[0m`
        );
      }
    }else{
      return console.log('db-migration migration --schema=<SchemaName>')
    }
    
  }

  addDefault() {
    if (!this.createWriteStream) this.createWriteStream = createWriteStream;
    if (!this.createReadStream) this.createReadStream = createReadStream;
    if (!promises) this.promises = promises;
  }

  /**
   * @name autoinvoked
   * @function
   *
   * @param {Object|Function|Class} className the class whose methods to be bound to it
   *
   * @description auto sets the list of methods to be auto invoked
   *
   * @return does not return anything
   *
   */

  autoinvoked() {
    return ["addDefault"];
  }
}

module.exports = Migration;

