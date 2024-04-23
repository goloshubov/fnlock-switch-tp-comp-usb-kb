import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import St from 'gi://St';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as ExtensionUtils from 'resource:///org/gnome/shell/misc/extensionUtils.js';

const FNLOCKED_ICON = "fnlk.svg";
const FNUNLOCKED_ICON = "fn.svg";


export default class FnLockExtension extends Extension {
    enable() {
      const gicon_locked = Gio.icon_new_for_string(this.path + "/icons/" + FNLOCKED_ICON);
      const gicon_unlocked = Gio.icon_new_for_string(this.path + "/icons/" + FNUNLOCKED_ICON);

      this._button = new PanelMenu.Button(0.0);
      this._icon = new St.Icon({ style_class: 'system-status-icon' });

      let [ok, out, err, exit] = GLib.spawn_command_line_sync("sh -c 'cat /sys/bus/hid/devices/*17EF\:604*/fn_lock'");
      if (out.toString().includes('0')) {
        this._icon.set_gicon(gicon_unlocked)
      } else {
        this._icon.set_gicon(gicon_locked)
      }

      this._button.actor.add_child(this._icon);
      this._button.actor.connect('button-press-event', (item, event) => {
        let [ok, out, err, exit] = GLib.spawn_command_line_sync("sh -c '{ grep -q 1 /sys/bus/hid/devices/*17EF\:604*/fn_lock && echo 0 || echo 1; } | tee /sys/bus/hid/devices/*17EF\:604*/fn_lock'");
        if (out.toString().includes('0')) {
          this._icon.set_gicon(gicon_unlocked)
        } else {
          this._icon.set_gicon(gicon_locked)
        }
      });

      Main.panel.addToStatusArea('FnLock', this._button);
    }

    disable() {
        this._button?.destroy();
        this._button = null;
        this._icon?.destroy();
        this._icon = null;
    }
}
