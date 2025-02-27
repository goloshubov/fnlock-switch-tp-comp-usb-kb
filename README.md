# fnlock-switch-tp-comp-usb-kb
GNOME Shell Extension for Lenovo ThinkPad Compact Keyboards (USB or BT) that adds switch FnLock button (indicator) to GNOME top panel
https://extensions.gnome.org/extension/3939/fnlock-switch-thinkpad-compact-usb-keyboard/

\
FnLock is active (locked)\
![screenshot01](https://github.com/goloshubov/tp-comp-keyboard-fnlk-switch/blob/master/about/screenshots/locked.png)

FnLock is inactive (unlocked)\
![screenshot00](https://github.com/goloshubov/tp-comp-keyboard-fnlk-switch/blob/master/about/screenshots/unlocked.png)

FnLock not found\
![screenshot01](https://github.com/goloshubov/tp-comp-keyboard-fnlk-switch/blob/master/about/screenshots/none.png)

Keybinding by default:\
\<Control> + Escape

Custom keybinding workaround (TBD: prefs)
```bash
cat << EOF | dconf load /org/gnome/shell/extensions/fnlock/
[/]
keybinding=['<Control>Escape']
EOF
```

## Why?
There is an issue with Lenovo ThinkPad Compact USB Keyboard - FnLk doesn't work by pressing Fn+Esc in Linux. Manual toggling by writing 1|0 into `/sys/bus/hid/devices/*17EF\:604*/fn_lock` is possible though.

## Configuration
It needs write access to `/sys/bus/hid/devices/*17EF\:604*/fn_lock` and to `/dev/fnlock-switch-tp-comp-usb-kb` symlink wich must be created. An example udev rule:

```bash
cat <<'EOF' >  /etc/udev/rules.d/99-thinkpad-compact-keyboard.rules
SUBSYSTEM=="input", DRIVERS=="lenovo", RUN += "/bin/sh -c 'FILE=$(find /sys/devices/ -name fn_lock 2>/dev/null); test -f $FILE && chmod 0666 $FILE && ln -f -s $FILE /dev/fnlock-switch'"
EOF
```
