#!/usr/bin/env node

module.exports = function (context) {
    var path        = context.requireCordovaModule('path'),
        fs          = context.requireCordovaModule('fs'),
        shell       = context.requireCordovaModule('shelljs'),
        projectRoot = context.opts.projectRoot,
        plugins     = context.opts.plugins || [];

    // The plugins array will be empty during platform add
    if (plugins.length > 0 && plugins.indexOf('cordova-plugin-wechat') === -1) {
        return ;
    }

    var ConfigParser = null;
    try {
        ConfigParser = context.requireCordovaModule('cordova-common').ConfigParser;
    } catch(e) {
        // fallback
        ConfigParser = context.requireCordovaModule('cordova-lib/src/configparser/ConfigParser');
    }

    var config      = new ConfigParser(path.join(context.opts.projectRoot, "config.xml")),
        packageName = config.android_packageName() || config.packageName();

    // replace dash (-) with underscore (_)
    packageName = packageName.replace(/-/g , "_");
    
    console.info("Running android-install.Hook: " + context.hook + ", Package: " + packageName + ", Path: " + projectRoot + ".");

    if (!packageName) {
        console.error("Package name could not be found!");
        return ;
    }

    // android platform available?
    if (context.opts.cordova.platforms.indexOf("android") === -1) {
        console.info("Android platform has not been added.");
        return ;
    }
<<<<<<< HEAD

    var targetDir  = path.join(projectRoot, "platforms", "android", "app", "src", "main", "java", packageName.replace(/\./g, path.sep), "wxapi");
=======
    //Users/earsui/apps/guoanjiaApp/platforms/android/app/src/main/java modify path
    var targetDir  = path.join(projectRoot, "platforms", "android","app","src","main","java", packageName.replace(/\./g, path.sep), "wxapi");
>>>>>>> 2a52bdae1beda2fe3a69b6cd065ae6a34e9befec
        targetFiles = ["EntryActivity.java", "WXEntryActivity.java", "WXPayEntryActivity.java"];
    console.log("targetDir:"+targetDir);
    if (['after_plugin_add', 'after_plugin_install'].indexOf(context.hook) === -1) {
        // remove it?
        targetFiles.forEach(function (f) {
            try {
                fs.unlinkSync(path.join(targetDir, f));
            } catch (err) {}
        });
    } else {
        // create directory
        shell.mkdir('-p', targetDir);

        // sync the content
        targetFiles.forEach(function (f) {
            fs.readFile(path.join(context.opts.plugin.dir, 'src', 'android', f), {encoding: 'utf-8'}, function (err, data) {
                if (err) {
                    throw err;
                }

                data = data.replace(/^package __PACKAGE_NAME__;/m, 'package ' + packageName + '.wxapi;');
                fs.writeFileSync(path.join(targetDir, f), data);
            });
        });
    }
};
