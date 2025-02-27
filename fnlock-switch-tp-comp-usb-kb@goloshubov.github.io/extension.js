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
const FNLOCK_PATH = "/dev/fnlock-switch";


export default class FnLockExtension extends Extension {
    update_fnlock_icon() {
        const state = this.get_fnlock_state();
        if (state == "1") {
            this._icon.set_gicon(this._gicon_locked);
        } else if (state == "0") {
            this._icon.set_gicon(this._gicon_unlocked);
        } else {
            this._icon.set_gicon(this._gicon_none);
        }
    }

    get_fnlock_state() {
        try {
            const file = Gio.File.new_for_path(FNLOCK_PATH);
            const [ok, contents] = file.load_contents(null);
            const decoder = new TextDecoder('utf-8');
            const contents_string = decoder.decode(contents);
            return contents_string.trim();
        } catch (e) {
            console.error(`Error getting fn_lock state: ${e}`);
            return null;
        }
    }

    async set_fnlock_state(state) {
        try {
            const file = Gio.File.new_for_path(FNLOCK_PATH);
            const bytes = new GLib.Bytes(state);
            const [ok] = await file.replace_contents_bytes_async(bytes, null, false, Gio.FileCreateFlags.NONE, null, () => {
                this.update_fnlock_icon();
            });
            return ok;
        } catch (e) {
            console.error(`Error setting fn_lock state: ${e}`);
            return false;
        }
    }

    switch_fnlock_state() {
        const state = this.get_fnlock_state();
        if (state !== null) {
            const state_new = state === "1" ? "0" : "1";
            this.set_fnlock_state(state_new); 
        } else {
            this.update_fnlock_icon();
        }
    }

    update_fnlock_monitor() {
        const file = Gio.File.new_for_path(FNLOCK_PATH);
        const file_info = file.query_info('standard::*', Gio.FileQueryInfoFlags.NOFOLLOW_SYMLINKS, null);
        if (file_info.get_is_symlink()) {
            const target_file = Gio.File.new_for_path(file_info.get_symlink_target());
            this._fnlock_monitor_target = target_file.monitor_file(Gio.FileMonitorFlags.NONE, null);
            this._fnlock_monitor_target.connect("changed", () => {
                this.update_fnlock_icon();
            });
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

        this.update_fnlock_icon();

        this._button.add_child(this._icon);
        this._button.connect("button-press-event", () => this.switch_fnlock_state());

        Main.panel.addToStatusArea("FnLock", this._button);

        this._settings = this.getSettings();
        Main.wm.addKeybinding(
            "keybinding",
            this._settings,
            Meta.KeyBindingFlags.IGNORE_AUTOREPEAT,
            Shell.ActionMode.NORMAL | Shell.ActionMode.OVERVIEW, () => {
                this.switch_fnlock_state()
            });

        // file monitor for fnlock_path (symlink)
        const file = Gio.File.new_for_path(FNLOCK_PATH);
        this._fnlock_monitor = file.monitor_file(Gio.FileMonitorFlags.NONE, null);
        this._fnlock_monitor.connect("changed", () => {
            this.update_fnlock_monitor();
            //this.update_fnlock_icon();
        }); 

        // file monitor for fnlock_path (target)
        this.update_fnlock_monitor();

        // periodic checking in case:
        // a) usb/bt keyboard disconnected
        // b) bt keyboard: fn_lcok manually switched. 
        //    Issue (bluetooth kb only): fn_lock stat won't change, so monitor won't trigger therefore.
        this._timeout = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 2, () => {
            this.update_fnlock_icon();
            return GLib.SOURCE_CONTINUE;
        }); 
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
        this._fnlock_monitor.cancel();
        this._fnlock_monitor = null;
        if (this._fnlock_monitor_target) {
            this._fnlock_monitor_target.cancel();
            this._fnlock_monitor_target = null;
        }
        GLib.source_remove(this._timeout);
        this._timeout = null;
    }
}
