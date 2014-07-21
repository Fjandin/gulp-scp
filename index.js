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

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError('gulp-scp', 'Streaming not supported'));
            return cb();
        }

        //Folder mode does not allow files
        if (!options.folder && file.isNull()) {
            this.push(file);
            return cb();
        }

        //Folder only allows 1 path
        if(options.folder && files.length){
            return cb();
        }

        this.push(file);
        files.push(file.path);
        return cb();
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
                if (options.cb) {options.cb()}
            });
        } else {
            gutil.log('gulp-scp:', gutil.colors.green('No files transferred'));
            cb();
        }

    });
};
