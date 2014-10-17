module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      default: {
        files: {
          'js/main.min.js': 'build/js/main.js'
        }
      }
    },
    watch: {
      default: {
        files: ['build/**/*.{js,scss,png,jpeg,jpg,html}'],
        tasks: ['default']
      }
    },
    libsass: {
      default: {
        options: {
          sourcemap:true,
        },
        src: 'build/css/main.scss',
        dest: 'css/main.min.css'
      }
    },
    inline: {
      default: {
        options: {
          tag: 'inline'
        },
        src: [ 'build/html/newtab.html' ],
        dest: [ 'newtab.html' ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-libsass');
  grunt.loadNpmTasks('grunt-inline');

  grunt.registerTask('default', [/*'uglify',*/ 'libsass', 'inline']);
  grunt.registerTask('watcher', ['watch']);

};
