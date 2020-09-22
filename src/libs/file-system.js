const fsPromises = require("fs").promises;

class FileSystem {
  file;
  constructor(file) {
    this.file = file;
  }

  async clearFile() {
    await fsPromises.writeFile(this.file, "");
  }

  async write(...strings) {
    const text = strings.join("\n") + "\n";
    await fsPromises.appendFile(this.file, text);
  }
}

module.exports = FileSystem;
