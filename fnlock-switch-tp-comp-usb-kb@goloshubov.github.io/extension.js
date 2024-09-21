import { Extension } from "resource:///org/gnome/shell/extensions/extension.js";
import St from "gi://St";
import Gio from "gi://Gio";
import GLib from "gi://GLib";
import * as Main from "resource:///org/gnome/shell/ui/main.js";
import Meta from "gi://Meta";
import Shell from "gi://Shell";
import * as PanelMenu from "resource:///org/gnome/shell/ui/panelMenu.js";
import * as ExtensionUtils from "resource:///org/gnome/shell/misc/extensionUtils.js";

const FNLOCKED_ICON = "fnlk.svg";
const FNUNLOCKED_ICON = "fn.svg";
const NOFNLOCK_ICON = "none.svg";

export default class FnLockExtension extends Extension {
  async update_fnlock(proc) {
    try {
      proc.communicate_utf8_async(null, null, (proc, res) => {
        try {
          let [ok, stdout, stderr] = proc.communicate_utf8_finish(res);
          //console.log(stdout.toString());

          if (stdout.toString().includes("1")) {
            this._icon.set_gicon(this._gicon_locked);
          } else if (stdout.toString().includes("0")) {
            this._icon.set_gicon(this._gicon_unlocked);
          } else {
            this._icon.set_gicon(this._gicon_none);
          }
        } catch (e) {
          reject(e);
        }
      });
    } catch (e) {
      logError(e);
    }
  }

  init_fnlock() {
    this._icon.set_gicon(this._gicon_none);
    try {
      const proc = Gio.Subprocess.new(
        ["sh", "-c", "cat /sys/bus/hid/devices/*17EF:604*/fn_lock"],
        Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE,
      );
      this.update_fnlock(proc);
    } catch (e) {
      logError(e);
    }
  }

  switch_fnlock() {
    try {
      const proc = Gio.Subprocess.new(
        [
          "sh",
          "-c",
          "test -f /sys/bus/hid/devices/0003:17EF*/fn_lock && \
            { grep -q 1 /sys/bus/hid/devices/*17EF:604*/fn_lock && echo 0 || echo 1; } | tee /sys/bus/hid/devices/*17EF:604*/fn_lock",
        ],
        Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE,
      );
      this.update_fnlock(proc);
    } catch (e) {
      logError(e);
    }
  }

  enable() {
    this._button = new PanelMenu.Button(0.0);
    this._icon = new St.Icon({ style_class: "system-status-icon" });
    this._gicon_locked = Gio.icon_new_for_string(
      this.path + "/icons/" + FNLOCKED_ICON,
    );
    this._gicon_unlocked = Gio.icon_new_for_string(
      this.path + "/icons/" + FNUNLOCKED_ICON,
    );
    this._gicon_none = Gio.icon_new_for_string(
      this.path + "/icons/" + NOFNLOCK_ICON,
    );

    this.init_fnlock();

    this._button.add_child(this._icon);
    this._button.connect("button-press-event", (item, event) => {
      this.switch_fnlock();
    });

    Main.panel.addToStatusArea("FnLock", this._button);

    this._settings = this.getSettings();
    Main.wm.addKeybinding(
      "keybinding",
      this._settings,
      Meta.KeyBindingFlags.IGNORE_AUTOREPEAT,
      Shell.ActionMode.NORMAL | Shell.ActionMode.OVERVIEW,
      () => this.switch_fnlock(),
    );
  }

  disable() {
    Main.wm.removeKeybinding("keybinding");
    this._button?.destroy();
    this._button = null;
    this._icon?.destroy();
    this._icon = null;
    this._gicon_locked = null;
    this._gicon_unlocked = null;
    this._gicon_none = null;
    this._settings = null;
  }
}
