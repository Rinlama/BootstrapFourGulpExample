var gulp = require("gulp");
var browserSync = require("browser-sync").create();
var sass = require("gulp-sass");
const imagemin = require("gulp-imagemin");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");

// Compile sass into CSS & auto-inject into browsers
gulp.task("sass", function() {
  return gulp
    .src(["node_modules/bootstrap/scss/bootstrap.scss", "src/scss/*.scss"])
    .pipe(sass())
    .pipe(gulp.dest("src/css"))
    .pipe(browserSync.stream());
});

// Move the javascript files into our /src/js folder
gulp.task("bootstrapscripts", function() {
  return gulp
    .src([
      "node_modules/bootstrap/dist/js/bootstrap.min.js",
      "node_modules/jquery/dist/jquery.min.js",
      "node_modules/popper.js/dist/umd/popper.min.js"
    ])
    .pipe(gulp.dest("src/js/bootstrap-dep"))
    .pipe(browserSync.stream());
});

// custom scripts
gulp.task("customscripts", function() {
  return gulp.src(["src/custom/*.js"]).pipe(browserSync.stream());
});
//Static Server + watching scss/html files
gulp.task("serve", ["sass", "bootstrapscripts", "customscripts"], function() {
  browserSync.init({
    server: "./src"
  });

  gulp
    .watch(
      ["node_modules/bootstrap/scss/bootstrap.scss", "src/scss/*.scss"],
      ["sass"]
    )
    .on("change", browserSync.reload);
  gulp
    .watch(["src/js/custom/*.js"], ["customscripts"])
    .on("change", browserSync.reload);

  gulp.watch("src/*.html").on("change", browserSync.reload);
});

gulp.task("default", ["serve"]);

// gulp build task

//copy all html files
gulp.task("copyhtml", () => {
  gulp.src("src/*.html").pipe(gulp.dest("dist"));
});

//optimize images
gulp.task("imagemin", () =>
  gulp
    .src("src/assets/images/*")
    .pipe(imagemin())
    .pipe(gulp.dest("dist/assets/images"))
);

gulp.task("buildcustomscripts", () => {
  gulp
    .src("src/js/custom/*.js")
    .pipe(concat("main.js"))
    .pipe(uglify())
    .pipe(gulp.dest("dist/js/custom"));
});
gulp.task("buildbootstrapscripts", () => {
  gulp
    .src("src/js/bootstrap-dep/*.js")
    .pipe(uglify())
    .pipe(gulp.dest("dist/js/bootstrap-dev"));
});

gulp.task("sassbuild", function() {
  return gulp.src(["src/css/*.css"]).pipe(gulp.dest("dist/css"));
});

gulp.task("build", [
  "copyhtml",
  "imagemin",
  "sassbuild",
  "buildbootstrapscripts",
  "buildcustomscripts"
]);
