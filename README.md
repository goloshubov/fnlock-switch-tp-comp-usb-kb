# tp-comp-keyboard-fnlk-switch
Gnome Shell Extension - FnLk switch for Lenovo ThinkPad Compact USB Keyboard 

Why. There is an issue with Lenovo ThinkPad Compact USB Keyboard - FnLk doesn't work by pressing Fn+Esc. But manual toggling is possible thanks to:
https://github.com/lentinj/tp-compact-keyboard So it's possible to automate switching by using esekeyd. I decided write a gnome-shell-extension instead.

Fn is unlocked\
![screenshot00](https://github.com/goloshubov/tp-comp-keyboard-fnlk-switch/blob/master/about/screenshots/ss00.png)

Fn is locked (FnLk)\
![screenshot01](https://github.com/goloshubov/tp-comp-keyboard-fnlk-switch/blob/master/about/screenshots/ss01.png)

Notice that (Gnome) user should have write access to /sys/bus/hid/devices/*17EF\:604*/fn_loc
