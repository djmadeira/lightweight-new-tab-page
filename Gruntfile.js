module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      default: {
        files: ['build/**/*.{js,scss,png,jpeg,jpg,html}'],
        tasks: ['default']
      }
    },
    sass: {
      default: {
        options: {
          sourcemap: true,
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
    },
    copy: {
      pkg: {
        files: [
          {
            expand: true,
            cwd: 'js',
            src: ['*'],
            dest: 'pkg/js'
          },
          {
            expand: true,
            cwd: 'img',
            src: ['*.png'],
            dest: 'pkg/img/'
          },
          {
            src: ['newtab.html'],
            dest: 'pkg/'
          },
          {
            src: ['manifest.json'],
            dest: 'pkg/'
          },
        ]
      },
      js: {
        files: {
          'js/main.js': 'build/js/main.js'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-inline');

  grunt.registerTask('default', ['sass', 'inline', 'copy:js']);
  grunt.registerTask('pkg', ['copy:pkg']);

};
