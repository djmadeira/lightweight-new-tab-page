var fs = require('fs');

var pickFiles = require('broccoli-static-compiler');
var compileSass = require('broccoli-sass');
var mergeTrees = require('broccoli-merge-trees');
var imagemin = require('broccoli-imagemin');

var JPEGRecompress = require('imagemin-jpeg-recompress');
var PNGCrush = require('imagemin-pngcrush');
var SVGO = require('imagemin-svgo');

module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		broccoli: {
			default: {
				dest: 'dist',
				config: function () {
					var mainCSS = 'build/css';
					mainCSS = pickFiles(mainCSS, {
						srcDir: '/',
						files: ['**/*.scss'],
						destDir: '/css'
					});
					mainCSS = compileSass(['build/css'], 'main.scss', 'css/main.css', {outputStyle: 'expanded'});

					var js = 'build/js';
					js = pickFiles(js, {
						srcDir: '/',
						destDir: '/js'
					});

          var lib = 'build/lib';
          lib = pickFiles(lib, {
            srcDir: '/',
            destDir: '/lib'
          });

					var img = 'build/images';
					img = pickFiles(img, {
						srcDir: '/',
						destDir: '/images'
					});
					img = imagemin(img, {
						interlaced: true,
		        optimizationLevel: 3,
		        progressive: true,
					});

					var html = 'build/html';
					html = pickFiles(html, {
						srcDir: '/',
						destDir: '/templates'
					});

					var pkgFiles = 'build/';
					pkgFiles = pickFiles(pkgFiles, {
						srcDir: '/',
						files: ['manifest.json'],
						destDir: '/'
					});

					return mergeTrees([mainCSS, js, img, html, lib, pkgFiles]);
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-broccoli');
	grunt.registerTask('default', ['broccoli:default:build']);
	grunt.registerTask('watch', ['broccoli:default:watch']);
  grunt.registerTask('pkg', 'Package for the chrome webstore', packageExtension);
};

function packageExtension() {
  // remove the data-env flag from the body so our unit tests, etc. don't run
  var file = fs.readFileSync('./dist/templates/newtab.html', {encoding: 'utf8'});
  console.log(file);

  file = file.replace('data-env="dev"', 'data-env="prod"');

  fs.writeFileSync('./dist/templates/newtab.html', file);
}
