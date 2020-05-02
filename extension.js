'use strict';

const St = imports.gi.St;
const Gio = imports.gi.Gio;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const GLib = imports.gi.GLib;
const ByteArray = imports.byteArray;
const Mainloop = imports.mainloop;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();


const FNLOCKED_ICON = "fnlk.svg";
const FNUNLOCKED_ICON = "fn.svg";

let button, icon, gicon_locked, gicon_unlocked;


function init(metadata) {
}


function toggleFNLK() {
	let [ok, out, err, exit] = GLib.spawn_command_line_sync("sh -c '{ grep -q 1 /sys/bus/hid/devices/*17EF\:604*/fn_lock && echo 0 || echo 1; } | tee /sys/bus/hid/devices/*17EF\:604*/fn_lock'");
	
  if (ByteArray.toString(out).includes('0')) {
    icon.set_gicon(gicon_locked)
  } else {
    icon.set_gicon(gicon_unlocked)
  }
}


function enable() {
	button = new PanelMenu.Button(0.0);  
  icon = new St.Icon({ style_class: 'system-status-icon' });
  gicon_locked = Gio.icon_new_for_string(Me.path + "/icons/" + FNLOCKED_ICON);  
  gicon_unlocked = Gio.icon_new_for_string(Me.path + "/icons/" + FNUNLOCKED_ICON);
  
  let [ok, out, err, exit] = GLib.spawn_command_line_sync("sh -c 'cat /sys/bus/hid/devices/*17EF\:604*/fn_lock'");  
  
  if (ByteArray.toString(out).includes('0')) {
    icon.set_gicon(gicon_locked)    
  } else {
    icon.set_gicon(gicon_unlocked)
  }
  
	button.actor.add_actor(icon);
	button.actor.connect('button-press-event', toggleFNLK);
	Main.panel.addToStatusArea('Test', button);	
}


function disable() {
	button.destroy();
}

