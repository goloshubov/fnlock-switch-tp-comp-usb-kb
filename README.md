https://extensions.gnome.org/extension/3939/fnlock-switch-thinkpad-compact-usb-keyboard/

# fnlock-switch
GNOME shell extension that adds FnLock switch/toggle button (indicator) to GNOME top panel. Supports both:
* Lenovo ThinkPad Compact USB Keyboard
* Lenovo ThinkPad Trackpoint Keyboard II (wireless / Bluetooth)
  
\
FnLock is active (locked)\
![screenshot01](https://github.com/goloshubov/tp-comp-keyboard-fnlk-switch/blob/master/about/screenshots/locked.png)

FnLock is inactive (unlocked)\
![screenshot00](https://github.com/goloshubov/tp-comp-keyboard-fnlk-switch/blob/master/about/screenshots/unlocked.png)

FnLock not found\
![screenshot01](https://github.com/goloshubov/tp-comp-keyboard-fnlk-switch/blob/master/about/screenshots/none.png)

## Configuration
It requires write access to `/sys/.../fn_lock`, and `/dev/fnlock-switch` symlink must exist. An example udev rule:

```bash
cat <<'EOF' >  /etc/udev/rules.d/99-thinkpad-keyboard.rules
SUBSYSTEM=="input", DRIVERS=="lenovo", RUN += "/bin/sh -c 'FILE=$(find /sys/devices/ -name fn_lock 2>/dev/null); test -f $FILE && chown <CHANGE_USERNAME> $FILE && ln -f -s $FILE /dev/fnlock-switch'"
EOF
```
## Keybinding
Extension's keybinding for both keyboards is <kbd> Ctrl </kbd> + <kbd> Esc </kbd>\
It looks like there is no way to bind Fn button for keybindings, so Ctrl here is fine too.

The stadard hardware keybinding on wireless keyboard in Bluetooth mode will work as well: <kbd> Fn </kbd> + <kbd> Esc </kbd>

## Custom keybinding
TBD: prefs
```bash
# workaround
cat << EOF | dconf load /org/gnome/shell/extensions/fnlock/
[/]
keybinding=['<Control>Escape']
EOF
```
## Why?
1) FnLock current status indicator seems to be helpful
2) Solution for isssue with ThinkPad Compact USB Keyboard and Lenovo ThinkPad Trackpoint Keyboard II (2.4G wireless mode), when Fn+Esc isn't working in Linux.
   Manual toggling by writing 1|0 into `/sys/.../fn_lock` is possible though.

## ☕
If you like this GNOME extension, you may buy me a coffee sometime\
https://www.donationalerts.com/r/dmitry_goloshubov
