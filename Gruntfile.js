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

					return mergeTrees([mainCSS, js, img, html, pkgFiles]);
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-broccoli');
	grunt.registerTask('default', ['broccoli:default:build']);
	grunt.registerTask('watch', ['broccoli:default:watch']);
}