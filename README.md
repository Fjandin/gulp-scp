Transfer files in gulp via scp.
Currently i have only tested it with an ssh connection via key authentication.

## Install

```bash
$ npm install --save-dev gulp-scp
```


## Usage

```js
var gulp = require('gulp');
var scp = require('gulp-scp');

gulp.task('default', function () {
    gulp.src('src/*')
        .pipe(scp({
            host: '255.255.255.255',
            user: 'username',
            port: 22,
            path: '~/dir'
        }));
});
```


## API

### scp(options)

#### options.host

*Required*
Type: `String`

#### options.port

Type: `Number`
Default: `22`

#### options.user

Type: `String`
Default: `''`

#### options.path

*Required*
Type: `String`

The path to transfer to has to exist.

## License

[MIT](http://opensource.org/licenses/MIT) © [René Bischoff](http://github.com/Fjandin)
