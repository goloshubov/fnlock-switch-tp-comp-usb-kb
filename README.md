https://extensions.gnome.org/extension/3939/fnlock-switch-thinkpad-compact-usb-keyboard/

# fnlock-switch
GNOME shell extension that adds FnLock toggle button (indicator) to GNOME top panel. Supports both:
* Lenovo ThinkPad Compact USB Keyboard
* Lenovo ThinkPad Trackpoint Keyboard II (Bluetooth mode)
  
\
FnLock is active (locked)\
![screenshot01](https://github.com/goloshubov/tp-comp-keyboard-fnlk-switch/blob/master/about/screenshots/locked.png)

FnLock is inactive (unlocked)\
![screenshot00](https://github.com/goloshubov/tp-comp-keyboard-fnlk-switch/blob/master/about/screenshots/unlocked.png)

FnLock not found\
![screenshot01](https://github.com/goloshubov/tp-comp-keyboard-fnlk-switch/blob/master/about/screenshots/none.png)

## Configuration
It needs write access to `/sys/.../fn_lock`, and `/dev/fnlock-switch` symlink must exist. An example udev rule:

```bash
cat <<'EOF' >  /etc/udev/rules.d/99-thinkpad-keyboard.rules
SUBSYSTEM=="input", DRIVERS=="lenovo", RUN += "/bin/sh -c 'FILE=$(find /sys/devices/ -name fn_lock 2>/dev/null); test -f $FILE && chown <CHANGE_USERNAME> $FILE && ln -f -s $FILE /dev/fnlock-switch'"
EOF
```
## Keybinding
Extension keybinding on USB and Bluetooth keyboards: <kbd> Ctrl </kbd> + <kbd> Esc </kbd>\
Additionally, hardware keybinding on Bluetooth keyboard will work as well: <kbd> Fn </kbd> + <kbd> Esc </kbd>

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
1) It is FnLock current status indicator
2) There is an issue with Lenovo ThinkPad Compact USB Keyboard, Fn+Esc isn't working in Linux. Manual toggling by writing 1|0 into `/sys/.../fn_lock` is possible though.
