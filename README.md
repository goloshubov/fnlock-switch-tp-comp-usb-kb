# fnlock-switch-tp-comp-usb-kb
GNOME Shell Extension for Lenovo ThinkPad Compact USB Keyboard that adds switch FnLock button to GNOME top panel
https://extensions.gnome.org/extension/3939/fnlock-switch-thinkpad-compact-usb-keyboard/

\
Fn is unlocked\
![screenshot00](https://github.com/goloshubov/tp-comp-keyboard-fnlk-switch/blob/master/about/screenshots/ss00.png)

Fn is locked (FnLk)\
![screenshot01](https://github.com/goloshubov/tp-comp-keyboard-fnlk-switch/blob/master/about/screenshots/ss01.png)

Keybinding:\
\<Control> + Escape

## Why?
There is an issue with Lenovo ThinkPad Compact USB Keyboard - FnLk doesn't work by pressing Fn+Esc in Linux. Manual toggling by writing 1|0 into `/sys/bus/hid/devices/*17EF\:604*/fn_loc` is possible though, thanks to: https://github.com/lentinj/tp-compact-keyboard.

## Configuration
Notice that (GNOME) user should have write access to `/sys/bus/hid/devices/*17EF\:604*/fn_loc`

```
cat <<'EOF' >  /etc/udev/rules.d/99-thinkpad-compact-keyboard.rules
SUBSYSTEM=="hid", ATTRS{idVendor}=="17ef", ATTRS{idProduct}=="604*", \
    RUN += "/bin/sh -c 'chown change_to_your_username \"/sys/$devpath/fn_lock\"'"
EOF
```
or
```
cat <<'EOF' >  /etc/udev/rules.d/99-thinkpad-compact-keyboard.rules
SUBSYSTEM=="hid", ATTRS{idVendor}=="17ef", ATTRS{idProduct}=="604*", \
    RUN += "/bin/sh -c 'chmod 0660 \"/sys/$devpath/fn_lock\"'"
EOF
```
