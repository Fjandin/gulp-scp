'use strict';

var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var assign = require('object-assign');
var scp = require('scp');

module.exports = function (options) {
    options = assign({
        port: 22,
        user: ''
    }, options);

    if (options.host === undefined) {
        throw new gutil.PluginError('gulp-scp', '`host` required.');
    }

    if (options.path === undefined) {
        throw new gutil.PluginError('gulp-scp', '`path` required.');
    }

    var fileCount = 0;
    var remotePath = options.remotePath || '';
    delete options.remotePath;

    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError('gulp-scp', 'Streaming not supported'));
            return cb();
        }

        var self = this;

        this.push(file);
    }, function (cb) {
        if (fileCount > 0) {
            gutil.log('gulp-ftp:', gutil.colors.green(fileCount, fileCount === 1 ? 'file' : 'files', 'transferred successfully'));
        } else {
            throw new gutil.PluginError('gulp-scp', 'No files.');
        }

        cb();
    });
};
