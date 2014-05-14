'use strict';

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

    var files = [];
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

        this.push(file);
        files.push(file.path);
        cb();
    }, function (cb) {
        if (files.length > 0) {
            options.file = files.join(' ');
            scp.send(options, function(err){
                if(err) {
                    gutil.log('gulp-scp:', gutil.colors.red(err));
                } else {
                    gutil.log('gulp-scp:', gutil.colors.green(files.length, files.length === 1 ? 'file' : 'files', 'transferred successfully'));
                }
                cb();
            });
        } else {
            gutil.log('gulp-scp:', gutil.colors.green('No files transferred'));
            cb();
        }

    });
};
