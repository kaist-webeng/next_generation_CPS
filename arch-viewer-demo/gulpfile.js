const gulp = require('gulp')
const ts = require('gulp-typescript')
const sourcemaps = require('gulp-sourcemaps')
const del = require('del')

const TsProject = ts.createProject('tsconfig.json')
const CopyFiles = ['src/**/*.html']
const Dist = 'dist'

gulp.task('del', () => {
  return del.sync(['dist/**/*', 'level-db/**/*'])
})

gulp.task('ts', ['del'], () => {
  return TsProject.src()
    .pipe(sourcemaps.init())
    .pipe(TsProject())
    .js.pipe(sourcemaps.write())
    .pipe(gulp.dest(Dist))
})

gulp.task('copy', ['del'], () => {
  return gulp.src(CopyFiles).pipe(gulp.dest(Dist))
})

gulp.task('default', ['copy', 'ts'])
