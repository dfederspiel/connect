/* eslint-disable class-methods-use-this */
import ModuleDependencyWarning from 'webpack/lib/ModuleDependencyWarning';

/**
 * IgnoreNotFoundExportPlugin works around typescript interface exports.
 *
 * After TypeScript transpilation, interfaces no longer exist, and so the
 * warning is technically correct, and thus webpack complains, yet there
 * are no runtime errors, and so it should be ignored to reduce terminal
 * output clutter.
 */
export default class IgnoreNotFoundExportPlugin {
  apply(compiler) {
    const messageRegExp = /export '.*'( \(reexported as '.*'\))? was not found in/;
    function doneHook(stats) {
      // eslint-disable-next-line no-param-reassign
      stats.compilation.warnings = stats.compilation.warnings.filter((warn) => {
        if (warn instanceof ModuleDependencyWarning && messageRegExp.test(warn.message)) {
          return false;
        }
        return true;
      });
    }
    if (compiler.hooks) {
      compiler.hooks.done.tap('IgnoreNotFoundExportPlugin', doneHook);
    } else {
      compiler.plugin('done', doneHook);
    }
  }
}
