const axios = require("axios");
const concat = require("concat-stream");
const FormData = require("form-data");

// Maximum time to upload to the server
const UPLOAD_TIMEOUT = 5000;

/*
  This is a custom multer storage engine that orxy the received data into a remote server.
  The data is forwarded as multipart/form-data.
  opts: {
    serverPath: 'http://www.example.com/upload',
    fileParamName: 'file' // If left blank, this defaults to 'file'
  }
  The receiving server is expected to return:
    HTTP Code 200
      or
    HTTP Code Non-200, which is considered an error
*/
class MulterProxyStorage {
  constructor(opts) {
    this.opts = opts;
  }

  _handleFile(req, file, cb) {
    const form = new FormData();
    // Use filepath to specify the file's fullpath. If we use filename, it'll be cut down into only the filename
    if (req.body.cdnPath) {
      form.append("cdnPath", req.body.cdnPath);
    }
    form.append(this.opts.fileParamName || "file", file.stream, {
      filepath: file.originalname
    });
    form.pipe(
      concat({ encoding: "buffer" }, data => {
        axios
          .post(this.opts.serverPath, data, {
            headers: form.getHeaders(),
            timeout: UPLOAD_TIMEOUT
          })
          .then(resp => {
            req.serverResp = resp.data;
            // console.log(JSON.stringify(resp.data));
            cb(null);
          })
          .catch(err => {
            cb(err);
          });
      })
    );
  }

  _removeFile(req, file, cb) {
    cb(null);
  }
}

module.exports = opts => {
  return new MulterProxyStorage(opts);
};
